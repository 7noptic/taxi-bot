import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import {
	accessOrder,
	errorCreateOrder,
	errorPrice,
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
import { selectTypeOrderKeyboard } from '../../keyboards/select-type-order.keyboard';
import { CreateOrderContext } from '../../contexts/create-order.context';
import { ConstantsService } from '../../../constants/constants.service';
import { TypeOrder } from '../../../order/Enum/type-order';
import { selectAddressOrderKeyboard } from '../../keyboards/select-address-order.keyboard';
import { skipCommentOrderKeyboard } from '../../keyboards/skip-comment-order.keyboard';
import { selectPriceOrderKeyboard } from '../../keyboards/select-price-order.keyboard';
import { PassengerButtons } from '../../buttons/passenger.buttons';
import { wizardState } from '../../../decorators/getWizardState';
import { finalOrderKeyboard } from '../../keyboards/final-order.keyboard';
import { OrderService } from '../../../order/order.service';
import { CreateOrderDto } from '../../../order/dto/create-order.dto';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { passengerProfileKeyboard } from '../../keyboards/passenger-profile.keyboard';

@Wizard(ScenesType.CreateOrder)
export class CreateOrderScene {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly cityService: CityService,
		private readonly orderService: OrderService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
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
			ctx.wizard.state.type = type.split(ConstantsService.callbackButtonTypeOrder)[1] as TypeOrder;
			const { address: addresses } = await this.passengerService.findByChatId(chatId);
			await ctx.reply(
				selectAddressTextFrom,
				addresses.length && selectAddressOrderKeyboard(addresses),
			);
			await ctx.wizard.next();
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
			ctx.wizard.state.price = Number(price);
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
			console.log(ctx.wizard.state.price);
			if (ctx.wizard.state.price >= state.minPrice) {
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
				const createOrderDto: CreateOrderDto = {
					type: state.type,
					addressFrom: state.addressFrom,
					addressTo: state.addressTo,
					comment: state.comment,
					price: state.price,
					passengerId: chatId,
				};

				await this.orderService.create(createOrderDto);
				await ctx.reply(successOrder);
				await ctx.scene.leave();
			} else if (data === PassengerButtons.order.final.edit.callback) {
				await ctx.scene.reenter();
			}
			return;
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorCreateOrder, passengerProfileKeyboard());
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}

	@Hears(commonButtons.cancelOrder.label)
	async cancelOrder(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
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
