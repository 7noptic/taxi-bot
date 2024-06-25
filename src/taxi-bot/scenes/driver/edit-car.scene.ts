import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import {
	errorEditInfo,
	errorValidation,
	successEditCar,
	WarningEditCar,
	WhatCarBrand,
	WhatCarColor,
	WhatCarNumber,
} from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { DriverService } from '../../../driver/driver.service';
import { RegistrationDriverContext } from '../../contexts/registration-driver.context';
import { TaxiBotValidation } from '../../taxi-bot.validation';
import { userInfo } from '../../../decorators/getUserInfo.decorator';
import { wizardState } from '../../../decorators/getWizardState';
import { Driver } from '../../../driver/driver.model';
import { selectDriverKeyboard } from '../../keyboards/driver/select-driver-keyboard';
import { OrderService } from '../../../order/order.service';

@Wizard(ScenesType.EditCarDriver)
export class EditCarSceneDriver {
	constructor(
		private readonly driverService: DriverService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly orderService: OrderService,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		await ctx.replyWithHTML(WarningEditCar);
		ctx.wizard.next();
		return WhatCarBrand;
	}

	@On('text')
	@WizardStep(2)
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
	@WizardStep(3)
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
		@ChatId() chatId: number,
		@wizardState() state: RegistrationDriverContext['wizard']['state'],
	) {
		try {
			const carNumber = msg.text.toUpperCase();
			const regex = /^[A-Я][0-9]{3}[A-Я]{2}[0-9]{1,3}$/;

			const valid = regex.test(carNumber);
			if (valid === true) {
				await ctx.scene.leave();
				const car: Driver['car'] = {
					carNumber,
					carColor: state.carColor,
					carBrand: state.carBrand,
				};
				const { status } = await this.driverService.editCar(chatId, car);
				await ctx.replyWithHTML(
					successEditCar,
					await selectDriverKeyboard({ chatId, status }, this.orderService),
				);
				return;
			}
			await ctx.replyWithHTML(errorValidation);
			return;
		} catch (e) {
			await ctx.scene.leave();
			const { status } = await this.driverService.findByChatId(chatId);
			await ctx.replyWithHTML(
				errorEditInfo,
				await selectDriverKeyboard({ chatId, status }, this.orderService),
			);
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}
}
