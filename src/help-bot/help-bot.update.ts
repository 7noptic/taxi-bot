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
import { LoggerService } from '../logger/logger.service';

@Update()
export class HelpBotUpdate {
	constructor(
		@InjectBot(BotName.Help) private readonly helpBot: Telegraf<HelpBotContext>,
		private readonly passengerService: PassengerService,
		private readonly driverService: DriverService,
		private readonly appealService: AppealService,
		private readonly loggerService: LoggerService,
	) {}

	@Start()
	async start(@Ctx() ctx: HelpBotContext, @ChatId() chatId: number) {
		try {
			const passenger = await this.passengerService.findByChatId(chatId);
			const driver = await this.driverService.findByChatId(chatId);
			const user = passenger || driver;

			if (!user) {
				await ctx.replyWithHTML(
					ConstantsService.HelpBotMessage.NotRegistration,
					Markup.removeKeyboard(),
				);
				return;
			} else {
				const openedAppeal = await this.appealService.findOpenedAppealByChatId(chatId);
				if (openedAppeal) {
					await ctx.replyWithHTML(
						ConstantsService.HelpBotMessage.GreetingWithCloseAppeal,
						CloseAppealKeyboard(),
					);
					return;
				}
				await ctx.replyWithHTML(
					ConstantsService.HelpBotMessage.GreetingWithOpenAppeal,
					OpenAppealKeyboard(),
				);
			}
		} catch (e) {
			this.loggerService.error('create HelpBotUpdate: ' + e?.toString());
		}
	}

	@Hears(HelpBotButtons.open.label)
	async openAppeal(@Ctx() ctx: HelpBotContext, @ChatId() chatId: number) {
		try {
			await ctx.replyWithHTML(ConstantsService.HelpBotMessage.OpenAppeal, Markup.removeKeyboard());
			await ctx.scene.enter(ScenesAppealType.OpenAppeal);
		} catch (e) {
			this.loggerService.error('openAppeal HelpBotUpdate: ' + e?.toString());
		}
	}

	@Hears(HelpBotButtons.close.label)
	async closeAppeal(@Ctx() ctx: HelpBotContext, @ChatId() chatId: number) {
		try {
			const closedAppeal = await this.appealService.closeAppealByChatId(chatId);
			if (closedAppeal) {
				await ctx.replyWithHTML(
					ConstantsService.HelpBotMessage.SuccessClosedAppeal,
					OpenAppealKeyboard(),
				);
				return;
			}

			await ctx.replyWithHTML(ConstantsService.HelpBotMessage.ErrorClosedAppeal);
		} catch (e) {
			this.loggerService.error('closeAppeal HelpBotUpdate: ' + e?.toString());
		}
	}

	@On('text')
	async onText(
		@Ctx() ctx: HelpBotContext,
		@ChatId() chatId: number,
		@Message() msg: { text: string },
	) {
		try {
			const openedAppeal = await this.appealService.findOpenedAppealByChatId(chatId);
			if (openedAppeal) {
				const message: SendMessageDto = {
					from: chatId,
					text: msg.text,
					chatId,
				};
				await this.appealService.sendMessage(openedAppeal._id.toString(), message);
				await ctx.replyWithHTML(ConstantsService.HelpBotMessage.SuccessSendMessage);
				return;
			}

			await ctx.replyWithHTML(
				ConstantsService.HelpBotMessage.NotOpenedAppeal,
				OpenAppealKeyboard(),
			);
		} catch (e) {
			this.loggerService.error('onText HelpBotUpdate: ' + e?.toString());
		}
	}
}
