import {
	Action,
	Ctx,
	Hears,
	InjectBot,
	Message,
	On,
	Start,
	Wizard,
	WizardStep,
} from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import {
	accessOrder,
	cancelOrderForDriver,
	cancelOrderTimeout,
	errorCreateOrder,
	errorMain,
	errorPrice,
	errorValidation,
	messageFromPassenger,
	NotDrivers,
	offerIsNoLongerValid,
	orderNotAvailable,
	passengerAlreadyLeaving,
	selectAddressTextFrom,
	selectAddressTextTo,
	selectComment,
	selectPrice,
	selectTypeOrderText,
	successOfferForDriver,
	successOfferText,
	successOrder,
	successSendMessage,
} from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { CityService } from '../../../city/city.service';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { selectTypeOrderKeyboard } from '../../keyboards/passenger/select-type-order.keyboard';
import { CreateOrderContext } from '../../contexts/create-order.context';
import { ConstantsService } from '../../../constants/constants.service';
import { TypeOrder } from '../../../order/Enum/type-order';
import { selectAddressOrderKeyboard } from '../../keyboards/passenger/select-address-order.keyboard';
import { skipCommentOrderKeyboard } from '../../keyboards/passenger/skip-comment-order.keyboard';
import { selectPriceOrderKeyboard } from '../../keyboards/passenger/select-price-order.keyboard';
import { PassengerButtons } from '../../buttons/passenger.buttons';
import { wizardState } from '../../../decorators/getWizardState';
import { finalOrderKeyboard } from '../../keyboards/passenger/final-order.keyboard';
import { OrderService } from '../../../order/order.service';
import { CreateOrderDto } from '../../../order/dto/create-order.dto';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { BotName } from '../../../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { DriverService } from '../../../driver/driver.service';
import { StatusOrder } from '../../../order/Enum/status-order';
import { inDriveKeyboard } from '../../keyboards/driver/in-drive.keyboard';
import { StatusDriver } from '../../types/status-driver.type';
import { selectDriverKeyboard } from '../../keyboards/driver/select-driver-keyboard';
import { selectPassengerKeyboard } from '../../keyboards/passenger/select-passenger-keyboard';
import { Throttle } from '@nestjs/throttler';
import { throttles } from '../../../app/app.throttles';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.CreateOrder)
export class CreateOrderScene {
	timeout: number;

	constructor(
		private readonly passengerService: PassengerService,
		private readonly cityService: CityService,
		private readonly orderService: OrderService,
		private readonly driverService: DriverService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly loggerService: LoggerService,
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		try {
			await ctx
				.replyWithHTML(selectTypeOrderText, selectTypeOrderKeyboard())
				.catch((e) => this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString()));
			ctx?.wizard?.next();
			return;
		} catch (e) {
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(2)
	async onTypeOrder(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@GetQueryData() type: string,
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			const selectedType = type.split(ConstantsService.callbackButtonTypeOrder)[1] || '';
			if (Object.values(TypeOrder).includes(selectedType as TypeOrder)) {
				await ctx
					.deleteMessage()
					.catch((e) =>
						this.loggerService.error('onTypeOrder: ' + ctx?.toString() + e?.toString()),
					);
				ctx.wizard.state.type = selectedType as TypeOrder;
				const {
					address: addresses,
					savedAddress,
					city,
				} = await this.passengerService.findByChatId(chatId);
				const isActivesDrivers = await this.driverService.checkActiveDrivers({
					city,
					type: ctx.wizard.state.type,
				});

				if (!isActivesDrivers) {
					await ctx
						.replyWithHTML(NotDrivers)
						.catch((e) =>
							this.loggerService.error('onTypeOrder: ' + ctx?.toString() + e?.toString()),
						);
					await this.cancelOrder(ctx, chatId);
					return;
				}

				await ctx
					.replyWithHTML(
						selectAddressTextFrom,
						(addresses.length || savedAddress.length) &&
							selectAddressOrderKeyboard(addresses, savedAddress),
					)
					.catch((e) =>
						this.loggerService.error('onTypeOrder: ' + ctx?.toString() + e?.toString()),
					);
				ctx?.wizard?.next();
				return;
			}
			return;
		} catch (e) {
			await ctx
				.replyWithHTML(errorMain)
				.catch((e) => this.loggerService.error('onTypeOrder: ' + ctx?.toString() + e?.toString()));
			await this.taxiBotService.goHome(ctx, chatId);
			this.loggerService.error('onTypeOrder: ' + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(3)
	async onAddressFromCallback(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@GetQueryData() addressNameFrom: string,
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			if (addressNameFrom) {
				await ctx
					.deleteMessage()
					.catch((e) =>
						this.loggerService.error('onAddressFromCallback: ' + ctx?.toString() + e?.toString()),
					);
				ctx.wizard.state.addressFrom =
					(await this.passengerService.findAddressByName(chatId, addressNameFrom)) ||
					addressNameFrom;

				const { address: addresses, savedAddress } =
					await this.passengerService.findByChatId(chatId);

				await ctx
					.replyWithHTML(
						selectAddressTextTo,
						(addresses.length || savedAddress.length) &&
							selectAddressOrderKeyboard(addresses, savedAddress),
					)
					.catch((e) =>
						this.loggerService.error('onAddressFromCallback: ' + ctx?.toString() + e?.toString()),
					);
				ctx?.wizard?.next();
			}

			return;
		} catch (e) {
			this.loggerService.error('onAddressFromCallback: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(3)
	async onAddressFromText(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 5, 100);
			if (valid === true) {
				ctx.wizard.state.addressFrom = msg.text;
				const { address: addresses, savedAddress } =
					await this.passengerService.findByChatId(chatId);
				await ctx
					.replyWithHTML(
						selectAddressTextTo,
						(addresses.length || savedAddress.length) &&
							selectAddressOrderKeyboard(addresses, savedAddress),
					)
					.catch((e) =>
						this.loggerService.error('onAddressFromText: ' + ctx?.toString() + e?.toString()),
					);
				await this.passengerService.addSavedAddress(chatId, ctx.wizard.state.addressFrom);
				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) =>
					this.loggerService.error('onAddressFromText: ' + ctx?.toString() + e?.toString()),
				);
			return;
		} catch (e) {
			this.loggerService.error('onAddressFromText: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(4)
	async onAddressToCallback(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@GetQueryData() addressNameTo: string,
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			if (addressNameTo) {
				await ctx?.deleteMessage();
				ctx.wizard.state.addressTo =
					(await this.passengerService.findAddressByName(chatId, addressNameTo)) || addressNameTo;
				await ctx
					.replyWithHTML(selectComment, skipCommentOrderKeyboard())
					.catch((e) =>
						this.loggerService.error('onAddressToCallback: ' + ctx?.toString() + e?.toString()),
					);
				ctx?.wizard?.next();
				return;
			}
		} catch (e) {
			this.loggerService.error('onAddressToCallback: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(4)
	async onAddressToText(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 5, 100);
			if (valid === true) {
				ctx.wizard.state.addressTo = msg.text;
				await ctx
					.replyWithHTML(selectComment, skipCommentOrderKeyboard())
					.catch((e) =>
						this.loggerService.error('onAddressToText: ' + ctx?.toString() + e?.toString()),
					);
				ctx?.wizard?.next();
				await this.passengerService.addSavedAddress(chatId, ctx.wizard.state.addressTo);
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) =>
					this.loggerService.error('onAddressToText: ' + ctx?.toString() + e?.toString()),
				);
			return;
		} catch (e) {
			this.loggerService.error('onAddressToText: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(5)
	async onCommentCallback(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
	) {
		try {
			await ctx
				?.deleteMessage()
				.catch((e) =>
					this.loggerService.error('onCommentCallback: ' + ctx?.toString() + e?.toString()),
				);
			ctx.wizard.state.comment = '';
			await this.CommentAction(ctx, chatId);
			return;
		} catch (e) {
			this.loggerService.error('onCommentCallback: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(5)
	async onCommentText(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 0, 300);
			if (valid === true) {
				ctx.wizard.state.comment = msg.text;
				await this.CommentAction(ctx, chatId);
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) =>
					this.loggerService.error('onCommentText: ' + ctx?.toString() + e?.toString()),
				);
			return;
		} catch (e) {
			this.loggerService.error('onCommentText: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(6)
	async onPriceCallback(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@GetQueryData() price: string,
		@wizardState() state: CreateOrderContext['wizard']['state'],
	): Promise<string> {
		try {
			const numberPrice = Number(price);
			if (numberPrice > 0 && numberPrice < 100_000) {
				await ctx
					.deleteMessage()
					.catch((e) =>
						this.loggerService.error('onPriceCallback: ' + ctx?.toString() + e?.toString()),
					);
				ctx.wizard.state.price = numberPrice;
				await ctx
					.replyWithHTML(
						accessOrder(
							PassengerButtons.order.type[state.type].label,
							state.addressFrom,
							state.addressTo,
							state.price,
							state.comment,
						),
						finalOrderKeyboard(),
					)
					.catch((e) =>
						this.loggerService.error('onPriceCallback: ' + ctx?.toString() + e?.toString()),
					);
				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(errorValidation)
				.catch((e) =>
					this.loggerService.error('onPriceCallback: ' + ctx?.toString() + e?.toString()),
				);
			return;
		} catch (e) {
			this.loggerService.error('onPriceCallback: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(6)
	async onPriceText(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
		@Message() msg: { text: string },
		@wizardState() state: CreateOrderContext['wizard']['state'],
	): Promise<string> {
		try {
			ctx.wizard.state.price = Number(msg.text.replace(/\D/g, ''));
			if (ctx.wizard.state.price >= state.minPrice && ctx.wizard.state.price < 100_000) {
				await ctx
					.replyWithHTML(
						accessOrder(
							PassengerButtons.order.type[state.type].label,
							state.addressFrom,
							state.addressTo,
							state.price,
							state.comment,
						),
						finalOrderKeyboard(),
					)
					.catch((e) =>
						this.loggerService.error('onPriceText: ' + ctx?.toString() + e?.toString()),
					);
				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(errorPrice(state.minPrice))
				.catch((e) => this.loggerService.error('onPriceText: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onPriceText: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(7)
	async onFinalCallback(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@GetQueryData() data: string,
		@wizardState() state: CreateOrderContext['wizard']['state'],
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			if (data === PassengerButtons.order.final.success.callback) {
				await ctx
					.deleteMessage()
					.catch((e) =>
						this.loggerService.error('onFinalCallback: ' + ctx?.toString() + e?.toString()),
					);
				const { city } = await this.passengerService.findByChatId(chatId);
				const createOrderDto: CreateOrderDto = {
					type: state.type,
					addressFrom: state.addressFrom,
					addressTo: state.addressTo,
					comment: state.comment,
					price: state.price,
					passengerId: chatId,
					city,
				};
				const isActivesDrivers = await this.driverService.checkActiveDrivers({
					city,
					type: ctx.wizard.state.type,
				});
				if (!isActivesDrivers) {
					await ctx
						.replyWithHTML(NotDrivers)
						.catch((e) =>
							this.loggerService.error('onFinalCallback: ' + ctx?.toString() + e?.toString()),
						);
					await this.cancelOrder(ctx, chatId);
					return;
				} else {
					const order = await this.orderService.create(createOrderDto);
					ctx.wizard.state.id = order._id.toString();
					const rating = await this.passengerService.getRatingById(chatId);
					await this.driverService.sendBulkOrder(order, rating);
					await ctx
						.replyWithHTML(successOrder(order.numberOrder))
						.catch((e) =>
							this.loggerService.error('onFinalCallback: ' + ctx?.toString() + e?.toString()),
						);
					console.log('timer error999: ', !!this.timeout, chatId);
					this.loggerService.error('timer error999: ' + chatId + ' - ' + !!this.timeout);
					//@ts-ignore
					this.timeout = setTimeout(
						async () => {
							await this.cancelOrder(ctx, chatId, true);
						},
						15 * 60 * 1000, // 15 минут
					);
					console.log('timer error999111: ', !!this.timeout, chatId);
					this.loggerService.error('timer error999111: ' + chatId + ' - ' + !!this.timeout);
					ctx?.wizard?.next();
				}
			} else if (data === PassengerButtons.order.final.edit.callback) {
				await ctx
					.deleteMessage()
					.catch((e) =>
						this.loggerService.error('onFinalCallback: ' + ctx?.toString() + e?.toString()),
					);
				await ctx.scene
					.reenter()
					.catch((e) =>
						this.loggerService.error('onFinalCallback: ' + ctx?.toString() + e?.toString()),
					);
			} else {
				await ctx
					.replyWithHTML(errorValidation)
					.catch((e) =>
						this.loggerService.error('onFinalCallback: ' + ctx?.toString() + e?.toString()),
					);
				return;
			}
		} catch (e) {
			await ctx?.scene?.leave();
			await ctx
				.replyWithHTML(errorCreateOrder, await selectPassengerKeyboard(chatId, this.orderService))
				.catch((e) =>
					this.loggerService.error('onFinalCallback: ' + ctx?.toString() + e?.toString()),
				);
			return '';
		}
	}

	@WizardStep(8)
	@Action(new RegExp(PassengerButtons.offer.success.callback))
	async successOffer(
		@Ctx() ctx: TaxiBotContext & WizardContext & CreateOrderContext,
		@ChatId() chatId: number,
		@GetQueryData() data: any,
	) {
		try {
			const callbackData = data.split('-');
			const orderId = callbackData[2];
			const driverId = Number(callbackData[3]);
			const submissionTime = Number(callbackData[4]);
			const price = Number(callbackData[5]) || null;
			const driver = await this.driverService.findByChatId(driverId);
			const activeOrderFromDriver = await this.orderService.findActiveOrderByDriverId(driverId);
			await ctx
				?.deleteMessage()
				.catch((e) => this.loggerService.error('successOffer: ' + ctx?.toString() + e?.toString()));

			if (driver.isBusy || driver.status === StatusDriver.Offline) {
				await ctx
					.replyWithHTML(offerIsNoLongerValid)
					.catch((e) =>
						this.loggerService.error('successOffer: ' + ctx?.toString() + e?.toString()),
					);
				return;
			}

			const order = await this.orderService.selectDriverForOrder(
				orderId,
				driverId,
				submissionTime,
				!!activeOrderFromDriver,
				price,
			);
			const passenger = await this.passengerService.findByChatId(chatId);

			await ctx
				.replyWithPhoto(
					{
						url: ConstantsService.images.inDrive,
					},
					{
						caption: successOfferText(order, driver, !!activeOrderFromDriver),
						parse_mode: 'HTML',
					},
				)
				.catch((e) => this.loggerService.error('successOffer: ' + ctx?.toString() + e?.toString()));
			console.log('timer error10000: ', !!this.timeout, chatId);
			this.loggerService.error('timer error10000: ' + chatId + ' - ' + !!this.timeout);
			if (!!this.timeout) {
				clearTimeout(this.timeout);
			}
			await this.bot.telegram
				.sendMessage(driverId, successOfferForDriver(order, passenger, !!activeOrderFromDriver), {
					parse_mode: 'HTML',
					reply_markup: !activeOrderFromDriver ? inDriveKeyboard().reply_markup : undefined,
				})
				.catch((e) => this.loggerService.error('successOffer: ' + ctx?.toString() + e?.toString()));

			ctx.wizard.state.driverId = driverId;
			ctx?.wizard?.next();
		} catch (e) {
			await ctx
				.replyWithHTML(orderNotAvailable)
				.catch((e) => this.loggerService.error('successOffer: ' + ctx?.toString() + e?.toString()));
			this.loggerService.error('successOffer: ' + ctx?.toString() + e?.toString());
		}
	}

	@Throttle(throttles.send_photo)
	@On('text')
	@WizardStep(9)
	async onText(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
		@wizardState() state: CreateOrderContext['wizard']['state'],
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const order = await this.orderService.findActiveOrderByPassengerId(chatId);
			if (!order) {
				await this.taxiBotService.goHome(ctx, chatId);
				return;
			}
			if (!order || order.status == StatusOrder.DriverInBusy) {
				return;
			}
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 0, 300);
			if (valid === true) {
				await ctx
					.replyWithHTML(successSendMessage)
					.catch((e) => this.loggerService.error('onText: ' + ctx?.toString() + e?.toString()));
				await this.bot.telegram
					.sendMessage(state.driverId, messageFromPassenger + msg.text)
					.catch((e) => this.loggerService.error('onText: ' + ctx?.toString() + e?.toString()));
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onText: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onText: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_photo)
	@Action(PassengerButtons.order.leaving.callback)
	@WizardStep(9)
	async onAlreadyLeaving(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@wizardState() state: CreateOrderContext['wizard']['state'],
	): Promise<string> {
		try {
			await ctx
				.replyWithHTML(successSendMessage)
				.catch((e) =>
					this.loggerService.error('onAlreadyLeaving: ' + ctx?.toString() + e?.toString()),
				);
			await this.bot.telegram
				.sendMessage(state.driverId, passengerAlreadyLeaving)
				.catch((e) =>
					this.loggerService.error('onAlreadyLeaving: ' + ctx?.toString() + e?.toString()),
				);
			return;
		} catch (e) {
			this.loggerService.error('onAlreadyLeaving: ' + e?.toString());
		}
	}

	@Hears(commonButtons.cancelOrder.label)
	async cancelOrder(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
		isCancelTimeout?: boolean,
	) {
		try {
			await this.orderService.switchOrderStatusById(
				ctx.wizard.state.id,
				StatusOrder.CancelPassenger,
			);
			await this.taxiBotService.goHome(ctx, chatId);
			console.log(!!this.timeout, !!isCancelTimeout, chatId);
			this.loggerService.error(
				'timer error1: ' + chatId + ' - ' + (!!this.timeout && !!isCancelTimeout),
			);
			if (!!this.timeout && !!isCancelTimeout) {
				this.loggerService.error(
					'timer error2: ' + chatId + ' - ' + (!!this.timeout && !!isCancelTimeout),
				);
				await ctx
					.replyWithHTML(cancelOrderTimeout)
					.catch((e) =>
						this.loggerService.error('cancelOrder: ' + ctx?.toString() + e?.toString()),
					);
				clearTimeout(this.timeout);
			}
			if (ctx.wizard.state.driverId) {
				await this.driverService.switchBusyByChatId(ctx.wizard.state.driverId, false);
				const { status, chatId: driverChatId } = await this.driverService.findByChatId(
					ctx.wizard.state.driverId,
				);
				const keyboard = await selectDriverKeyboard(
					{
						chatId: driverChatId,
						status,
					},
					this.orderService,
				);
				await this.bot.telegram
					.sendMessage(ctx.wizard.state.driverId, cancelOrderForDriver, {
						reply_markup: keyboard.reply_markup,
					})
					.catch((e) =>
						this.loggerService.error('cancelOrder: ' + ctx?.toString() + e?.toString()),
					);
			}
		} catch (e) {
			this.loggerService.error('cancelOrder: ' + e?.toString());
		}
	}

	@Hears(commonButtons.back)
	@Start()
	async back(@Ctx() ctx: TaxiBotContext & CreateOrderContext, @ChatId() chatId: number) {
		try {
			await this.taxiBotService.goHome(ctx, chatId);
		} catch (e) {
			this.loggerService.error('back: ' + e?.toString());
		}
	}

	@Action(new RegExp(PassengerButtons.offer.cancel.callback))
	async cancelOffer(@Ctx() ctx: TaxiBotContext & WizardContext & CreateOrderContext) {
		try {
			await ctx
				?.deleteMessage()
				.catch((e) => this.loggerService.error('cancelOffer: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('cancelOffer: ' + e?.toString());
		}
	}

	async CommentAction(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
	) {
		try {
			const { city } = await this.passengerService.findByChatId(chatId);
			const minPrice = await this.cityService.getMinPriceByName(city);
			ctx.wizard.state.minPrice = minPrice;
			await ctx
				.replyWithHTML(
					selectPrice,
					selectPriceOrderKeyboard(ConstantsService.roundToNearest50(minPrice)),
				)
				.catch((e) =>
					this.loggerService.error('CommentAction: ' + ctx?.toString() + e?.toString()),
				);
			ctx?.wizard?.next();
			return;
		} catch (e) {
			this.loggerService.error('CommentAction: ' + e?.toString());
		}
	}
}
