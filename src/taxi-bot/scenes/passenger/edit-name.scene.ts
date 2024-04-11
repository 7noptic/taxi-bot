import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import { errorEditInfo, successEditName, WhatName } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { passengerProfileKeyboard } from '../../keyboards/passenger-profile.keyboard';
import { TaxiBotContext } from '../../taxi-bot.context';

@Wizard(ScenesType.EditName)
export class EditNameScene {
	constructor(private readonly passengerService: PassengerService) {}

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
			await ctx.scene.leave();
			await this.passengerService.editName(chatId, msg.text);
			await ctx.reply(successEditName, passengerProfileKeyboard());
			ctx.session.user.first_name = msg.text;
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorEditInfo, passengerProfileKeyboard());
			return '';
		}
	}
}
