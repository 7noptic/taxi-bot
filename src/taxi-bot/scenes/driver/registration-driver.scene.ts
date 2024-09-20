import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { CityService } from '../../../city/city.service';
import {
	errorRegistration,
	errorValidation,
	greetingDriver,
	welcomeMessage,
	WhatCarBrand,
	WhatCarColor,
	WhatCarNumber,
	WhatCity,
	WhatEmail,
	WhatNameRegistrationDriver,
	WhatNumberRegistrationDriver,
} from '../../constatnts/message.constants';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { DriverAdapter } from '../../../driver/driver.adapter';
import { RegistrationDriverContext } from '../../contexts/registration-driver.context';
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
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.RegistrationDriver)
export class RegisterDriverScene {
	constructor(
		private readonly cityService: CityService,
		private readonly driverService: DriverService,
		private readonly driverAdapter: DriverAdapter,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly loggerService: LoggerService,
	) {}

	@WizardStep(0)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		try {
			await ctx
				.replyWithHTML(ConstantsService.RegistrationMessage(UserType.Driver), SuccessTermKeyboard())
				.catch((e) => this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString()));

			ctx?.wizard?.next();

			return;
		} catch (e) {
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(1)
	async onCheckedTerms(
		@Ctx() ctx: WizardContext,
		@GetQueryData() checked: string,
	): Promise<string> {
		try {
			if (checked === commonButtons.success.callback) {
				ctx?.wizard?.next();
				return WhatNameRegistrationDriver;
			}
		} catch (e) {
			this.loggerService.error('onCheckedTerms: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & RegistrationDriverContext,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 2, 30);
			if (valid === true) {
				ctx.wizard.state.name = msg.text;
				ctx?.wizard?.next();
				return WhatNumberRegistrationDriver;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onName: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onName: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(3)
	async onNumberText(
		@Ctx() ctx: WizardContext & RegistrationDriverContext,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.isPhone(msg.text);
			if (valid === true) {
				ctx.wizard.state.phone = msg.text;
				await ctx
					.replyWithHTML(WhatEmail)
					.catch((e) =>
						this.loggerService.error('onNumberText: ' + ctx?.toString() + e?.toString()),
					);

				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onNumberText: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onNumberText: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('contact')
	@WizardStep(3)
	async onNumberContact(
		@Ctx() ctx: WizardContext & RegistrationDriverContext,
		@Message() msg: { contact: { phone_number: string } },
	): Promise<string> {
		try {
			ctx.wizard.state.phone = msg.contact.phone_number;
			await ctx
				.replyWithHTML(WhatEmail)
				.catch((e) =>
					this.loggerService.error('onNumberContact: ' + ctx?.toString() + e?.toString()),
				);

			ctx?.wizard?.next();
			return;
		} catch (e) {
			this.loggerService.error('onNumberContact: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(4)
	async onEmail(
		@Ctx() ctx: WizardContext & RegistrationDriverContext,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.isEmail(msg.text);
			if (valid === true) {
				ctx.wizard.state.email = msg.text;
				const cities = await this.cityService.getAll();
				await ctx
					.replyWithHTML(WhatCity, selectCityKeyboard(cities))
					.catch((e) => this.loggerService.error('onEmail: ' + ctx?.toString() + e?.toString()));

				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onEmail: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onEmail: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(5)
	async onLocation(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationDriverContext,
		@GetQueryData() city: string,
	) {
		try {
			const { name } = await this.cityService.getByName(city);
			if (name) {
				ctx.wizard.state.city = city;
				await ctx
					.replyWithHTML(WhatCarBrand)
					.catch((e) => this.loggerService.error('onLocation: ' + ctx?.toString() + e?.toString()));

				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(errorValidation)
				.catch((e) => this.loggerService.error('onLocation: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onLocation: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(6)
	async onCarModel(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationDriverContext,
		@Message() msg: { text: string },
	) {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 3, 50);
			if (valid === true) {
				ctx.wizard.state.carBrand = msg.text;
				await ctx
					.replyWithHTML(WhatCarColor)
					.catch((e) => this.loggerService.error('onCarModel: ' + ctx?.toString() + e?.toString()));

				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onCarModel: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onCarModel: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(7)
	async onCarColor(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationDriverContext,
		@Message() msg: { text: string },
	) {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 3, 30);
			if (valid === true) {
				ctx.wizard.state.carColor = msg.text;
				await ctx
					.replyWithHTML(WhatCarNumber)
					.catch((e) => this.loggerService.error('onCarColor: ' + ctx?.toString() + e?.toString()));

				ctx?.wizard?.next();
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onCarColor: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			this.loggerService.error('onCarColor: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(8)
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
					email: state.email,
				});
				await ctx?.scene?.leave();
				await this.driverService.create(createDriverDto);
				await ctx
					.replyWithHTML(greetingDriver(state.name), driverProfileKeyboard(StatusDriver.Offline))
					.catch((e) =>
						this.loggerService.error('onCarNumber: ' + ctx?.toString() + e?.toString()),
					);

				await ctx
					.replyWithHTML(welcomeMessage(state.name))
					.catch((e) =>
						this.loggerService.error('onCarNumber: ' + ctx?.toString() + e?.toString()),
					);
				return;
			}
			await ctx
				.replyWithHTML(errorValidation)
				.catch((e) => this.loggerService.error('onCarNumber: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			await ctx?.scene?.leave();
			await ctx
				.replyWithHTML(errorRegistration, registrationKeyboard())
				.catch((e) => this.loggerService.error('onCarNumber: ' + ctx?.toString() + e?.toString()));
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			await this.taxiBotService.goHome(ctx, chatId);
		} catch (e) {
			this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString());
		}
	}
}
