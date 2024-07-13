import { Ctx, Hears, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { errorEditInfo, successEditCity, WhatCity } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { CityService } from '../../../city/city.service';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { DriverService } from '../../../driver/driver.service';
import { selectDriverKeyboard } from '../../keyboards/driver/select-driver-keyboard';
import { OrderService } from '../../../order/order.service';
import { selectCityKeyboard } from '../../keyboards/select-city.keyboard';
import { LoggerService } from '../../../logger/logger.service';

@Wizard(ScenesType.EditCityDriver)
export class EditCitySceneDriver {
	constructor(
		private readonly driverService: DriverService,
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
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
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
				const { status } = await this.driverService.editCity(chatId, city);
				await ctx
					.replyWithHTML(
						successEditCity,
						await selectDriverKeyboard(
							{
								chatId,
								status,
							},
							this.orderService,
						),
					)
					.catch((e) => this.loggerService.error('onCity: ' + ctx?.toString() + e?.toString()));
				return '';
			}
			await this.showError(ctx, chatId);
			return '';
		} catch (e) {
			await ctx?.scene?.leave();
			await this.showError(ctx, chatId);
			this.loggerService.error('onCity: ' + ctx?.toString() + e?.toString());
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

	async showError(@Ctx() ctx: WizardContext & TaxiBotContext, @ChatId() chatId: number) {
		try {
			const { status } = await this.driverService.findByChatId(chatId);
			await ctx
				.replyWithHTML(
					errorEditInfo,
					await selectDriverKeyboard(
						{
							chatId,
							status,
						},
						this.orderService,
					),
				)
				.catch((e) => this.loggerService.error('showError: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('showError: ' + ctx?.toString() + e?.toString());
		}
	}
}
