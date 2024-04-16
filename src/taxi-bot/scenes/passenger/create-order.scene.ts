import { Ctx, Hears, InjectBot, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import {
	accessOrder,
	errorCreateOrder,
	errorPrice,
	errorValidation,
	selectAddressTextFrom,
	selectAddressTextTo,
	selectComment,
	selectPrice,
	selectTypeOrderText,
	successOrder,
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
import { passengerProfileKeyboard } from '../../keyboards/passenger/passenger-profile.keyboard';
import { BotName } from '../../../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { DriverService } from '../../../driver/driver.service';
import { StatusOrder } from '../../../order/Enum/status-order';

@Wizard(ScenesType.CreateOrder)
export class CreateOrderScene {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly cityService: CityService,
		private readonly orderService: OrderService,
		private readonly driverService: DriverService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
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
			const selectedType = type.split(ConstantsService.callbackButtonTypeOrder)[1] as TypeOrder;
			if (Object.values(TypeOrder).includes(selectedType)) {
				ctx.wizard.state.type = selectedType;
				const { address: addresses } = await this.passengerService.findByChatId(chatId);
				await ctx.reply(
					selectAddressTextFrom,
					addresses.length && selectAddressOrderKeyboard(addresses),
				);
				await ctx.wizard.next();
				return;
			}
			await ctx.reply(errorValidation);
			return;
		} catch (e) {}
	}

	@On('callback_query')
	@WizardStep(3)
	async onAddressFromCallback(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@GetQueryData() addressFrom: string,
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			ctx.wizard.state.addressFrom = addressFrom;
			const { address: addresses } = await this.passengerService.findByChatId(chatId);
			await ctx.reply(
				selectAddressTextTo,
				addresses.length && selectAddressOrderKeyboard(addresses),
			);
			await ctx.wizard.next();
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
		@GetQueryData() addressTo: string,
	): Promise<string> {
		try {
			ctx.wizard.state.addressTo = addressTo;
			await ctx.reply(selectComment, skipCommentOrderKeyboard());
			await ctx.wizard.next();
			return;
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
				await ctx.reply(successOrder);
				// await ctx.scene.leave();
			} else if (data === PassengerButtons.order.final.edit.callback) {
				await ctx.scene.reenter();
			} else {
				await ctx.reply(errorValidation);
				return;
			}
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorCreateOrder, passengerProfileKeyboard());
			return '';
		}
	}

	@Hears(commonButtons.back)
	@Hears(commonButtons.cancelOrder.label)
	async cancelOrder(@Ctx() ctx: TaxiBotContext & CreateOrderContext, @ChatId() chatId: number) {
		await this.orderService.switchOrderStatusById(ctx.wizard.state.id, StatusOrder.CancelPassenger);
		await this.taxiBotService.goHome(ctx, chatId);
	}

	async CommentAction(
		@Ctx() ctx: WizardContext & TaxiBotContext & CreateOrderContext,
		@ChatId() chatId: number,
	) {
		const { city } = await this.passengerService.findByChatId(chatId);
		const minPrice = await this.cityService.getMinPriceByName(city);
		ctx.wizard.state.minPrice = minPrice;
		await ctx.reply(selectPrice, selectPriceOrderKeyboard(minPrice));
		await ctx.wizard.next();
		return;
	}
}
