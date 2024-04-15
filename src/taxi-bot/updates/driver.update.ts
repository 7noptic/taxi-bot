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
	settingsDriverText,
	startAccessOrderTypeCar,
	startEditCar,
	startEditCity,
	startEditName,
	startEditPhone,
	statisticText,
} from '../constatnts/message.constants';
import { setDriverSettingsKeyboard } from '../keyboards/driver/set-settings.keyboard';

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
}
