import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import {
	errorDeleteAddress,
	successDeleteAddress,
	WhatNameAddress,
} from '../../constatnts/message.constants';
import { AddAddressContext } from '../../contexts/add-address.context';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotContext } from '../../taxi-bot.context';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { selectPassengerKeyboard } from '../../keyboards/passenger/select-passenger-keyboard';
import { OrderService } from '../../../order/order.service';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.DeleteAddress)
export class DeleteAddressScene {
	constructor(
		private readonly passengerService: PassengerService,
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
		@ChatId() chatId: number,
		@Message() msg: { text: string },
	): Promise<string> {
		try {
			await ctx?.scene?.leave();
			const countDeletedAddress = await this.passengerService.deleteAddress(chatId, msg.text);
			await ctx
				.replyWithHTML(
					countDeletedAddress > 0 ? successDeleteAddress : errorDeleteAddress,
					await selectPassengerKeyboard(chatId, this.orderService),
				)
				.catch((e) => this.loggerService.error('onName: ' + ctx?.toString() + e?.toString()));
			return '';
		} catch (e) {
			await ctx?.scene?.leave();
			await ctx
				.replyWithHTML(errorDeleteAddress, await selectPassengerKeyboard(chatId, this.orderService))
				.catch((e) => this.loggerService.error('onName: ' + ctx?.toString() + e?.toString()));
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
			this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString());
		}
	}
}
