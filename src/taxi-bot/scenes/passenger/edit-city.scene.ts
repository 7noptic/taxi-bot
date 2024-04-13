import { Ctx, Hears, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from '../scenes.type';
import { PassengerService } from '../../../passenger/passenger.service';
import { errorEditInfo, successEditCity, WhatCity } from '../../constatnts/message.constants';
import { ChatId } from '../../../decorators/getChatId.decorator';
import { passengerProfileKeyboard } from '../../keyboards/passenger-profile.keyboard';
import { TaxiBotContext } from '../../taxi-bot.context';
import { Markup } from 'telegraf';
import { CityService } from '../../../city/city.service';
import { GetQueryData } from '../../../decorators/getCityFromInlineQuery.decorator';
import { commonButtons } from '../../buttons/common.buttons';
import { TaxiBotCommonUpdate } from '../../updates/common.update';

@Wizard(ScenesType.EditCity)
export class EditCityScene {
	constructor(
		private readonly passengerService: PassengerService,
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
			await this.passengerService.editCity(chatId, city);
			await ctx.reply(successEditCity, passengerProfileKeyboard());
			return '';
		} catch (e) {
			await ctx.scene.leave();
			await ctx.reply(errorEditInfo, passengerProfileKeyboard());
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.taxiBotService.goHome(ctx, chatId);
	}
}
