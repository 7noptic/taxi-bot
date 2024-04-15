import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { errorEditInfo, successEditName, WhatName } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { DriverService } from '../../../driver/driver.service';
import { driverProfileKeyboard } from '../../keyboards/driver/profile.keyboard';

@Wizard(ScenesType.EditNameDriver)
export class EditNameSceneDriver {
	constructor(
		private readonly driverService: DriverService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
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
				const { status } = await this.driverService.editName(chatId, msg.text);
				await ctx.reply(successEditName, driverProfileKeyboard(status));
				return;
			}
			await ctx.reply(valid);
			return;
		} catch (e) {
			await ctx.scene.leave();
			const { status } = await this.driverService.findByChatId(chatId);
			await ctx.reply(errorEditInfo, driverProfileKeyboard(status));
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}
}
