import { Ctx, Hears, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import {
	errorEditInfo,
	successEditAccessOrderType,
	WhatAccessOrderType,
} from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { DriverService } from '../../../driver/driver.service';
import { selectAccessOrderTypeKeyboard } from '../../keyboards/driver/select-access-order-type.keyboard';
import { Driver } from '../../../driver/driver.model';
import { AccessTypeOrder } from '../../../driver/Enum/access-type-order';
import { selectDriverKeyboard } from '../../keyboards/driver/select-driver-keyboard';
import { OrderService } from '../../../order/order.service';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.EditAccessOrderTypeDriver)
export class EditAccessOrderTypeSceneDriver {
	constructor(
		private readonly driverService: DriverService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly orderService: OrderService,
		private readonly loggerService: LoggerService,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		try {
			await ctx
				.replyWithHTML(WhatAccessOrderType, selectAccessOrderTypeKeyboard())
				.catch((e) => this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString()));
			ctx?.wizard?.next();
			return;
		} catch (e) {
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(2)
	async onCity(
		@Ctx() ctx: WizardContext & TaxiBotContext,
		@GetQueryData() accessOrderType: Driver['accessOrderType'],
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			await ctx?.scene?.leave();
			if (Object.values(AccessTypeOrder).includes(accessOrderType)) {
				const { status } = await this.driverService.editAccessTypeOrder(chatId, accessOrderType);
				await ctx
					.replyWithHTML(
						successEditAccessOrderType,
						await selectDriverKeyboard({ chatId, status }, this.orderService),
					)
					.catch((e) => this.loggerService.error('onCity: ' + ctx?.toString() + e?.toString()));
			} else {
				await this.showError(ctx, chatId);
			}
			return '';
		} catch (e) {
			await ctx?.scene?.leave();
			await this.showError(ctx, chatId);
			this.loggerService.error('onCity: ' + ctx?.toString() + e?.toString());
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			await this.taxiBotService
				.goHome(ctx, chatId)
				.catch((e) => this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString());
		}
	}

	async showError(@Ctx() ctx: WizardContext & TaxiBotContext, @ChatId() chatId: number) {
		try {
			const { status } = await this.driverService.findByChatId(chatId);
			await ctx
				.replyWithHTML(
					errorEditInfo,
					await selectDriverKeyboard({ chatId, status }, this.orderService),
				)
				.catch((e) => this.loggerService.error('showError: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('showError: ' + ctx?.toString() + e?.toString());
		}
	}
}
