import { Action, Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { PassengerService } from '../../passenger/passenger.service';
import { registrationButtons } from '../buttons/registration.buttons';
import { TaxiBotContext } from '../taxi-bot.context';
import { ChatId } from '../../decorators/getChatId.decorator';
import { ScenesType } from '../scenes/scenes.type';
import { PassengerButtons } from '../buttons/passenger.buttons';
import {
	cancelOffer,
	NoAddresses,
	settingsText,
	startCreateOrder,
	startDeleteAddress,
	startEditCity,
	startEditName,
	startEditPhone,
	YourAddresses,
} from '../constatnts/message.constants';
import { passengerAddressesKeyboard } from '../keyboards/passenger/passenger-addresses.keyboard';
import { backKeyboard } from '../keyboards/back.keyboard';
import { BotName } from '../../types/bot-name.type';
import { ConstantsService } from '../../constants/constants.service';
import { passengerSettingsKeyboard } from '../keyboards/passenger/passenger-settings.keyboard';
import { cancelOrderKeyboard } from '../keyboards/passenger/cancel-order.keyboard';
import { GetQueryData } from '../../decorators/getCityFromInlineQuery.decorator';

@Update()
export class TaxiBotPassengerUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly passengerService: PassengerService,
	) {}

	/************************** Регистрация пассажира **************************/
	@Hears(registrationButtons.passenger.label)
	async registrationPassenger(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(ConstantsService.GreetingPassengerMessage, backKeyboard());
		await ctx.scene.enter(ScenesType.RegistrationPassenger);
	}

	/************************** Пункт Адреса **************************/
	@Hears(PassengerButtons.profile.addresses)
	async getAddresses(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			await ctx.sendPhoto({ url: ConstantsService.images.addresses });
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
		await ctx.reply(startDeleteAddress, backKeyboard());
		await ctx.scene.enter(ScenesType.AddAddress);
	}

	@Hears(PassengerButtons.address.delete)
	async deleteAddresses(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startDeleteAddress, backKeyboard());
		await ctx.scene.enter(ScenesType.DeleteAddress);
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

	/************************** Заказ **************************/
	@Hears(PassengerButtons.profile.callCar)
	async createOrder(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startCreateOrder, cancelOrderKeyboard());
		await ctx.scene.enter(ScenesType.CreateOrder);
	}

	@Action(new RegExp(PassengerButtons.offer.cancel.callback))
	async cancelOffer(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(cancelOffer, cancelOrderKeyboard());
	}

	@Action(new RegExp(PassengerButtons.offer.success.callback))
	async successOffer(@Ctx() ctx: TaxiBotContext, @GetQueryData() data: any) {
		const callbackData = data.split('-');
		const orderId = callbackData[2];
		const driverId = Number(callbackData[3]);
		const price = Number(callbackData[4]) || null;
	}
}
