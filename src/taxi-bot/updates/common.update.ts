import { Ctx, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { PassengerService } from '../../passenger/passenger.service';
import { DriverService } from '../../driver/driver.service';
import { registrationKeyboard } from '../keyboards/registration.keyboard';
import { TaxiBotContext } from '../taxi-bot.context';
import { ChatId } from '../../decorators/getChatId.decorator';
import { passengerProfileKeyboard } from '../keyboards/passenger-profile.keyboard';
import { goBack } from '../constatnts/message.constants';
import { commonButtons } from '../buttons/common.buttons';
import { BotName } from '../../types/bot-name.type';
import { ConstantsService } from '../../constants/constants.service';
import { driverProfileKeyboard } from '../keyboards/driver/profile.keyboard';

@Update()
export class TaxiBotCommonUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly passengerService: PassengerService,
		private readonly driverService: DriverService,
	) {}

	@Start()
	async start(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		const passenger = await this.passengerService.findByChatId(chatId);
		const driver = await this.driverService.findByChatId(chatId);

		if (!passenger && !driver) {
			await ctx.replyWithHTML(ConstantsService.WelcomeMessage, registrationKeyboard());
		} else if (passenger) {
			await ctx.reply(ConstantsService.greetingMessage, passengerProfileKeyboard());
		} else if (driver) {
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		if (ctx?.scene) await ctx.scene.leave();
		const passenger = await this.passengerService.findByChatId(chatId);
		if (passenger) {
			await ctx.reply(goBack, passengerProfileKeyboard());
			return;
		}
		const driver = await this.driverService.findByChatId(chatId);

		if (driver) {
			await ctx.reply(goBack, driverProfileKeyboard());
			return;
		}
		await ctx.reply(goBack, registrationKeyboard());
	}
}
