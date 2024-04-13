import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { Markup } from 'telegraf';
import { CityService } from '../../../city/city.service';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { PassengerService } from '../../../passenger/passenger.service';
import { userInfo } from '../../../decorators/getUserInfo.decorator';
import { wizardState } from '../../../decorators/getWizardState';
import { PassengerAdapter } from '../../../passenger/passenger.adapter';
import { RegistrationPassengerContext } from '../../contexts/registration-passenger.context';
import {
	errorRegistration,
	greetingPassenger,
	WhatCity,
	WhatNameRegistration,
	WhatNumberRegistration,
} from '../../constatnts/message.constants';
import { registrationKeyboard } from '../../keyboards/registration.keyboard';
import { passengerProfileKeyboard } from '../../keyboards/passenger-profile.keyboard';
import { UserType } from '../../../types/user.type';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';

@Wizard(ScenesType.RegistrationPassenger)
export class RegisterPassengerScene {
	constructor(
		private readonly cityService: CityService,
		private readonly passengerService: PassengerService,
		private readonly passengerAdapter: PassengerAdapter,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		await ctx.wizard.next();
		return WhatNameRegistration;
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & RegistrationPassengerContext,
		@Message() msg: { text: string },
	): Promise<string> {
		const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 2, 30);
		if (valid === true) {
			ctx.wizard.state.name = msg.text;
			await ctx.wizard.next();
			return WhatNumberRegistration;
		}
		await ctx.reply(valid);
		return;
	}

	@On('text')
	@WizardStep(3)
	async onNumberText(
		@Ctx() ctx: WizardContext & RegistrationPassengerContext,
		@Message() msg: { text: string },
	): Promise<string> {
		const valid = this.taxiBotValidation.isPhone(msg.text);
		if (valid === true) {
			ctx.wizard.state.phone = msg.text;
			const cities = await this.cityService.getAll();
			await ctx.reply(
				WhatCity,
				Markup.inlineKeyboard(cities.map((city) => Markup.button.callback(city.name, city.name))),
			);

			await ctx.wizard.next();
			return;
		}
		await ctx.reply(valid);
		return;
	}

	@On('contact')
	@WizardStep(3)
	async onNumberContact(
		@Ctx() ctx: WizardContext & RegistrationPassengerContext,
		@Message() msg: { contact: { phone_number: string } },
	): Promise<string> {
		ctx.wizard.state.phone = msg.contact.phone_number;
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
		@GetQueryData() city: string,
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
			await ctx.replyWithHTML(greetingPassenger(state.name), passengerProfileKeyboard());
			ctx.session.userType = UserType.Passenger;
			ctx.session.user = passenger;
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorRegistration, registrationKeyboard());
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext) {
		await this.taxiBotService.goHome(ctx);
	}
}
