import { Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { DriverService } from '../../driver/driver.service';
import { TaxiBotContext } from '../taxi-bot.context';
import { BotName } from '../../types/bot-name.type';
import { ConstantsService } from '../../constants/constants.service';
import { registrationButtons } from '../buttons/registration.buttons';
import { ScenesType } from '../scenes/scenes.type';
import { backKeyboard } from '../keyboards/back.keyboard';

@Update()
export class TaxiBotDriverUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly driverService: DriverService,
	) {}

	/************************** Регистрация водителя **************************/
	@Hears(registrationButtons.driver.label)
	async registrationDriver(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(ConstantsService.GreetingDriverMessage, backKeyboard());
		await ctx.scene.enter(ScenesType.RegistrationDriver);
	}
}
