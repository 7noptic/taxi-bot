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
	errorValidation,
	greetingPassenger,
	WhatCity,
	WhatNameRegistrationPassenger,
	WhatNumberRegistrationPassenger,
} from '../../constatnts/message.constants';
import { registrationKeyboard } from '../../keyboards/registration.keyboard';
import { passengerProfileKeyboard } from '../../keyboards/passenger/passenger-profile.keyboard';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { selectCityKeyboard } from '../../keyboards/select-city.keyboard';
import { ConstantsService } from '../../../constants/constants.service';
import { UserType } from '../../../types/user.type';
import { SuccessTermKeyboard } from '../../keyboards/success-term.keyboard';
import { LoggerService } from '../../../logger/logger.service';
import { Passenger } from '../../../passenger/passenger.model';

@Wizard(ScenesType.RegistrationPassenger)
export class RegisterPassengerScene {
	constructor(
		private readonly cityService: CityService,
		private readonly passengerService: PassengerService,
		private readonly passengerAdapter: PassengerAdapter,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly loggerService: LoggerService,
	) {}

	@WizardStep(0)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		try {
			await ctx
				.replyWithHTML(
					ConstantsService.RegistrationMessage(UserType.Passenger),
					SuccessTermKeyboard(),
				)
				.catch((e) => this.loggerService.error('onPhone: ' + ctx?.toString() + e?.toString()));

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
				return WhatNameRegistrationPassenger;
			}
		} catch (e) {
			this.loggerService.error('onCheckedTerms: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & RegistrationPassengerContext,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 2, 30);
			if (valid === true) {
				ctx.wizard.state.name = msg.text;
				ctx?.wizard?.next();
				return WhatNumberRegistrationPassenger;
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
		@Ctx() ctx: WizardContext & RegistrationPassengerContext,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.isPhone(msg.text);
			if (valid === true) {
				ctx.wizard.state.phone = msg.text;
				const cities = await this.cityService.getAll();
				await ctx
					.replyWithHTML(WhatCity, selectCityKeyboard(cities))
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
		@Ctx() ctx: WizardContext & RegistrationPassengerContext,
		@Message() msg: { contact: { phone_number: string } },
	): Promise<string> {
		try {
			ctx.wizard.state.phone = msg.contact.phone_number;
			const cities = await this.cityService.getAll();
			await ctx
				.replyWithHTML(
					WhatCity,
					Markup.inlineKeyboard(cities.map((city) => Markup.button.callback(city.name, city.name))),
				)
				.catch((e) =>
					this.loggerService.error('onNumberContact: ' + ctx?.toString() + e?.toString()),
				);

			ctx?.wizard?.next();
			return;
		} catch (e) {
			this.loggerService.error('onNumberContact: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('callback_query')
	@WizardStep(4)
	async onLocation(
		@Ctx() ctx: WizardContext & TaxiBotContext & RegistrationPassengerContext,
		@GetQueryData() city: string,
		@userInfo() user: Passenger,
		@wizardState() state: RegistrationPassengerContext['wizard']['state'],
	) {
		try {
			const { name } = await this.cityService.getByName(city);
			await this.cityService.getByName(city);
			if (name.length > 0) {
				const createPassengerDto = this.passengerAdapter.convertRegisterInfoToPassenger({
					...user,
					city,
					first_name: state.name,
					phone: state.phone,
					last_name: user.last_name || '',
				});
				const newUser = await this.passengerService.create(createPassengerDto);
				if (!!newUser) {
					await ctx
						.replyWithHTML(greetingPassenger(state.name), passengerProfileKeyboard())
						.catch((e) =>
							this.loggerService.error('onLocation: ' + ctx?.toString() + e?.toString()),
						);
					await ctx?.scene?.leave();
					return;
				} else {
					await ctx?.scene?.leave();
					await ctx
						.replyWithHTML(errorRegistration, registrationKeyboard())
						.catch((e) =>
							this.loggerService.error('onLocation: ' + ctx?.toString() + e?.toString()),
						);
					return '';
				}
			}

			await ctx
				.replyWithHTML(errorValidation)
				.catch((e) => this.loggerService.error('onLocation: ' + ctx?.toString() + e?.toString()));
			return '';
		} catch (e) {
			await ctx?.scene?.leave();
			await ctx
				.replyWithHTML(errorRegistration, registrationKeyboard())
				.catch((e) => this.loggerService.error('onLocation: ' + ctx?.toString() + e?.toString()));
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
