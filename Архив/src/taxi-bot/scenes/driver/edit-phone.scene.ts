import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { errorEditInfo, successEditPhone, WhatNumber } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { DriverService } from '../../../driver/driver.service';
import { selectDriverKeyboard } from '../../keyboards/driver/select-driver-keyboard';
import { OrderService } from '../../../order/order.service';

@Wizard(ScenesType.EditPhoneDriver)
export class EditPhoneSceneDriver {
	constructor(
		private readonly driverService: DriverService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly orderService: OrderService,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		await ctx.wizard.next();
		return WhatNumber;
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
				await ctx.scene.leave();
				const { status } = await this.driverService.editPhone(chatId, msg.text);
				await ctx.reply(
					successEditPhone,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				);
				return;
			}
			await ctx.reply(valid);
			return;
		} catch (e) {
			await ctx.scene.leave();
			const { status } = await this.driverService.findByChatId(chatId);
			await ctx.reply(
				errorEditInfo,
				await selectDriverKeyboard(
					{
						chatId,
						status,
					},
					this.orderService,
				),
			);
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}
}
