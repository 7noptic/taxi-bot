import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import {
	errorDeleteAddress,
	successDeleteAddress,
	WhatNameAddress,
} from '../../constatnts/message.constants';
import { AddAddressContext } from '../../contexts/add-address.context';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { passengerProfileKeyboard } from '../../keyboards/passenger-profile.keyboard';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotContext } from '../../taxi-bot.context';
import { TaxiBotCommonUpdate } from '../../updates/common.update';

@Wizard(ScenesType.DeleteAddress)
export class DeleteAddressScene {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		await ctx.wizard.next();
		return WhatNameAddress;
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & AddAddressContext,
		@ChatId() chatId: number,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			await ctx.scene.leave();
			const countDeletedAddress = await this.passengerService.deleteAddress(chatId, msg.text);
			await ctx.reply(
				countDeletedAddress > 0 ? successDeleteAddress : errorDeleteAddress,
				passengerProfileKeyboard(),
			);
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorDeleteAddress, passengerProfileKeyboard());
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}
}
