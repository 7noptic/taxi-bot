import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import { wizardState } from '../../../decorators/getWizardState';
import { RegistrationPassengerContext } from '../../contexts/registration-passenger.context';
import {
	errorAddAddress,
	successAddAddress,
	WhatAddress,
	WhatNameAddress,
} from '../../constatnts/message.constants';
import { AddAddressContext } from '../../contexts/add-address.context';
import { CreateAddressDto } from '../../../passenger/dto/create-address.dto';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { passengerProfileKeyboard } from '../../keyboards/passenger-profile.keyboard';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotContext } from '../../taxi-bot.context';
import { TaxiBotCommonUpdate } from '../../updates/common.update';

@Wizard(ScenesType.AddAddress)
export class AddAddressScene {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly taxiBotValidation: TaxiBotValidation,
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
		@Message() msg: { text: string },
	): Promise<string> {
		const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 2, 30);
		if (valid === true) {
			ctx.wizard.state.name = msg.text;
			await ctx.wizard.next();
			return WhatAddress;
		}
		await ctx.reply(valid);
		return;
	}

	@On('text')
	@WizardStep(3)
	async onNumber(
		@Ctx() ctx: WizardContext & AddAddressContext,
		@Message() msg: { text: string },
		@ChatId() chatId: number,
		@wizardState()
		state: RegistrationPassengerContext['wizard']['state'],
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 5, 100);
			if (valid === true) {
				const address: CreateAddressDto = {
					name: state.name,
					address: msg.text,
				};

				await ctx.scene.leave();
				await this.passengerService.addAddress(chatId, address);
				await ctx.reply(successAddAddress, passengerProfileKeyboard());
				return '';
			}
			await ctx.reply(valid);
			return;
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorAddAddress, passengerProfileKeyboard());
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext) {
		await this.taxiBotService.goHome(ctx);
	}
}
