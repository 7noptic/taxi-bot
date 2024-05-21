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
	errorCreateOrder,
	errorMain,
	errorPrice,
	errorValidation,
	messageFromPassenger,
	offerIsNoLongerValid,
	orderNotAvailable,
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
		await ctx.reply(selectTypeOrderText, selectTypeOrderKeyboard());
		await ctx.wizard.next();
		return;
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
				ctx.wizard.state.type = selectedType as TypeOrder;
				const { address: addresses } = await this.passengerService.findByChatId(chatId);
				await ctx.reply(
					selectAddressTextFrom,
					addresses.length && selectAddressOrderKeyboard(addresses),
				);
				await ctx.wizard.next();
				return;
			}
			return;
		} catch (e) {
			await ctx.reply(errorMain);
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
				ctx.wizard.state.addressFrom = await this.passengerService.findAddressByName(
					chatId,
					addressNameFrom,
				);

				const { address: addresses } = await this.passengerService.findByChatId(chatId);

				await ctx.reply(
					selectAddressTextTo,
					addresses.length && selectAddressOrderKeyboard(addresses),
				);
				await ctx.wizard.next();
			}

			return;
		} catch (e) {}
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
				const { address: addresses } = await this.passengerService.findByChatId(chatId);
				await ctx.reply(
					selectAddressTextTo,
					addresses.length && selectAddressOrderKeyboard(addresses),
				);
				await ctx.wizard.next();
				return;
			}
			await ctx.reply(valid);
			return;
		} catch (e) {}
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
				ctx.wizard.state.addressTo = await this.passengerService.findAddressByName(
					chatId,
					addressNameTo,
				);
				await ctx.reply(selectComment, skipCommentOrderKeyboard());
				await ctx.wizard.next();
				return;
			}
		} catch (e) {}
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
				await ctx.reply(selectComment, skipCommentOrderKeyboard());
				await ctx.wizard.next();
				return;
			}
			await ctx.reply(valid);
			return;
		} catch (e) {}
	}

	@On('callback_query')
	@WizardStep(5)
	async onCommentCallback(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
	) {
		try {
			ctx.wizard.state.comment = '';
			await this.CommentAction(ctx, chatId);
			return;
		} catch (e) {}
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
			await ctx.reply(valid);
			return;
		} catch (e) {}
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
				ctx.wizard.state.price = numberPrice;
				await ctx.reply(
					accessOrder(
						PassengerButtons.order.type[state.type].label,
						state.addressFrom,
						state.addressTo,
						state.price,
						state.comment,
					),
					finalOrderKeyboard(),
				);
				await ctx.wizard.next();
				return;
			}
			await ctx.reply(errorValidation);
			return;
		} catch (e) {}
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
				await ctx.reply(
					accessOrder(
						PassengerButtons.order.type[state.type].label,
						state.addressFrom,
						state.addressTo,
						state.price,
						state.comment,
					),
					finalOrderKeyboard(),
				);
				await ctx.wizard.next();
				return;
			}
			await ctx.reply(errorPrice(state.minPrice));
			return;
		} catch (e) {}
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

				const order = await this.orderService.create(createOrderDto);
				ctx.wizard.state.id = order._id.toString();
				const rating = await this.passengerService.getRatingById(chatId);
				await this.driverService.sendBulkOrder(order, rating);
				await ctx.replyWithHTML(successOrder(order.numberOrder));
				await ctx.wizard.next();
			} else if (data === PassengerButtons.order.final.edit.callback) {
				await ctx.scene.reenter();
			} else {
				await ctx.reply(errorValidation);
				return;
			}
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorCreateOrder, await selectPassengerKeyboard(chatId, this.orderService));
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
			if (driver.isBusy || driver.status === StatusDriver.Offline) {
				await ctx.reply(offerIsNoLongerValid);
				return;
			}

			const order = await this.orderService.selectDriverForOrder(
				orderId,
				driverId,
				submissionTime,
				price,
			);
			const passenger = await this.passengerService.findByChatId(chatId);

			await ctx.sendPhoto({ url: ConstantsService.images.inDrive });
			await ctx.replyWithHTML(successOfferText(order, driver));
			await this.bot.telegram.sendMessage(driverId, successOfferForDriver(order, passenger), {
				parse_mode: 'HTML',
				reply_markup: inDriveKeyboard().reply_markup,
			});
			ctx.wizard.state.driverId = driverId;
			await ctx.wizard.next();
		} catch (e) {
			await ctx.reply(orderNotAvailable);
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
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 0, 300);
			if (valid === true) {
				await ctx.reply(successSendMessage);
				await this.bot.telegram.sendMessage(state.driverId, messageFromPassenger + msg.text);
				return;
			}
			await ctx.reply(valid);
			return;
		} catch (e) {
			this.loggerService.error('onText: ' + e?.toString());
		}
	}

	@Hears(commonButtons.cancelOrder.label)
	async cancelOrder(@Ctx() ctx: TaxiBotContext & CreateOrderContext, @ChatId() chatId: number) {
		await this.orderService.switchOrderStatusById(ctx.wizard.state.id, StatusOrder.CancelPassenger);
		await this.taxiBotService.goHome(ctx, chatId);
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
			await this.bot.telegram.sendMessage(ctx.wizard.state.driverId, cancelOrderForDriver, {
				reply_markup: keyboard.reply_markup,
			});
		}
	}

	@Hears(commonButtons.back)
	@Start()
	async back(@Ctx() ctx: TaxiBotContext & CreateOrderContext, @ChatId() chatId: number) {
		// await this.orderService.switchOrderStatusById(ctx.wizard.state.id, StatusOrder.CancelPassenger);
		await this.taxiBotService.goHome(ctx, chatId);
	}

	@Action(new RegExp(PassengerButtons.offer.cancel.callback))
	async cancelOffer(@Ctx() ctx: TaxiBotContext & WizardContext & CreateOrderContext) {
		await ctx?.deleteMessage();
	}

	async CommentAction(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
	) {
		const { city } = await this.passengerService.findByChatId(chatId);
		const minPrice = await this.cityService.getMinPriceByName(city);
		ctx.wizard.state.minPrice = minPrice;
		await ctx.reply(
			selectPrice,
			selectPriceOrderKeyboard(ConstantsService.roundToNearest50(minPrice)),
		);
		await ctx.wizard.next();
		return;
	}
}
