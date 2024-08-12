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
	confirmCancelOrder,
	driverBlockedText,
	driverGoOrder,
	driverInGo,
	driverInPlace,
	errorValidation,
	linkForPayment,
	messageFromDriver,
	notBusy,
	notBusyPassenger,
	notConfirmCancelOrder,
	notPayment,
	orderCloseNextOrder,
	orderNotAvailable,
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
	successfulPayment,
	successGoOrder,
	successSecondOfferForDriver,
	successSendMessage,
	toggleWorkShift,
	workFinish,
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
import { differenceInMinutes, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { selectDriverKeyboard } from '../keyboards/driver/select-driver-keyboard';
import { Throttle } from '@nestjs/throttler';
import { throttles } from '../../app/app.throttles';
import { LoggerService } from '../../logger/logger.service';
import { SettingsService } from '../../settings/settings.service';
import { AlreadyLeavingKeyboard } from '../keyboards/passenger/already-leaving.keyboard';
import { cancelOrderKeyboard } from '../keyboards/driver/cancel-order.keyboard';
import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { IPaidKeyboard } from '../keyboards/driver/i-paid.keyboard';

@Update()
export class TaxiBotDriverUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly driverService: DriverService,
		private readonly orderService: OrderService,
		private readonly configService: ConfigService,
		private readonly paymentService: PaymentService,
		private readonly loggerService: LoggerService,
		private readonly settingsService: SettingsService,
	) {}

	/************************** Регистрация водителя **************************/
	@Throttle(throttles.send_message)
	@Hears(registrationButtons.driver.label)
	async registrationDriver(@Ctx() ctx: TaxiBotContext) {
		try {
			// await ctx
			// 	.replyWithHTML(ConstantsService.GreetingDriverMessage, backKeyboard())
			// 	.catch((e) => this.loggerService.error('registrationDriver: ' + e?.toString()));
			await ctx.scene
				.enter(ScenesType.RegistrationDriver)
				.catch((e) =>
					this.loggerService.error('registrationDriver: ' + ctx?.toString() + e?.toString()),
				);
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

			const { commission } = await this.settingsService.getSettings();
			const { commission: driverCommissionServer, commissionExpiryDate } =
				await this.driverService.findByChatId(chatId);
			const driverCommission =
				driverCommissionServer > 0 && commissionExpiryDate > new Date()
					? driverCommissionServer
					: 0;

			await ctx
				.replyWithPhoto(
					{
						url: ConstantsService.images.commission,
					},
					{
						caption: commissionText(
							commission,
							sumCommission,
							count,
							prevSumCommission,
							prevCountOrder,
							driverCommission,
						),
						parse_mode: 'HTML',
						reply_markup:
							prevSumCommission.length > 0
								? callPaymentKeyboard(prevSumCommission).reply_markup
								: undefined,
					},
				)
				.catch((e) => this.loggerService.error('getCommission: ' + e?.toString()));
		} catch (e) {
			this.loggerService.error('getCommission: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(new RegExp(DriverButtons.payment.pay.callback))
	async payCommission(
		@Ctx() ctx: TaxiBotContext,
		@GetQueryData() data: any,
		@ChatId() chatId: number,
	) {
		try {
			const callbackData = data.split('-');
			const price = Number(callbackData[2]);

			const { phone } = await this.driverService.findByChatId(chatId);
			const { numberPayment } = await this.paymentService.findByPriceNotPaidPayment(
				chatId,
				Math.round(price / 100),
			);
			const checkout = new YooCheckout({
				shopId: this.configService.get('YOU_KASSA_SHOP_ID'),
				secretKey: this.configService.get('YOU_KASSA_SECRET_KEY'),
			});
			const idempotenceKey = numberPayment.split(' ')[1];
			const payload = this.paymentService.createTGPayload(price, phone);
			// console.log(JSON.stringify(payload));
			const payment = await checkout
				.createPayment(payload, idempotenceKey)
				.catch((e) => this.loggerService.error('payCommission: ' + e?.toString()));

			if (!!payment) {
				const link = payment?.confirmation?.confirmation_url;
				if (!link) {
					await ctx.replyWithHTML(errorValidation);
					return;
				}

				await ctx.replyWithHTML(
					linkForPayment(link),
					IPaidKeyboard(payment.id, price, idempotenceKey),
				);
				return;
			}
			await ctx.replyWithHTML(errorValidation);
		} catch (e) {
			this.loggerService.error('payCommission: ' + e?.toString());
			console.log(e);
		}
	}

	@Throttle(throttles.send_message)
	@Action(new RegExp(DriverButtons.payment.iPaid.callback))
	async checkPayment(
		@Ctx() ctx: TaxiBotContext,
		@GetQueryData() data: any,
		@ChatId() chatId: number,
	) {
		const callbackData = data.split('_');
		const checkout = new YooCheckout({
			shopId: this.configService.get('YOU_KASSA_SHOP_ID'),
			secretKey: this.configService.get('YOU_KASSA_SECRET_KEY'),
		});

		const paymentId = callbackData[2];
		const price = Number(callbackData[3]);
		const idempotenceKey = callbackData[4];
		const convertedPrice: string = Math.round(price / 100).toFixed(2);
		try {
			const payment = await checkout.getPayment(paymentId);
			if (payment) {
				if (payment.status === 'waiting_for_capture') {
					try {
						const capturePayload: ICapturePayment = {
							amount: {
								value: convertedPrice,
								currency: 'RUB',
							},
						};
						const payment = await checkout.capturePayment(
							paymentId,
							capturePayload,
							idempotenceKey,
						);
						// console.log(payment);
						if (!!payment) {
							const myPayment = await this.paymentService.closePayment(
								chatId,
								Math.round(price / 100),
							);
							console.log(myPayment);
							await ctx.replyWithHTML(successfulPayment).catch((e) => {
								console.log('checkPayment success no error: ' + e?.toString());
								this.loggerService.error('checkPayment success no error: ' + e?.toString());
							});
						}
					} catch (e) {
						console.log('checkPayment: ' + e?.toString());
						this.loggerService.error('checkPayment: ' + e?.toString());
					}
				} else {
					await ctx.replyWithHTML(notPayment);
				}
			} else {
				await ctx.replyWithHTML(notPayment);
			}
		} catch (e: any) {
			console.log('checkPayment: ' + e?.toString());
			this.loggerService.error('checkPayment: ' + e?.toString());
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
			await ctx
				.replyWithPhoto(
					{
						url: ConstantsService.images.settings,
					},
					{
						caption: settingsDriverText,
						parse_mode: 'HTML',
						reply_markup: setDriverSettingsKeyboard(
							first_name,
							phone,
							city,
							`${carColor} ${carBrand} | ${carNumber}`,
							accessOrderType,
						).reply_markup,
					},
				)
				.catch((e) => this.loggerService.error('getSettings: ' + e?.toString()));
		} catch (e) {
			this.loggerService.error('getSettings: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.name.callback)
	async editName(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startEditName, backKeyboard())
				.catch((e) => this.loggerService.error('editName: ' + e?.toString()));
			await ctx.scene
				.enter(ScenesType.EditNameDriver)
				.catch((e) => this.loggerService.error('editName: ' + e?.toString()));
		} catch (e) {
			this.loggerService.error('editName: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.phone.callback)
	async editPhone(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startEditPhone, backKeyboard())
				.catch((e) => this.loggerService.error('editPhone: ' + ctx?.toString() + e?.toString()));
			await ctx.scene
				.enter(ScenesType.EditPhoneDriver)
				.catch((e) => this.loggerService.error('editPhone: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('editPhone: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.city.callback)
	async editCity(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startEditCity, backKeyboard())
				.catch((e) => this.loggerService.error('editCity: ' + ctx?.toString() + e?.toString()));
			await ctx.scene
				.enter(ScenesType.EditCityDriver)
				.catch((e) => this.loggerService.error('editCity: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('editCity: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.car.callback)
	async editCar(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startEditCar, backKeyboard())
				.catch((e) => this.loggerService.error('editCar: ' + ctx?.toString() + e?.toString()));
			await ctx.scene
				.enter(ScenesType.EditCarDriver)
				.catch((e) => this.loggerService.error('editCar: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('editCar: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(DriverButtons.settings.accessTypeOrder.callback)
	async editAccessOrderType(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(startAccessOrderTypeCar, backKeyboard())
				.catch((e) =>
					this.loggerService.error('editAccessOrderType: ' + ctx?.toString() + e?.toString()),
				);
			await ctx.scene
				.enter(ScenesType.EditAccessOrderTypeDriver)
				.catch((e) =>
					this.loggerService.error('editAccessOrderType: ' + ctx?.toString() + e?.toString()),
				);
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
			await ctx
				.replyWithPhoto(
					{
						url: ConstantsService.images.statistic,
					},
					{
						caption: statisticText(statistic),
						parse_mode: 'HTML',
					},
				)
				.catch((e) =>
					this.loggerService.error('getStatistics: ' + ctx?.toString() + e?.toString()),
				);
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
				await ctx
					.replyWithHTML(
						toggleWorkShift[status],
						await selectDriverKeyboard(
							{
								chatId,
								status,
							},
							this.orderService,
						),
					)
					.catch((e) => this.loggerService.error('setStatus: ' + ctx?.toString() + e?.toString()));
				return;
			}

			await ctx
				.replyWithHTML(
					driverBlockedText[blockedType],
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				)
				.catch((e) => this.loggerService.error('setStatus: ' + ctx?.toString() + e?.toString()));
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
			const secondActiveOrder = await this.orderService.findSecondActiveOrderByDriverId(chatId);

			if (isBusy || !!secondActiveOrder) {
				await ctx.replyWithHTML(youHaveActiveOrder);
				return;
			}
			if (statusDriver == StatusDriver.Offline) {
				await ctx.replyWithHTML(comeOnShift);
				return;
			}
			await ctx
				?.deleteMessage()
				.catch((e) => this.loggerService.error('bargainOrder: ' + ctx?.toString() + e?.toString()));
			const { status } = await this.orderService.findById(orderId);
			if (status === StatusOrder.Created) {
				ctx.session.acceptedOrder = {
					orderId,
					passengerId,
				};
				await ctx
					.replyWithHTML(startSuccessOrder, backKeyboard())
					.catch((e) =>
						this.loggerService.error('bargainOrder: ' + ctx?.toString() + e?.toString()),
					);
				await ctx.scene
					.enter(
						callbackData[1] === 'bargain'
							? ScenesType.BargainOrderByDriver
							: ScenesType.AccessOrderByDriver,
					)
					.catch((e) =>
						this.loggerService.error('bargainOrder: ' + ctx?.toString() + e?.toString()),
					);
				return;
			}
			await ctx
				?.replyWithHTML(orderNotAvailable)
				.catch((e) => this.loggerService.error('bargainOrder: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('bargainOrder' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(DriverButtons.order.inDrive.place.label)
	async inPlace(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const order = await this.orderService.findActiveOrderByDriverId(chatId);
			const { status, car } = await this.driverService.findByChatId(chatId);
			if (!order) {
				await ctx
					.replyWithHTML(
						errorValidation,
						await selectDriverKeyboard(
							{
								chatId,
								status,
							},
							this.orderService,
						),
					)
					.catch((e) => this.loggerService.error('inPlace: ' + ctx?.toString() + e?.toString()));
				return;
			}
			await this.bot.telegram
				.sendMessage(order.passengerId, driverInPlace(order.type, car), {
					parse_mode: 'HTML',
					reply_markup: AlreadyLeavingKeyboard(),
				})
				.catch((e) => this.loggerService.error('inPlace: ' + ctx?.toString() + e?.toString()));
			await this.orderService.switchOrderStatusById(order.id, StatusOrder.InPlace);
			await ctx
				.replyWithHTML(successSendMessage, goDriveKeyboard())
				.catch((e) => this.loggerService.error('inPlace: ' + ctx?.toString() + e?.toString()));
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
				await ctx
					.replyWithHTML(
						errorValidation,
						await selectDriverKeyboard(
							{
								chatId,
								status,
							},
							this.orderService,
						),
					)
					.catch((e) => this.loggerService.error('goOrder: ' + ctx?.toString() + e?.toString()));
				return;
			}
			await this.bot.telegram
				.sendMessage(order.passengerId, driverGoOrder, {
					reply_markup: { remove_keyboard: true },
				})
				.catch((e) => this.loggerService.error('goOrder: ' + ctx?.toString() + e?.toString()));
			await this.orderService.switchOrderStatusById(order.id, StatusOrder.InProcess);
			const { status } = await this.driverService.switchBusyByChatId(chatId, false);
			await ctx
				.replyWithHTML(successGoOrder, finishKeyboard(status))
				.catch((e) => this.loggerService.error('goOrder: ' + ctx?.toString() + e?.toString()));
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
				await ctx
					.replyWithHTML(
						errorValidation,
						await selectDriverKeyboard(
							{
								chatId,
								status,
							},
							this.orderService,
						),
					)
					.catch((e) =>
						this.loggerService.error('finishOrder: ' + ctx?.toString() + e?.toString()),
					);
				return;
			}
			await this.bot.telegram
				.sendMessage(order.passengerId, successFinishOrderToPassenger(order.price), {
					parse_mode: 'HTML',
					reply_markup: selectRateKeyboard(chatId, UserType.Driver, order.numberOrder).reply_markup,
				})
				.catch((e) => this.loggerService.error('finishOrder: ' + ctx?.toString() + e?.toString()));
			await this.bot.telegram
				.sendMessage(order.passengerId, notBusyPassenger, {
					parse_mode: 'HTML',
					reply_markup: backKeyboard().reply_markup,
				})
				.catch((e) => this.loggerService.error('finishOrder: ' + ctx?.toString() + e?.toString()));

			await this.orderService.successOrderFromDriver(order.id, chatId);
			await ctx
				.replyWithHTML(
					successFinishOrderToDriver(order.price),
					selectRateKeyboard(order.passengerId, UserType.Passenger, order.numberOrder),
				)
				.catch((e) => this.loggerService.error('finishOrder: ' + ctx?.toString() + e?.toString()));

			const secondActiveOrder = await this.orderService.findSecondActiveOrderByDriverId(chatId);
			if (!!secondActiveOrder) {
				await this.orderService.switchOrderStatusById(secondActiveOrder.id, StatusOrder.Wait);
				await this.driverService.switchBusyByChatId(chatId, true);
			}
			const text = !!secondActiveOrder
				? orderCloseNextOrder
				: status === StatusDriver.Online
					? notBusy
					: workFinish;

			await ctx
				.replyWithHTML(
					text,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				)
				.catch((e) => this.loggerService.error('finishOrder: ' + ctx?.toString() + e?.toString()));

			if (!!secondActiveOrder) {
				const minute =
					secondActiveOrder.submissionTime -
					// @ts-ignore
					differenceInMinutes(new Date(), secondActiveOrder!.findDriverAt);
				await this.bot.telegram.sendMessage(secondActiveOrder.passengerId, driverInGo(minute), {
					parse_mode: 'HTML',
				});
				await ctx
					.replyWithHTML(successSecondOfferForDriver(secondActiveOrder, minute))
					.catch((e) =>
						this.loggerService.error('finishOrder: ' + ctx?.toString() + e?.toString()),
					);
			}
		} catch (e) {
			this.loggerService.error('finishOrder' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(DriverButtons.order.inDrive.cancel.label)
	async getCancelOrderKeyboard(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx
				.replyWithHTML(confirmCancelOrder, cancelOrderKeyboard())
				.catch((e) =>
					this.loggerService.error('getCancelOrderKeyboard: ' + ctx?.toString() + e?.toString()),
				);
		} catch (e) {
			this.loggerService.error('getCancelOrderKeyboard' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(DriverButtons.order.inDrive.cancelFail.label)
	async notCancelOrderKeyboard(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const { status } = await this.driverService.findByChatId(chatId);
			await ctx
				.replyWithHTML(
					notConfirmCancelOrder,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				)
				.catch((e) =>
					this.loggerService.error('getCancelOrderKeyboard: ' + ctx?.toString() + e?.toString()),
				);
		} catch (e) {
			this.loggerService.error('getCancelOrderKeyboard' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(DriverButtons.order.inDrive.cancelSuccess.label)
	async cancelOrder(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const order = await this.orderService.findActiveOrderByDriverId(chatId);
			const { status } = await this.driverService.findByChatId(chatId);
			if (!order) {
				await ctx
					.replyWithHTML(
						errorValidation,
						await selectDriverKeyboard(
							{
								chatId,
								status,
							},
							this.orderService,
						),
					)
					.catch((e) =>
						this.loggerService.error('cancelOrder: ' + ctx?.toString() + e?.toString()),
					);
				return;
			}

			await this.orderService.cancelOrderFromDriver(order.id);
			await ctx
				.replyWithHTML(
					cancelOrderByDriver,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				)
				.catch((e) => this.loggerService.error('cancelOrder: ' + ctx?.toString() + e?.toString()));
			await this.bot.telegram
				.sendMessage(order.passengerId, cancelOrderToPassenger, {
					reply_markup: backKeyboard().reply_markup,
				})
				.catch((e) => this.loggerService.error('cancelOrder: ' + ctx?.toString() + e?.toString()));
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
				// await ctx.replyWithHTML(errorValidation, await selectDriverKeyboard(
				// 					{
				// 						chatId,
				// 						status,
				// 					},
				// 					this.orderService,
				// 				),);
				return;
			}
			await this.bot.telegram
				.sendMessage(order.passengerId, messageFromDriver + message.text)
				.catch((e) => this.loggerService.error('cancelOrder: ' + ctx?.toString() + e?.toString()));

			await ctx
				.replyWithHTML(successSendMessage)
				.catch((e) => this.loggerService.error('cancelOrder: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('cancelOrder' + e?.toString());
		}
	}
}
