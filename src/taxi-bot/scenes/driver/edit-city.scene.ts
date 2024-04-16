import { Ctx, Hears, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { errorEditInfo, successEditCity, WhatCity } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { TaxiBotContext } from '../../taxi-bot.context';
import { Markup } from 'telegraf';
import { CityService } from '../../../city/city.service';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';
import { DriverService } from '../../../driver/driver.service';
import { driverProfileKeyboard } from '../../keyboards/driver/profile.keyboard';

@Wizard(ScenesType.EditCityDriver)
export class EditCitySceneDriver {
	constructor(
		private readonly driverService: DriverService,
		private readonly cityService: CityService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
	) {}

	@WizardStep(1)
	async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
		try {
			const cities = await this.cityService.getAll();
			await ctx.reply(
				WhatCity,
				Markup.inlineKeyboard(cities.map((city) => Markup.button.callback(city.name, city.name))),
			);

			await ctx.wizard.next();
			return;
		} catch (e) {
			await ctx.scene.leave();
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
			await ctx.scene.leave();
			const { name } = await this.cityService.getByName(city);
			if (name) {
				const { status } = await this.driverService.editCity(chatId, city);
				await ctx.reply(successEditCity, driverProfileKeyboard(status));
				return '';
			}
			await this.showError(ctx, chatId);
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await this.showError(ctx, chatId);
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}

	async showError(@Ctx() ctx: WizardContext & TaxiBotContext, @ChatId() chatId: number) {
		const { status } = await this.driverService.findByChatId(chatId);
		await ctx.reply(errorEditInfo, driverProfileKeyboard(status));
	}
}
