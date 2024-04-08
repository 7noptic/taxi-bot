import { Ctx, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { BotName } from '../constants/default.constants';
import { PassengerService } from '../passenger/passenger.service';
import { DriverService } from '../driver/driver.service';
import {
	GreetingDriverMessage,
	greetingMessage,
	GreetingPassengerMessage,
	WelcomeMessage,
} from '../constants/messages.constants';
import { registrationKeyboard } from './keyboards/registration.keyboard';
import { registrationButtons } from './buttons/registration.buttons';
import { TaxiBotContext } from './taxi-bot.context';
import { ChatId } from '../decorators/getChatId.decorator';
import { ScenesType } from './scenes/scenes.type';
import { passengerProfileKeyboard } from './keyboards/passenger-profile.keyboard';
import { PassengerButtons } from './buttons/passenger.buttons';
import {
	goBack,
	NoAddresses,
	startAddAddress,
	startDeleteAddress,
	YourAddresses,
} from './constatnts/message.constants';
import { passengerAddressesKeyboard } from './keyboards/passenger-addresses.keyboard';
import { UserType } from '../types/user.type';
import { commonButtons } from './buttons/common.buttons';
import { backKeyboard } from './keyboards/back.keyboard';

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
		} else if (passenger) {
			ctx.session.userType = UserType.Passenger;
			ctx.session.user = passenger;
			await ctx.reply(greetingMessage, passengerProfileKeyboard());
		} else if (driver) {
			ctx.session.userType = UserType.Driver;
			ctx.session.user = driver;
		}
	}

	@Hears(registrationButtons.driver.label)
	async registrationDriver(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(GreetingDriverMessage, Markup.removeKeyboard());
		await ctx.scene.enter(ScenesType.RegistrationDriver);
	}

	@Hears(registrationButtons.passenger.label)
	async registrationPassenger(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(GreetingPassengerMessage, Markup.removeKeyboard());
		await ctx.scene.enter(ScenesType.RegistrationPassenger);
	}

	@Hears(PassengerButtons.profile.addresses)
	async getAddresses(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const passenger = await this.passengerService.findByChatId(chatId);
			await ctx.reply(
				passenger.address.length > 0 ? YourAddresses(passenger.address) : NoAddresses,
				passengerAddressesKeyboard(),
			);
		} catch (e) {
			console.log(e);
		}
	}

	@Hears(PassengerButtons.address.add)
	async addAddresses(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startAddAddress, Markup.removeKeyboard());
		await ctx.scene.enter(ScenesType.AddAddress);
	}

	@Hears(PassengerButtons.address.delete)
	async deleteAddresses(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startDeleteAddress, backKeyboard());
		await ctx.scene.enter(ScenesType.DeleteAddress);
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext) {
		if (ctx?.scene) await ctx.scene.leave();
		if (ctx.session.userType === UserType.Passenger) {
			await ctx.reply(goBack, passengerProfileKeyboard());
		}
	}
}
