import { Action, Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { PassengerService } from '../../passenger/passenger.service';
import { registrationButtons } from '../buttons/registration.buttons';
import { TaxiBotContext } from '../taxi-bot.context';
import { ChatId } from '../../decorators/getChatId.decorator';
import { ScenesType } from '../scenes/scenes.type';
import { PassengerButtons } from '../buttons/passenger.buttons';
import {
	NoAddresses,
	settingsText,
	startAddAddress,
	startDeleteAddress,
	startEditCity,
	startEditName,
	startEditPhone,
	YourAddresses,
} from '../constatnts/message.constants';
import { passengerAddressesKeyboard } from '../keyboards/passenger-addresses.keyboard';
import { backKeyboard } from '../keyboards/back.keyboard';
import { Passenger } from '../../passenger/passenger.model';
import { passengerHelpKeyboard } from '../keyboards/passenger-help.keyboard';
import { SettingsService } from '../../settings/settings.service';
import { BotName } from '../../types/bot-name.type';
import { ConstantsService } from '../../constants/constants.service';
import { passengerSettingsKeyboard } from '../keyboards/passenger-settings.keyboard';

@Update()
export class TaxiBotPassengerUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly passengerService: PassengerService,
		private readonly settingsService: SettingsService,
	) {}

	/************************** Регистрация пользователя **************************/
	@Hears(registrationButtons.passenger.label)
	async registrationPassenger(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(ConstantsService.GreetingPassengerMessage, Markup.removeKeyboard());
		await ctx.scene.enter(ScenesType.RegistrationPassenger);
	}

	/************************** Пункт Адреса **************************/
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

	/************************** Пункт Профиль **************************/
	@Hears(PassengerButtons.profile.profile)
	async getProfile(@Ctx() ctx: TaxiBotContext) {
		const passenger = ctx.session.user as Passenger;
		await ctx.sendPhoto({ url: ConstantsService.images.profile });
		await ctx.replyWithHTML(ConstantsService.getProfileInfoPassenger(passenger));
	}

	/************************** Пункт Помощь **************************/
	@Hears(PassengerButtons.profile.help)
	async getHelp(@Ctx() ctx: TaxiBotContext) {
		await ctx.sendPhoto({ url: ConstantsService.images.help });
		await ctx.replyWithHTML(PassengerButtons.profile.help, passengerHelpKeyboard());
	}

	@Action(PassengerButtons.help.faq.callback)
	async getFaq(@Ctx() ctx: TaxiBotContext) {
		const settings = await this.settingsService.getSettings();
		await ctx.replyWithHTML(settings.faqText);
	}

	@Action(PassengerButtons.help.price.callback)
	async getPriceText(@Ctx() ctx: TaxiBotContext) {
		const settings = await this.settingsService.getSettings();
		await ctx.replyWithHTML(settings.priceText);
	}

	@Action(PassengerButtons.help.about.callback)
	async getAboutText(@Ctx() ctx: TaxiBotContext) {
		const settings = await this.settingsService.getSettings();
		await ctx.replyWithHTML(settings.aboutText);
	}

	@Action(PassengerButtons.help.support.callback)
	async getSupportText(@Ctx() ctx: TaxiBotContext) {
		const settings = await this.settingsService.getSettings();
		await ctx.replyWithHTML(settings.supportText);
	}

	/************************** Пункт Настройки **************************/
	@Hears(PassengerButtons.profile.settings)
	async getSettings(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		const { first_name, phone, city } = await this.passengerService.findByChatId(chatId);
		await ctx.sendPhoto({ url: ConstantsService.images.settings });
		await ctx.replyWithHTML(settingsText, passengerSettingsKeyboard(first_name, phone, city));
	}

	@Action(PassengerButtons.settings.name.callback)
	async editName(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startEditName, backKeyboard());
		await ctx.scene.enter(ScenesType.EditName);
	}

	@Action(PassengerButtons.settings.phone.callback)
	async editPhone(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startEditPhone, backKeyboard());
		await ctx.scene.enter(ScenesType.EditPhone);
	}

	@Action(PassengerButtons.settings.city.callback)
	async editCity(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startEditCity, backKeyboard());
		await ctx.scene.enter(ScenesType.EditCity);
	}
}
