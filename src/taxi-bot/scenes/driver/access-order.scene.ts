import { Ctx, Hears, InjectBot, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import {
	driverOffer,
	errorValidation,
	successfulProposalSubmissionText,
	timeDeliveryText,
} from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { DriverService } from '../../../driver/driver.service';
import { AcceptanceOrderByDriverContext } from '../../contexts/AcceptanceOrderByDriver.context';
import { timeDriverKeyboard } from '../../keyboards/driver/time-driver.keyboard';
import { BotName } from '../../../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { driverOfferKeyboard } from '../../keyboards/passenger/driver-offer.keyboard';
import { selectDriverKeyboard } from '../../keyboards/driver/select-driver-keyboard';
import { OrderService } from '../../../order/order.service';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.AccessOrderByDriver)
export class AccessOrderScene {
	constructor(
		private readonly driverService: DriverService,
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
				const driver = await this.driverService.findByChatId(chatId);
				await this.bot.telegram
					.sendMessage(ctx.wizard.state.passengerId, driverOffer(driver, numberTime), {
						parse_mode: 'HTML',
						reply_markup: driverOfferKeyboard(ctx.wizard.state.orderId, driver.chatId, numberTime),
					})
					.catch((e) =>
						this.loggerService.error('onSelectTime: ' + ctx?.toString() + e?.toString()),
					);
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
					.catch((e) =>
						this.loggerService.error('onSelectTime: ' + ctx?.toString() + e?.toString()),
					);
				await ctx?.scene?.leave();
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

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			await this.taxiBotService.goHome(ctx, chatId);
		} catch (e) {
			this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString());
		}
	}
}
