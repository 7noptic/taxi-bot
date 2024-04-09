import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { BotName } from '../types/bot-name.type';
import { ChatId } from '../decorators/getChatId.decorator';
import { ConstantsService } from '../constants/constants.service';
import { PassengerService } from '../passenger/passenger.service';
import { DriverService } from '../driver/driver.service';
import { AppealService } from '../appeal/appeal.service';
import { OpenAppealKeyboard } from './keyboards/open-appeal.keyboard';
import { CloseAppealKeyboard } from './keyboards/close-appeal.keyboard';
import { HelpBotButtons } from './buttons/help-bot.buttons';
import { HelpBotContext } from './help-bot.context';
import { ScenesAppealType } from './types/scenes.type';
import { SendMessageDto } from '../appeal/dto/send-message.dto';

@Update()
export class HelpBotUpdate {
	constructor(
		@InjectBot(BotName.Help) private readonly helpBot: Telegraf<HelpBotContext>,
		private readonly passengerService: PassengerService,
		private readonly driverService: DriverService,
		private readonly appealService: AppealService,
	) {}

	@Start()
	async start(@Ctx() ctx: HelpBotContext, @ChatId() chatId: number) {
		const passenger = await this.passengerService.findByChatId(chatId);
		const driver = await this.driverService.findByChatId(chatId);
		const user = passenger || driver;

		if (!user) {
			await ctx.reply(ConstantsService.HelpBotMessage.NotRegistration, Markup.removeKeyboard());
			return;
		} else {
			const openedAppeal = await this.appealService.findOpenedAppealByChatId(chatId);
			if (openedAppeal) {
				await ctx.reply(
					ConstantsService.HelpBotMessage.GreetingWithCloseAppeal,
					CloseAppealKeyboard(),
				);
				return;
			}
			await ctx.reply(ConstantsService.HelpBotMessage.GreetingWithOpenAppeal, OpenAppealKeyboard());
		}
	}

	@Hears(HelpBotButtons.open.label)
	async openAppeal(@Ctx() ctx: HelpBotContext, @ChatId() chatId: number) {
		await ctx.reply(ConstantsService.HelpBotMessage.OpenAppeal, Markup.removeKeyboard());
		await ctx.scene.enter(ScenesAppealType.OpenAppeal);
	}

	@Hears(HelpBotButtons.close.label)
	async closeAppeal(@Ctx() ctx: HelpBotContext, @ChatId() chatId: number) {
		const closedAppeal = await this.appealService.closeAppealByChatId(chatId);
		if (closedAppeal) {
			await ctx.reply(ConstantsService.HelpBotMessage.SuccessClosedAppeal, OpenAppealKeyboard());
			return;
		}

		await ctx.reply(ConstantsService.HelpBotMessage.ErrorClosedAppeal);
	}

	@On('text')
	async onText(
		@Ctx() ctx: HelpBotContext,
		@ChatId() chatId: number,
		@Message() msg: { text: string },
	) {
		const openedAppeal = await this.appealService.findOpenedAppealByChatId(chatId);
		if (openedAppeal) {
			const message: SendMessageDto = {
				from: chatId,
				text: msg.text,
				chatId,
			};
			await this.appealService.sendMessage(openedAppeal._id.toString(), message);
			await ctx.reply(ConstantsService.HelpBotMessage.SuccessSendMessage);
			return;
		}

		await ctx.reply(ConstantsService.HelpBotMessage.NotOpenedAppeal, OpenAppealKeyboard());
	}
}
