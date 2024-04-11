import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { Markup } from 'telegraf';
import { CityService } from '../../../city/city.service';
import { cityName } from '../../../decorators/getCityFromInlineQuery.decorator';
import { PassengerService } from '../../../passenger/passenger.service';
import { userInfo } from '../../../decorators/getUserInfo.decorator';
import { wizardState } from '../../../decorators/getWizardState';
import { PassengerAdapter } from '../../../passenger/passenger.adapter';
import { RegistrationPassengerContext } from '../../contexts/registration-passenger.context';
import {
	errorRegistration,
	greeting,
	WhatCity,
	WhatName,
	WhatNumber,
} from '../../constatnts/message.constants';
import { registrationKeyboard } from '../../keyboards/registration.keyboard';
import { passengerProfileKeyboard } from '../../keyboards/passenger-profile.keyboard';
import { UserType } from '../../../types/user.type';
import { TaxiBotContext } from '../../taxi-bot.context';

@Wizard(ScenesType.RegistrationPassenger)
export class RegisterPassengerScene {
	constructor(
		private readonly cityService: CityService,
		private readonly passengerService: PassengerService,
		private readonly passengerAdapter: PassengerAdapter,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		await ctx.wizard.next();
		return WhatName;
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & RegistrationPassengerContext,
		@Message() msg: { text: string },
	): Promise<string> {
		ctx.wizard.state.name = msg.text;
		await ctx.wizard.next();
		return WhatNumber;
	}

	@On('text')
	@WizardStep(3)
	async onNumber(
		@Ctx() ctx: WizardContext & RegistrationPassengerContext,
		@Message() msg: { text: string },
	): Promise<string> {
		ctx.wizard.state.phone = msg.text;
		const cities = await this.cityService.getAll();
		await ctx.reply(
			WhatCity,
			Markup.inlineKeyboard(cities.map((city) => Markup.button.callback(city.name, city.name))),
		);

		await ctx.wizard.next();
		return;
	}

	@On('callback_query')
	@WizardStep(4)
	async onLocation(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationPassengerContext,
		@cityName() city: string,
		@userInfo() user,
		@wizardState() state: RegistrationPassengerContext['wizard']['state'],
	) {
		try {
			const createPassengerDto = this.passengerAdapter.convertRegisterInfoToPassenger({
				...user,
				city,
				first_name: state.name,
				phone: state.phone,
			});
			await ctx.scene.leave();
			const passenger = await this.passengerService.create(createPassengerDto);
			await ctx.reply(greeting(state.name), passengerProfileKeyboard());
			ctx.session.userType = UserType.Passenger;
			ctx.session.user = passenger;
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorRegistration, registrationKeyboard());
			return '';
		}
	}
}
