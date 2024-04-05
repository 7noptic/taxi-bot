import { Ctx, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { BotName } from '../constants/default.constants';
import { PassengerService } from '../passenger/passenger.service';
import { DriverService } from '../driver/driver.service';
import { ChatId } from '../decorators/getChatId';
import { GreetingPassengerMessage, WelcomeMessage } from '../constants/messages.constants';
import { registrationKeyboard } from './keyboards/registration.keyboard';
import { registrationButtons } from './buttons/registration.buttons';
import { TaxiBotContext } from './taxi-bot.context';

@Update()
export class TaxiBotUpdate {
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
			await ctx.reply(WelcomeMessage, registrationKeyboard());
		}
	}

	@Hears(registrationButtons.driver.label)
	async registrationDriver(@Ctx() ctx: TaxiBotContext) {
		// await ctx.reply(GreetingDriverMessage, Markup.removeKeyboard());
		await ctx.scene.enter('registrationWizardScene');
	}

	@Hears(registrationButtons.passenger.label)
	async registrationPassenger(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(GreetingPassengerMessage, Markup.removeKeyboard());
	}
}
