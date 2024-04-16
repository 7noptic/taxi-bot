import { Action, Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { DriverService } from '../../driver/driver.service';
import { TaxiBotContext } from '../taxi-bot.context';
import { BotName } from '../../types/bot-name.type';
import { ConstantsService } from '../../constants/constants.service';
import { registrationButtons } from '../buttons/registration.buttons';
import { ScenesType } from '../scenes/scenes.type';
import { backKeyboard } from '../keyboards/back.keyboard';
import { DriverButtons } from '../buttons/driver.buttons';
import { OrderService } from '../../order/order.service';
import { ChatId } from '../../decorators/getChatId.decorator';
import {
	commissionText,
	driverBlockedText,
	orderNotAvailable,
	settingsDriverText,
	startAccessOrderTypeCar,
	startEditCar,
	startEditCity,
	startEditName,
	startEditPhone,
	startSuccessOrder,
	statisticText,
	toggleWorkShift,
} from '../constatnts/message.constants';
import { setDriverSettingsKeyboard } from '../keyboards/driver/set-settings.keyboard';
import { StatusDriver } from '../types/status-driver.type';
import { driverProfileKeyboard } from '../keyboards/driver/profile.keyboard';
import { GetQueryData } from '../../decorators/getCityFromInlineQuery.decorator';
import { StatusOrder } from '../../order/Enum/status-order';

@Update()
export class TaxiBotDriverUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly driverService: DriverService,
		private readonly orderService: OrderService,
	) {}

	/************************** Регистрация водителя **************************/
	@Hears(registrationButtons.driver.label)
	async registrationDriver(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(ConstantsService.GreetingDriverMessage, backKeyboard());
		await ctx.scene.enter(ScenesType.RegistrationDriver);
	}

	/************************** Комиссия **************************/
	@Hears(DriverButtons.profile.commission)
	async getCommission(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		const { sumCommission, count } = await this.orderService.getCommissionForCurrentWeek(chatId);
		const { sumCommission: prevSumCommission, count: prevCount } =
			await this.orderService.getCommissionForPreviousWeek(chatId);
		await ctx.sendPhoto({ url: ConstantsService.images.commission });
		await ctx.replyWithHTML(commissionText(sumCommission, count, prevSumCommission, prevCount));
	}

	/************************** Настройки профиля **************************/
	@Action(DriverButtons.settings.settings.callback)
	async getSettings(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		const {
			first_name,
			phone,
			city,
			car: { carBrand, carColor, carNumber },
			accessOrderType,
		} = await this.driverService.findByChatId(chatId);
		await ctx.sendPhoto({ url: ConstantsService.images.settings });
		await ctx.replyWithHTML(
			settingsDriverText,
			setDriverSettingsKeyboard(
				first_name,
				phone,
				city,
				`${carColor} ${carBrand} | ${carNumber}`,
				accessOrderType,
			),
		);
	}

	@Action(DriverButtons.settings.name.callback)
	async editName(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startEditName, backKeyboard());
		await ctx.scene.enter(ScenesType.EditNameDriver);
	}

	@Action(DriverButtons.settings.phone.callback)
	async editPhone(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startEditPhone, backKeyboard());
		await ctx.scene.enter(ScenesType.EditPhoneDriver);
	}

	@Action(DriverButtons.settings.city.callback)
	async editCity(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startEditCity, backKeyboard());
		await ctx.scene.enter(ScenesType.EditCityDriver);
	}

	@Action(DriverButtons.settings.car.callback)
	async editCar(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startEditCar, backKeyboard());
		await ctx.scene.enter(ScenesType.EditCarDriver);
	}

	@Action(DriverButtons.settings.accessTypeOrder.callback)
	async editAccessOrderType(@Ctx() ctx: TaxiBotContext) {
		await ctx.reply(startAccessOrderTypeCar, backKeyboard());
		await ctx.scene.enter(ScenesType.EditAccessOrderTypeDriver);
	}

	/************************** Статистика **************************/
	@Hears(DriverButtons.profile.statistics)
	async getStatistics(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		const statistic = await this.orderService.getDriverOrdersInfo(chatId);
		await ctx.sendPhoto({ url: ConstantsService.images.statistic });
		await ctx.replyWithHTML(statisticText(statistic));
	}

	/************************** Статус водителя **************************/
	@Hears(DriverButtons.profile.status[StatusDriver.Offline])
	@Hears(DriverButtons.profile.status[StatusDriver.Online])
	async setStatus(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		const { isBlocked, blockedType } = await this.driverService.findByChatId(chatId);
		if (!isBlocked) {
			const { status } = await this.driverService.toggleStatusByChatId(chatId);
			await ctx.replyWithHTML(toggleWorkShift[status], driverProfileKeyboard(status));
			return;
		}

		await ctx.replyWithHTML(
			driverBlockedText[blockedType],
			driverProfileKeyboard(StatusDriver.Offline),
		);
	}

	/************************** Заказ **************************/
	@Action(new RegExp(DriverButtons.order.access.callback))
	@Action(new RegExp(DriverButtons.order.bargain.callback))
	async bargainOrder(@Ctx() ctx: TaxiBotContext, @GetQueryData() data: any) {
		const callbackData = data.split('-');
		const orderId = callbackData[2];
		const passengerId = Number(callbackData[3]);

		const { status } = await this.orderService.findById(orderId);
		if (status === StatusOrder.Created) {
			ctx.session.acceptedOrder = {
				orderId,
				passengerId,
			};
			await ctx.reply(startSuccessOrder, backKeyboard());
			await ctx.scene.enter(
				callbackData[1] === 'bargain'
					? ScenesType.BargainOrderByDriver
					: ScenesType.AccessOrderByDriver,
			);
			return;
		}
		await ctx.reply(orderNotAvailable);
	}
}
