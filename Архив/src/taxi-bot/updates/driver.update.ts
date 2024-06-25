import { Action, Ctx, Hears, InjectBot, Message, On, Update } from 'nestjs-telegraf';
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
	cancelOrderByDriver,
	cancelOrderToPassenger,
	comeOnShift,
	commissionText,
	driverBlockedText,
	driverGoOrder,
	driverInPlace,
	errorValidation,
	messageFromDriver,
	notBusy,
	notBusyPassenger,
	orderNotAvailable,
	paymentTitle,
	settingsDriverText,
	startAccessOrderTypeCar,
	startEditCar,
	startEditCity,
	startEditName,
	startEditPhone,
	startSuccessOrder,
	statisticText,
	successFinishOrderToDriver,
	successFinishOrderToPassenger,
	successGoOrder,
	successSendMessage,
	toggleWorkShift,
	youHaveActiveOrder,
} from '../constatnts/message.constants';
import { setDriverSettingsKeyboard } from '../keyboards/driver/set-settings.keyboard';
import { StatusDriver } from '../types/status-driver.type';
import { GetQueryData } from '../../decorators/getCityFromInlineQuery.decorator';
import { StatusOrder } from '../../order/Enum/status-order';
import { goDriveKeyboard } from '../keyboards/driver/go-drive.keyboard';
import { finishKeyboard } from '../keyboards/driver/finish.keyboard';
import { selectRateKeyboard } from '../keyboards/select-rate.keyboard';
import { UserType } from '../../types/user.type';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../../payment/payment.service';
import { callPaymentKeyboard } from '../keyboards/driver/call-payment.keyboard';
import { Payment } from '../../payment/payment.model';
import { endOfISOWeek, startOfISOWeek } from 'date-fns';
import { selectDriverKeyboard } from '../keyboards/driver/select-driver-keyboard';
import { Throttle } from '@nestjs/throttler';
import { throttles } from '../../app/app.throttles';
import { LoggerService } from '../../logger/logger.service';

@Update()
export class TaxiBotDriverUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly driverService: DriverService,
		private readonly orderService: OrderService,
		private readonly configService: ConfigService,
		private readonly paymentService: PaymentService,
		private readonly loggerService: LoggerService,
	) {}

	/************************** Регистрация водителя **************************/
	@Throttle(throttles.send_message)
	@Hears(registrationButtons.driver.label)
	async registrationDriver(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx.reply(ConstantsService.GreetingDriverMessage, backKeyboard());
			await ctx.scene.enter(ScenesType.RegistrationDriver);
		} catch (e) {
			this.loggerService.error('registrationDriver: ' + e?.toString());
		}
	}

	/************************** Комиссия **************************/
	@Throttle(throttles.send_photo)
	@Hears(DriverButtons.profile.commission)
	async getCommission(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const now = new Date();
			const startDate = startOfISOWeek(now);
			const endDate = endOfISOWeek(now);
			const { sumCommission, count } = await this.orderService.getCommissionForWeek(
				startDate,
				endDate,
				chatId,
			);

			const payments: Payment[] = await this.paymentService.findNotPaidPayment(chatId);
			const prevSumCommission =
				payments.length > 0 ? payments.map((payment: Payment) => payment.price) : [];
			const prevCountOrder =
				payments.length > 0 ? payments.map((payment: Payment) => payment.countOrder) : [];

			await ctx.sendPhoto({ url: ConstantsService.images.commission });
			await ctx.replyWithHTML(
				commissionText(sumCommission, count, prevSumCommission, prevCountOrder),
				prevSumCommission.length > 0 ? callPaymentKeyboard(prevSumCommission) : undefined,
			);
		} catch (e) {
			this.loggerService.error('getCommission: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(new RegExp(DriverButtons.payment.pay.callback))
	async payCommission(@Ctx() ctx: TaxiBotContext, @GetQueryData() data: any) {
		try {
			const callbackData = data.split('-');
			const price = Number(callbackData[2]);
			await ctx.sendInvoice({
				title: paymentTitle,
				currency: 'RUB',
				description: paymentTitle,
				payload: 'payload',
				provider_token: this.configService.get('YOU_KASSA_TOKEN'),
				prices: [
					{
						label: paymentTitle,
						amount: price,
					},
				],
			});
		} catch (e) {
			this.loggerService.error('payCommission: ' + e?.toString());
		}
	}

	/************************** Настройки профиля **************************/
	@Throttle(throttles.send_photo)
	@Action(DriverButtons.settings.settings.callback)
	async getSettings(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
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
		} catch (e) {
			this.loggerService.error('getSettings: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.name.callback)
	async editName(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx.reply(startEditName, backKeyboard());
			await ctx.scene.enter(ScenesType.EditNameDriver);
		} catch (e) {
			this.loggerService.error('editName: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.phone.callback)
	async editPhone(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx.reply(startEditPhone, backKeyboard());
			await ctx.scene.enter(ScenesType.EditPhoneDriver);
		} catch (e) {
			this.loggerService.error('editPhone: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.city.callback)
	async editCity(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx.reply(startEditCity, backKeyboard());
			await ctx.scene.enter(ScenesType.EditCityDriver);
		} catch (e) {
			this.loggerService.error('editCity: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.car.callback)
	async editCar(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx.reply(startEditCar, backKeyboard());
			await ctx.scene.enter(ScenesType.EditCarDriver);
		} catch (e) {
			this.loggerService.error('editCar: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.accessTypeOrder.callback)
	async editAccessOrderType(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx.reply(startAccessOrderTypeCar, backKeyboard());
			await ctx.scene.enter(ScenesType.EditAccessOrderTypeDriver);
		} catch (e) {
			this.loggerService.error('editAccessOrderType: ' + e?.toString());
		}
	}

	/************************** Статистика **************************/
	@Throttle(throttles.send_photo)
	@Hears(DriverButtons.profile.statistics)
	async getStatistics(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const statistic = await this.orderService.getDriverOrdersInfo(chatId);
			await ctx.sendPhoto({ url: ConstantsService.images.statistic });
			await ctx.replyWithHTML(statisticText(statistic));
		} catch (e) {
			this.loggerService.error('getStatistics: ' + e?.toString());
		}
	}

	/************************** Статус водителя **************************/
	@Throttle(throttles.send_message)
	@Hears(DriverButtons.profile.status[StatusDriver.Offline])
	@Hears(DriverButtons.profile.status[StatusDriver.Online])
	async setStatus(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const { isBlocked, blockedType, status } = await this.driverService.findByChatId(chatId);
			if (!isBlocked) {
				const { status } = await this.driverService.toggleStatusByChatId(chatId);
				await ctx.replyWithHTML(
					toggleWorkShift[status],
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				);
				return;
			}

			await ctx.replyWithHTML(
				driverBlockedText[blockedType],
				await selectDriverKeyboard(
					{
						chatId,
						status,
					},
					this.orderService,
				),
			);
		} catch (e) {
			this.loggerService.error('setStatus: ' + e?.toString());
		}
	}

	/************************** Заказ **************************/
	@Throttle(throttles.send_message)
	@Action(new RegExp(DriverButtons.order.access.callback))
	@Action(new RegExp(DriverButtons.order.bargain.callback))
	async bargainOrder(
		@Ctx() ctx: TaxiBotContext,
		@GetQueryData() data: any,
		@ChatId() chatId: number,
	) {
		try {
			const callbackData = data.split('-');
			const orderId = callbackData[2];
			const passengerId = Number(callbackData[3]);
			const { isBusy, status: statusDriver } = await this.driverService.findByChatId(chatId);

			if (isBusy) {
				await ctx.reply(youHaveActiveOrder);
				return;
			}
			if (statusDriver == StatusDriver.Offline) {
				await ctx.reply(comeOnShift);
				return;
			}
			await ctx?.deleteMessage();
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
			await ctx?.reply(orderNotAvailable);
		} catch (e) {
			this.loggerService.error('bargainOrder' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(DriverButtons.order.inDrive.place.label)
	async inPlace(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const order = await this.orderService.findActiveOrderByDriverId(chatId);
			if (!order) {
				const { status } = await this.driverService.findByChatId(chatId);
				await ctx.reply(
					errorValidation,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				);
				return;
			}
			await this.bot.telegram.sendMessage(order.passengerId, driverInPlace);

			await ctx.reply(successSendMessage, goDriveKeyboard());
		} catch (e) {
			this.loggerService.error('inPlace' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(DriverButtons.order.inDrive.go.label)
	async goOrder(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const order = await this.orderService.findActiveOrderByDriverId(chatId);
			if (!order) {
				const { status } = await this.driverService.findByChatId(chatId);
				await ctx.reply(
					errorValidation,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				);
				return;
			}
			await this.bot.telegram.sendMessage(order.passengerId, driverGoOrder);
			await this.orderService.switchOrderStatusById(order.id, StatusOrder.InProcess);
			await ctx.reply(successGoOrder, finishKeyboard());
		} catch (e) {
			this.loggerService.error('goOrder' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(DriverButtons.order.inDrive.finish.label)
	async finishOrder(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const order = await this.orderService.findActiveOrderByDriverId(chatId);
			const { status } = await this.driverService.findByChatId(chatId);
			if (!order) {
				await ctx.reply(
					errorValidation,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				);
				return;
			}
			await this.bot.telegram.sendMessage(
				order.passengerId,
				successFinishOrderToPassenger(order.price),
				{
					parse_mode: 'HTML',
					reply_markup: selectRateKeyboard(chatId, UserType.Driver, order.numberOrder).reply_markup,
				},
			);
			await this.bot.telegram.sendMessage(order.passengerId, notBusyPassenger, {
				parse_mode: 'HTML',
				reply_markup: backKeyboard().reply_markup,
			});

			await this.orderService.successOrderFromDriver(order.id, chatId);
			await ctx.replyWithHTML(
				successFinishOrderToDriver(order.price),
				selectRateKeyboard(order.passengerId, UserType.Passenger, order.numberOrder),
			);
			await ctx.replyWithHTML(
				notBusy,
				await selectDriverKeyboard(
					{
						chatId,
						status,
					},
					this.orderService,
				),
			);
		} catch (e) {
			this.loggerService.error('finishOrder' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(DriverButtons.order.inDrive.cancel.label)
	async cancelOrder(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const order = await this.orderService.findActiveOrderByDriverId(chatId);
			const { status } = await this.driverService.findByChatId(chatId);
			if (!order) {
				await ctx.reply(
					errorValidation,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				);
				return;
			}

			await this.orderService.cancelOrderFromDriver(order.id);
			await ctx.reply(
				cancelOrderByDriver,
				await selectDriverKeyboard(
					{
						chatId,
						status,
					},
					this.orderService,
				),
			);
			await this.bot.telegram.sendMessage(order.passengerId, cancelOrderToPassenger, {
				reply_markup: backKeyboard().reply_markup,
			});
		} catch (e) {
			this.loggerService.error('cancelOrder' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@On('text')
	async onText(
		@Ctx() ctx: TaxiBotContext,
		@ChatId() chatId: number,
		@Message() message?: { text: string },
	) {
		try {
			const order = await this.orderService.findActiveOrderByDriverId(chatId);
			if (!order) {
				// const { status } = await this.driverService.findByChatId(chatId);
				// await ctx.reply(errorValidation, await selectDriverKeyboard(
				// 					{
				// 						chatId,
				// 						status,
				// 					},
				// 					this.orderService,
				// 				),);
				return;
			}
			await this.bot.telegram.sendMessage(order.passengerId, messageFromDriver + message.text);

			await ctx.reply(successSendMessage);
		} catch (e) {
			this.loggerService.error('cancelOrder' + e?.toString());
		}
	}
}
