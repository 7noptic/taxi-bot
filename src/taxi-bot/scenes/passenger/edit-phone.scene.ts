import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import { errorEditInfo, successEditPhone, WhatNumber } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { selectPassengerKeyboard } from '../../keyboards/passenger/select-passenger-keyboard';
import { OrderService } from '../../../order/order.service';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.EditPhone)
export class EditPhoneScene {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly orderService: OrderService,
		private readonly loggerService: LoggerService,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		try {
			ctx?.wizard?.next();
			return WhatNumber;
		} catch (e) {
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(2)
	async onPhone(
		@Ctx() ctx: WizardContext & TaxiBotContext,
		@Message() msg: { text: string },
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.isPhone(msg.text);
			if (valid === true) {
				await ctx?.scene?.leave();
				await this.passengerService.editPhone(chatId, msg.text);
				await ctx
					.replyWithHTML(successEditPhone, await selectPassengerKeyboard(chatId, this.orderService))
					.catch((e) => this.loggerService.error('onPhone: ' + ctx?.toString() + e?.toString()));
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onPhone: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			await ctx?.scene?.leave();
			await ctx
				.replyWithHTML(errorEditInfo, await selectPassengerKeyboard(chatId, this.orderService))
				.catch((e) => this.loggerService.error('onPhone: ' + ctx?.toString() + e?.toString()));
			return '';
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
