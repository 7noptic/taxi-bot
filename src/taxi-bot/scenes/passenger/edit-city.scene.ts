import { Ctx, Hears, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import { errorEditInfo, successEditCity, WhatCity } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { CityService } from '../../../city/city.service';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { selectPassengerKeyboard } from '../../keyboards/passenger/select-passenger-keyboard';
import { OrderService } from '../../../order/order.service';
import { selectCityKeyboard } from '../../keyboards/select-city.keyboard';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.EditCity)
export class EditCityScene {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly cityService: CityService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly orderService: OrderService,
		private readonly loggerService: LoggerService,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		try {
			const cities = await this.cityService.getAll();
			await ctx
				.replyWithHTML(WhatCity, selectCityKeyboard(cities))
				.catch((e) => this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString()));

			ctx?.wizard?.next();
			return;
		} catch (e) {
			await ctx?.scene?.leave();
			return errorEditInfo;
		}
	}

	@On('callback_query')
	@WizardStep(2)
	async onCity(
		@Ctx() ctx: WizardContext & TaxiBotContext,
		@GetQueryData() city: string,
		@ChatId() chatId: number,
	): Promise<string> {
		try {
			await ctx?.scene?.leave();
			const { name } = await this.cityService.getByName(city);
			if (name) {
				await this.passengerService.editCity(chatId, city);
				await ctx
					.replyWithHTML(successEditCity, await selectPassengerKeyboard(chatId, this.orderService))
					.catch((e) => this.loggerService.error('onCity: ' + ctx?.toString() + e?.toString()));
				return '';
			}
			await this.showError(ctx, chatId);
			return '';
		} catch (e) {
			await ctx?.scene?.leave();
			await this.showError(ctx, chatId);
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}

	async showError(@Ctx() ctx: WizardContext & TaxiBotContext, @ChatId() chatId: number) {
		await ctx
			.replyWithHTML(errorEditInfo, await selectPassengerKeyboard(chatId, this.orderService))
			.catch((e) => this.loggerService.error('showError: ' + ctx?.toString() + e?.toString()));
	}
}
