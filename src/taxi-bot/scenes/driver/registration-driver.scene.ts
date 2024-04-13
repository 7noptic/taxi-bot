import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { CityService } from '../../../city/city.service';
import {
	errorRegistration,
	greetingDriver,
	WhatCarBrand,
	WhatCarColor,
	WhatCarNumber,
	WhatCity,
	WhatNameRegistration,
	WhatNumberRegistration,
} from '../../constatnts/message.constants';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { DriverAdapter } from '../../../driver/driver.adapter';
import { RegistrationDriverContext } from '../../contexts/registration-driver.context';
import { Markup } from 'telegraf';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { registrationKeyboard } from '../../keyboards/registration.keyboard';
import { userInfo } from '../../../decorators/getUserInfo.decorator';
import { wizardState } from '../../../decorators/getWizardState';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { DriverService } from '../../../driver/driver.service';
import { driverProfileKeyboard } from '../../keyboards/driver/profile.keyboard';
import { StatusDriver } from '../../types/status-driver.type';

@Wizard(ScenesType.RegistrationDriver)
export class RegisterDriverScene {
	constructor(
		private readonly cityService: CityService,
		private readonly driverService: DriverService,
		private readonly driverAdapter: DriverAdapter,
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
		@Ctx() ctx: WizardContext & RegistrationDriverContext,
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
		@Ctx() ctx: WizardContext & RegistrationDriverContext,
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
		@Ctx() ctx: WizardContext & RegistrationDriverContext,
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
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationDriverContext,
		@GetQueryData() city: string,
	) {
		ctx.wizard.state.city = city;
		await ctx.reply(WhatCarBrand);

		await ctx.wizard.next();
		return;
	}

	@On('text')
	@WizardStep(5)
	async onCarModel(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationDriverContext,
		@Message() msg: { text: string },
	) {
		const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 3, 50);
		if (valid === true) {
			ctx.wizard.state.carBrand = msg.text;
			await ctx.reply(WhatCarColor);

			await ctx.wizard.next();
			return;
		}
		await ctx.reply(valid);
		return;
	}

	@On('text')
	@WizardStep(6)
	async onCarColor(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationDriverContext,
		@Message() msg: { text: string },
	) {
		const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 3, 30);
		if (valid === true) {
			ctx.wizard.state.carColor = msg.text;
			await ctx.reply(WhatCarNumber);

			await ctx.wizard.next();
			return;
		}
		await ctx.reply(valid);
		return;
	}

	@On('text')
	@WizardStep(7)
	async onCarNumber(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationDriverContext,
		@userInfo() user,
		@Message() msg: { text: string },
		@wizardState() state: RegistrationDriverContext['wizard']['state'],
	) {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 5, 10);
			if (valid === true) {
				ctx.wizard.state.carNumber = msg.text;
				const createDriverDto = this.driverAdapter.convertRegisterInfoToDriver({
					...user,
					city: state.city,
					first_name: state.name,
					phone: state.phone,
					carNumber: state.carNumber,
					carBrand: state.carBrand,
					carColor: state.carColor,
				});
				await ctx.scene.leave();
				await this.driverService.create(createDriverDto);
				await ctx.replyWithHTML(
					greetingDriver(state.name),
					driverProfileKeyboard(StatusDriver.Offline),
				);
				return;
			}
			await ctx.reply(valid);
			return;
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorRegistration, registrationKeyboard());
			return '';
		}
	}

	//
	// @On('callback_query')
	// @WizardStep(4)
	// async onLocation(
	// 	@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationPassengerContext,
	// 	@GetQueryData() city: string,
	// 	@userInfo() user,
	// 	@wizardState() state: RegistrationPassengerContext['wizard']['state'],
	// ) {
	// 	try {
	// 		const createPassengerDto = this.passengerAdapter.convertRegisterInfoToPassenger({
	// 			...user,
	// 			city,
	// 			first_name: state.name,
	// 			phone: state.phone,
	// 		});
	// 		await ctx.scene.leave();
	// 		const passenger = await this.passengerService.create(createPassengerDto);
	// 		await ctx.replyWithHTML(greetingPassenger(state.name), passengerProfileKeyboard());
	// 		return '';
	// 	} catch (e) {
	// 		await ctx.scene.leave();
	// 		await ctx.reply(errorRegistration, registrationKeyboard());
	// 		return '';
	// 	}
	// }

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}
}
