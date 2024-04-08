import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from './scenes.type';
import { PassengerService } from '../../passenger/passenger.service';
import { wizardState } from '../../decorators/getWizardState';
import { RegistrationPassengerContext } from '../contexts/registration-passenger.context';
import {
	errorAddAddress,
	successAddAddress,
	WhatAddress,
	WhatNameAddress,
} from '../constatnts/message.constants';
import { AddAddressContext } from '../contexts/add-address.context';
import { CreateAddressDto } from '../../passenger/dto/create-address.dto';
import { ChatId } from '../../decorators/getChatId.decorator';
import { passengerProfileKeyboard } from '../keyboards/passenger-profile.keyboard';

@Wizard(ScenesType.AddAddress)
export class AddAddressScene {
	constructor(private readonly passengerService: PassengerService) {}

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
		ctx.wizard.state.name = msg.text;
		await ctx.wizard.next();
		return WhatAddress;
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
			const address: CreateAddressDto = {
				name: state.name,
				address: msg.text,
			};

			await ctx.scene.leave();
			await this.passengerService.addAddress(chatId, address);
			await ctx.reply(successAddAddress, passengerProfileKeyboard());
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply('', passengerProfileKeyboard());
			return errorAddAddress;
		}
	}
}
