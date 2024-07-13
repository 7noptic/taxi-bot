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
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotContext } from '../../taxi-bot.context';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { selectPassengerKeyboard } from '../../keyboards/passenger/select-passenger-keyboard';
import { OrderService } from '../../../order/order.service';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.AddAddress)
export class AddAddressScene {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly orderService: OrderService,
		private readonly loggerService: LoggerService,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		try {
			ctx?.wizard?.next();
			return WhatNameAddress;
		} catch (e) {
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & AddAddressContext,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 2, 30);
			if (valid === true) {
				ctx.wizard.state.name = msg.text;
				ctx?.wizard?.next();
				return WhatAddress;
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
	async onNumber(
		@Ctx() ctx: WizardContext & AddAddressContext,
		@Message() msg: { text: string },
		@ChatId() chatId: number,
		@wizardState()
		state: RegistrationPassengerContext['wizard']['state'],
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 5, 80);
			if (valid === true) {
				const address: CreateAddressDto = {
					name: state.name,
					address: msg.text,
				};

				await ctx?.scene?.leave();
				await this.passengerService.addAddress(chatId, address);
				await ctx
					.replyWithHTML(
						successAddAddress,
						await selectPassengerKeyboard(chatId, this.orderService),
					)
					.catch((e) => this.loggerService.error('onNumber: ' + ctx?.toString() + e?.toString()));
				return '';
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onNumber: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			await ctx?.scene?.leave();
			await ctx
				.replyWithHTML(errorAddAddress, await selectPassengerKeyboard(chatId, this.orderService))
				.catch((e) => this.loggerService.error('onNumber: ' + ctx?.toString() + e?.toString()));
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			await this.taxiBotService
				.goHome(ctx, chatId)
				.catch((e) => this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
		}
	}
}
