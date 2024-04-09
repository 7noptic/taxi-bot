import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ChatId } from '../../decorators/getChatId.decorator';
import { wizardState } from '../../decorators/getWizardState';
import { ScenesAppealType } from '../types/scenes.type';
import { AppealService } from '../../appeal/appeal.service';
import { OpenAppealContext } from '../contexts/open-appeal.context';
import { ConstantsService } from '../../constants/constants.service';
import { CreateAppealDto } from '../../appeal/dto/create-appeal.dto';
import { CloseAppealKeyboard } from '../keyboards/close-appeal.keyboard';
import { OpenAppealKeyboard } from '../keyboards/open-appeal.keyboard';

@Wizard(ScenesAppealType.OpenAppeal)
export class OpenAppealScene {
	constructor(private readonly appealService: AppealService) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		await ctx.wizard.next();
		return ConstantsService.HelpBotMessage.WhatNumberOrder;
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & OpenAppealContext,
		@Message() msg: { text: string },
	): Promise<string> {
		ctx.wizard.state.numberOrder = msg.text;
		await ctx.wizard.next();
		return ConstantsService.HelpBotMessage.WhatMessage;
	}

	@On('text')
	@WizardStep(3)
	async onNumber(
		@Ctx() ctx: WizardContext & OpenAppealContext,
		@Message() msg: { text: string },
		@ChatId() chatId: number,
		@wizardState()
		state: OpenAppealContext['wizard']['state'],
	): Promise<string> {
		try {
			const appeal: CreateAppealDto = {
				numberOrder: state.numberOrder,
				from: chatId,
				messages: [
					{
						from: chatId,
						date: new Date(),
						text: msg.text,
					},
				],
			};

			await ctx.scene.leave();
			await this.appealService.create(appeal);
			await ctx.reply(ConstantsService.HelpBotMessage.SuccessOpenAppeal, CloseAppealKeyboard());
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(ConstantsService.HelpBotMessage.ErrorClosedAppeal, OpenAppealKeyboard());
			return '';
		}
	}
}
