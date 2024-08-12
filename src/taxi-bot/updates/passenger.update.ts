import { Action, Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { PassengerService } from '../../passenger/passenger.service';
import { registrationButtons } from '../buttons/registration.buttons';
import { TaxiBotContext } from '../taxi-bot.context';
import { ChatId } from '../../decorators/getChatId.decorator';
import { ScenesType } from '../scenes/scenes.type';
import { PassengerButtons } from '../buttons/passenger.buttons';
import {
	isBlockedPassenger,
	maxAddress,
	NoAddresses,
	settingsText,
	startAddAddress,
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
import { LoggerService } from '../../logger/logger.service';
import { Throttle } from '@nestjs/throttler';
import { throttles } from '../../app/app.throttles';
import { cancelOrderKeyboard } from '../keyboards/passenger/cancel-order.keyboard';

@Update()
export class TaxiBotPassengerUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly passengerService: PassengerService,
		private readonly loggerService: LoggerService,
	) {}

	/************************** Регистрация пассажира **************************/
	@Throttle(throttles.send_message)
	@Hears(registrationButtons.passenger.label)
	async registrationPassenger(@Ctx() ctx: TaxiBotContext) {
		try {
			// await ctx
			// 	.replyWithHTML(ConstantsService.GreetingPassengerMessage, backKeyboard())
			// 	.catch((e) =>
			// 		this.loggerService.error('registrationPassenger: ' + ctx?.toString() + e?.toString()),
			// 	);
			await ctx.scene
				.enter(ScenesType.RegistrationPassenger)
				.catch((e) =>
					this.loggerService.error('registrationPassenger: ' + ctx?.toString() + e?.toString()),
				);
		} catch (e) {
			this.loggerService.error('registrationPassenger: ' + e?.toString());
		}
	}

	/************************** Пункт Адреса **************************/
	@Throttle(throttles.send_photo)
	@Hears(PassengerButtons.profile.addresses)
	async getAddresses(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const passenger = await this.passengerService.findByChatId(chatId);

			await ctx
				.replyWithPhoto(
					{
						url: ConstantsService.images.addresses,
					},
					{
						caption: passenger.address.length > 0 ? YourAddresses(passenger.address) : NoAddresses,
						parse_mode: 'HTML',
						reply_markup: passengerAddressesKeyboard().reply_markup,
					},
				)
				.catch((e) => this.loggerService.error('getAddresses: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('getAddresses: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(PassengerButtons.address.add)
	async addAddresses(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const { address } = await this.passengerService.findByChatId(chatId);
			if (address.length >= ConstantsService.defaultMaxAddresses) {
				await ctx
					.replyWithHTML(maxAddress)
					.catch((e) =>
						this.loggerService.error('addAddresses: ' + ctx?.toString() + e?.toString()),
					);
				return;
			}
			await ctx
				.replyWithHTML(startAddAddress, backKeyboard())
				.catch((e) => this.loggerService.error('addAddresses: ' + ctx?.toString() + e?.toString()));
			await ctx.scene
				.enter(ScenesType.AddAddress)
				.catch((e) => this.loggerService.error('addAddresses: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('addAddresses: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(PassengerButtons.address.delete)
	async deleteAddresses(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startDeleteAddress, backKeyboard())
				.catch((e) =>
					this.loggerService.error('deleteAddresses: ' + ctx?.toString() + e?.toString()),
				);
			await ctx.scene
				.enter(ScenesType.DeleteAddress)
				.catch((e) =>
					this.loggerService.error('deleteAddresses: ' + ctx?.toString() + e?.toString()),
				);
		} catch (e) {
			this.loggerService.error('deleteAddresses: ' + e?.toString());
		}
	}

	/************************** Пункт Настройки **************************/
	@Throttle(throttles.send_photo)
	@Hears(PassengerButtons.profile.settings)
	async getSettings(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const { first_name, phone, city } = await this.passengerService.findByChatId(chatId);

			await ctx
				.replyWithPhoto(
					{
						url: ConstantsService.images.settings,
					},
					{
						caption: settingsText,
						parse_mode: 'HTML',
						reply_markup: passengerSettingsKeyboard(first_name, phone, city).reply_markup,
					},
				)
				.catch((e) => this.loggerService.error('getSettings: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('getSettings: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(PassengerButtons.settings.name.callback)
	async editName(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startEditName, backKeyboard())
				.catch((e) => this.loggerService.error('editName: ' + ctx?.toString() + e?.toString()));
			await ctx.scene
				.enter(ScenesType.EditName)
				.catch((e) => this.loggerService.error('editName: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('editName: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(PassengerButtons.settings.phone.callback)
	async editPhone(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startEditPhone, backKeyboard())
				.catch((e) => this.loggerService.error('editPhone: ' + ctx?.toString() + e?.toString()));
			await ctx.scene
				.enter(ScenesType.EditPhone)
				.catch((e) => this.loggerService.error('editPhone: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('editPhone: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(PassengerButtons.settings.city.callback)
	async editCity(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startEditCity, backKeyboard())
				.catch((e) => this.loggerService.error('editCity: ' + ctx?.toString() + e?.toString()));
			await ctx.scene
				.enter(ScenesType.EditCity)
				.catch((e) => this.loggerService.error('editCity: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('editCity: ' + e?.toString());
		}
	}

	/************************** Заказ **************************/
	@Throttle(throttles.send_message)
	@Hears(PassengerButtons.profile.callCar)
	async createOrder(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const { isBlocked } = await this.passengerService.findByChatId(chatId);
			if (!!isBlocked) {
				await ctx
					.replyWithHTML(isBlockedPassenger)
					.catch((e) =>
						this.loggerService.error('createOrder: ' + ctx?.toString() + e?.toString()),
					);
				return;
			}
			await ctx
				.replyWithHTML(startCreateOrder, cancelOrderKeyboard())
				.catch((e) => this.loggerService.error('createOrder: ' + ctx?.toString() + e?.toString()));
			await ctx.scene
				.enter(ScenesType.CreateOrder)
				.catch((e) => this.loggerService.error('createOrder: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('createOrder: ' + e?.toString());
		}
	}
}
