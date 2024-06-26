import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { CityService } from '../../../city/city.service';
import {
	errorRegistration,
	errorValidation,
	greetingDriver,
	WhatCarBrand,
	WhatCarColor,
	WhatCarNumber,
	WhatCity,
	WhatNameRegistrationDriver,
	WhatNumberRegistrationDriver,
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
import { selectCityKeyboard } from '../../keyboards/select-city.keyboard';
import { ConstantsService } from '../../../constants/constants.service';
import { UserType } from '../../../types/user.type';
import { SuccessTermKeyboard } from '../../keyboards/success-term.keyboard';

@Wizard(ScenesType.RegistrationDriver)
export class RegisterDriverScene {
	constructor(
		private readonly cityService: CityService,
		private readonly driverService: DriverService,
		private readonly driverAdapter: DriverAdapter,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
	) {}

	@WizardStep(0)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		await ctx.replyWithHTML(
			ConstantsService.RegistrationMessage(UserType.Driver),
			SuccessTermKeyboard(),
		);

		ctx.wizard.next();

		return;
	}

	@On('callback_query')
	@WizardStep(1)
	async onCheckedTerms(
		@Ctx() ctx: WizardContext,
		@GetQueryData() checked: string,
	): Promise<string> {
		if (checked === commonButtons.success.callback) {
			ctx.wizard.next();
			return WhatNameRegistrationDriver;
		}
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
			ctx.wizard.next();
			return WhatNumberRegistrationDriver;
		}
		await ctx.replyWithHTML(valid);
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
			await ctx.replyWithHTML(WhatCity, selectCityKeyboard(cities));

			ctx.wizard.next();
			return;
		}
		await ctx.replyWithHTML(valid);
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
		await ctx.replyWithHTML(
			WhatCity,
			Markup.inlineKeyboard(cities.map((city) => Markup.button.callback(city.name, city.name))),
		);

		ctx.wizard.next();
		return;
	}

	@On('callback_query')
	@WizardStep(4)
	async onLocation(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationDriverContext,
		@GetQueryData() city: string,
	) {
		const { name } = await this.cityService.getByName(city);
		if (name) {
			ctx.wizard.state.city = city;
			await ctx.replyWithHTML(WhatCarBrand);

			ctx.wizard.next();
			return;
		}
		await ctx.replyWithHTML(errorValidation);
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
			await ctx.replyWithHTML(WhatCarColor);

			await ctx.wizard.next();
			return;
		}
		await ctx.replyWithHTML(valid);
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
			await ctx.replyWithHTML(WhatCarNumber);

			await ctx.wizard.next();
			return;
		}
		await ctx.replyWithHTML(valid);
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
			const carNumber = msg.text.toUpperCase();
			const regex = /^[A-Я][0-9]{3}[A-Я]{2}[0-9]{1,3}$/;

			const valid = regex.test(carNumber);
			if (valid === true) {
				ctx.wizard.state.carNumber = carNumber;
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
			await ctx.replyWithHTML(errorValidation);
			return;
		} catch (e) {
			await ctx.scene.leave();
			await ctx.replyWithHTML(errorRegistration, registrationKeyboard());
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}
}
