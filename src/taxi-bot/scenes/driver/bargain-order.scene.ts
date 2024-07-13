import { Ctx, Hears, InjectBot, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import {
	desiredPriceText,
	driverOffer,
	errorPrice,
	errorValidation,
	successfulProposalSubmissionText,
	timeDeliveryText,
} from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { CityService } from '../../../city/city.service';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { DriverService } from '../../../driver/driver.service';
import { AcceptanceOrderByDriverContext } from '../../contexts/AcceptanceOrderByDriver.context';
import { timeDriverKeyboard } from '../../keyboards/driver/time-driver.keyboard';
import { CreateOrderContext } from '../../contexts/create-order.context';
import { wizardState } from '../../../decorators/getWizardState';
import { selectPriceOrderKeyboard } from '../../keyboards/passenger/select-price-order.keyboard';
import { BotName } from '../../../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { driverOfferKeyboard } from '../../keyboards/passenger/driver-offer.keyboard';
import { selectDriverKeyboard } from '../../keyboards/driver/select-driver-keyboard';
import { OrderService } from '../../../order/order.service';
import { ConstantsService } from '../../../constants/constants.service';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.BargainOrderByDriver)
export class BargainOrderScene {
	constructor(
		private readonly driverService: DriverService,
		private readonly cityService: CityService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly orderService: OrderService,
		private readonly loggerService: LoggerService,
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
	) {}

	@WizardStep(1)
	async onSceneEnter(
		@Ctx() ctx: WizardContext & TaxiBotContext & AcceptanceOrderByDriverContext,
	): Promise<string> {
		try {
			ctx.wizard.state.orderId = ctx.session.acceptedOrder.orderId;
			ctx.wizard.state.passengerId = ctx.session.acceptedOrder.passengerId;
			await ctx
				.replyWithHTML(timeDeliveryText, timeDriverKeyboard())
				.catch((e) => this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString()));
			ctx?.wizard?.next();
			return;
		} catch (e) {
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(2)
	async onSelectTime(
		@Ctx() ctx: WizardContext & TaxiBotContext & AcceptanceOrderByDriverContext,
		@GetQueryData() time: string,
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			const numberTime = Number(time);
			if (numberTime > 0 && numberTime < 30) {
				await ctx
					?.deleteMessage()
					.catch((e) =>
						this.loggerService.error('onSelectTime: ' + ctx?.toString() + e?.toString()),
					);
				ctx.wizard.state.time = numberTime;
				const { city } = await this.driverService.findByChatId(chatId);
				const minPrice = await this.cityService.getMinPriceByName(city);
				ctx.wizard.state.minPrice = minPrice;
				await ctx
					.replyWithHTML(
						desiredPriceText,
						selectPriceOrderKeyboard(ConstantsService.roundToNearest50(minPrice)),
					)
					.catch((e) =>
						this.loggerService.error('onSelectTime: ' + ctx?.toString() + e?.toString()),
					);
				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(errorValidation)
				.catch((e) => this.loggerService.error('onSelectTime: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onSelectTime: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(3)
	async onPriceCallback(
		@Ctx() ctx: WizardContext & TaxiBotContext & AcceptanceOrderByDriverContext,
		@GetQueryData() price: string,
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			const numberPrice = Number(price);
			if (numberPrice > 0 && numberPrice < 100_000) {
				ctx.wizard.state.price = numberPrice;
				await ctx
					?.deleteMessage()
					.catch((e) =>
						this.loggerService.error('onPriceCallback: ' + ctx?.toString() + e?.toString()),
					);
				await this.onPrice(ctx, chatId);
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
	@WizardStep(3)
	async onPriceText(
		@Ctx() ctx: WizardContext & TaxiBotContext & AcceptanceOrderByDriverContext,
		@ChatId() chatId: number,
		@Message() msg: { text: string },
		@wizardState() state: CreateOrderContext['wizard']['state'],
	): Promise<string> {
		try {
			ctx.wizard.state.price = Number(msg.text.replace(/\D/g, ''));
			if (ctx.wizard.state.price >= state.minPrice && ctx.wizard.state.price < 100_000) {
				await this.onPrice(ctx, chatId);
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

	async onPrice(
		@Ctx() ctx: WizardContext & TaxiBotContext & AcceptanceOrderByDriverContext,
		@ChatId() chatId: number,
	) {
		try {
			const driver = await this.driverService.findByChatId(chatId);
			await this.bot.telegram
				.sendMessage(
					ctx.wizard.state.passengerId,
					driverOffer(driver, ctx.wizard.state.time, ctx.wizard.state.price),
					{
						parse_mode: 'HTML',
						reply_markup: driverOfferKeyboard(
							ctx.wizard.state.orderId,
							driver.chatId,
							ctx.wizard.state.time,
							ctx.wizard.state.price,
						),
					},
				)
				.catch((e) => this.loggerService.error('onPrice: ' + ctx?.toString() + e?.toString()));
			await ctx
				.replyWithHTML(
					successfulProposalSubmissionText,
					await selectDriverKeyboard(
						{
							chatId,
							status: driver.status,
						},
						this.orderService,
					),
				)
				.catch((e) => this.loggerService.error('onPrice: ' + ctx?.toString() + e?.toString()));
			await ctx?.scene?.leave();
		} catch (e) {
			this.loggerService.error('onPrice: ' + ctx?.toString() + e?.toString());
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			await this.taxiBotService.goHome(ctx, chatId);
		} catch (e) {
			this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString());
		}
	}
}
