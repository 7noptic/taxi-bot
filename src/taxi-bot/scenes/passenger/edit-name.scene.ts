import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import { errorEditInfo, successEditName, WhatName } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { selectPassengerKeyboard } from '../../keyboards/passenger/select-passenger-keyboard';
import { OrderService } from '../../../order/order.service';

@Wizard(ScenesType.EditName)
export class EditNameScene {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly orderService: OrderService,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		await ctx.wizard.next();
		return WhatName;
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & TaxiBotContext,
		@Message() msg: { text: string },
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 2, 30);
			if (valid === true) {
				await ctx.scene.leave();
				await this.passengerService.editName(chatId, msg.text);
				await ctx.replyWithHTML(
					successEditName,
					await selectPassengerKeyboard(chatId, this.orderService),
				);
				return;
			}
			await ctx.replyWithHTML(valid);
			return;
		} catch (e) {
			await ctx.scene.leave();
			await ctx.replyWithHTML(
				errorEditInfo,
				await selectPassengerKeyboard(chatId, this.orderService),
			);
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}
}
