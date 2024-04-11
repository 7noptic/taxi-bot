import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import { errorEditInfo, successEditPhone, WhatNumber } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { passengerProfileKeyboard } from '../../keyboards/passenger-profile.keyboard';
import { TaxiBotContext } from '../../taxi-bot.context';

@Wizard(ScenesType.EditPhone)
export class EditPhoneScene {
	constructor(private readonly passengerService: PassengerService) {}

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
			await ctx.scene.leave();
			await this.passengerService.editPhone(chatId, msg.text);
			await ctx.reply(successEditPhone, passengerProfileKeyboard());
			ctx.session.user.phone = msg.text;
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorEditInfo, passengerProfileKeyboard());
			return '';
		}
	}
}
