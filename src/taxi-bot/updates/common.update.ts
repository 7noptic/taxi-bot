import { Action, Ctx, Hears, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { PassengerService } from '../../passenger/passenger.service';
import { DriverService } from '../../driver/driver.service';
import { registrationKeyboard } from '../keyboards/registration.keyboard';
import { TaxiBotContext } from '../taxi-bot.context';
import { ChatId } from '../../decorators/getChatId.decorator';
import { passengerProfileKeyboard } from '../keyboards/passenger/passenger-profile.keyboard';
import { goBack, successfulPayment } from '../constatnts/message.constants';
import { commonButtons } from '../buttons/common.buttons';
import { BotName } from '../../types/bot-name.type';
import { ConstantsService } from '../../constants/constants.service';
import { driverProfileKeyboard } from '../keyboards/driver/profile.keyboard';
import { helpKeyboard } from '../keyboards/help.keyboard';
import { SettingsService } from '../../settings/settings.service';
import { OrderService } from '../../order/order.service';
import { profileDriverSettingsKeyboard } from '../keyboards/driver/profile-settings.keyboard';
import { GetQueryData } from '../../decorators/getCityFromInlineQuery.decorator';
import { addReviewKeyboard } from '../keyboards/add-review.keyboard';
import { UserType } from '../../types/user.type';
import { ScenesType } from '../scenes/scenes.type';
import { PaymentService } from '../../payment/payment.service';

@Update()
export class TaxiBotCommonUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly passengerService: PassengerService,
		private readonly driverService: DriverService,
		private readonly settingsService: SettingsService,
		private readonly orderService: OrderService,
		private readonly paymentService: PaymentService,
	) {}

	@Start()
	async start(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		const passenger = await this.passengerService.findByChatId(chatId);
		const driver = await this.driverService.findByChatId(chatId);
		if (ctx?.scene) await ctx.scene.leave();

		if (!passenger && !driver) {
			await ctx.replyWithHTML(ConstantsService.WelcomeMessage, registrationKeyboard());
		} else if (passenger) {
			await ctx.reply(ConstantsService.greetingMessage, passengerProfileKeyboard());
		} else if (driver) {
			await ctx.reply(ConstantsService.greetingMessage, driverProfileKeyboard(driver.status));
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		if (ctx?.scene) await ctx.scene.leave();
		const passenger = await this.passengerService.findByChatId(chatId);
		if (passenger) {
			await ctx.reply(goBack, passengerProfileKeyboard());
			return;
		}
		const driver = await this.driverService.findByChatId(chatId);

		if (driver) {
			await ctx.reply(goBack, driverProfileKeyboard(driver.status));
			return;
		}
		await ctx.reply(goBack, registrationKeyboard());
	}

	/************************** Пункт Помощь **************************/
	@Hears(commonButtons.profile.help)
	async getHelp(@Ctx() ctx: TaxiBotContext) {
		await ctx.sendPhoto({ url: ConstantsService.images.help });
		await ctx.replyWithHTML(commonButtons.profile.help, helpKeyboard());
	}

	@Action(commonButtons.help.faq.callback)
	async getFaq(@Ctx() ctx: TaxiBotContext) {
		const settings = await this.settingsService.getSettings();
		await ctx.replyWithHTML(settings.faqText);
	}

	@Action(commonButtons.help.price.callback)
	async getPriceText(@Ctx() ctx: TaxiBotContext) {
		const settings = await this.settingsService.getSettings();
		await ctx.replyWithHTML(settings.priceText);
	}

	@Action(commonButtons.help.about.callback)
	async getAboutText(@Ctx() ctx: TaxiBotContext) {
		const settings = await this.settingsService.getSettings();
		await ctx.replyWithHTML(settings.aboutText);
	}

	@Action(commonButtons.help.support.callback)
	async getSupportText(@Ctx() ctx: TaxiBotContext) {
		const settings = await this.settingsService.getSettings();
		await ctx.replyWithHTML(settings.supportText);
	}

	/************************** Пункт Профиль **************************/
	@Hears(commonButtons.profile.profile)
	async getProfile(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		const passenger = await this.passengerService.findByChatId(chatId);
		if (passenger) {
			const ordersInfo = await this.orderService.getPassengerOrdersInfo(chatId);
			await ctx.sendPhoto({ url: ConstantsService.images.profile });
			await ctx.replyWithHTML(ConstantsService.getProfileInfoPassenger(passenger, ordersInfo));
			return;
		}
		const driver = await this.driverService.findByChatId(chatId);
		if (driver) {
			await ctx.sendPhoto({ url: ConstantsService.images.profile });
			await ctx.replyWithHTML(
				ConstantsService.getProfileInfoDriver(driver),
				profileDriverSettingsKeyboard(),
			);
			return;
		}
	}

	/************************** Заказ **************************/
	@Action(new RegExp(commonButtons.rating.callback))
	async setRating(@Ctx() ctx: TaxiBotContext, @GetQueryData() data: any) {
		const callbackData = data.split('-');
		const userChatId = Number(callbackData[2]);
		const rate = Number(callbackData[3]);
		const userType: UserType = callbackData[4];
		const orderNumber = callbackData[5] + '-' + callbackData[6];
		switch (userType) {
			case UserType.Driver:
				await this.driverService.addRating(userChatId, rate);
				break;
			case UserType.Passenger:
				await this.passengerService.addRating(userChatId, rate);
				break;
		}
		await ctx.editMessageReplyMarkup(addReviewKeyboard(userChatId, orderNumber).reply_markup);
	}

	@Action(new RegExp(commonButtons.review.callback))
	async addReview(@Ctx() ctx: TaxiBotContext, @GetQueryData() data: any) {
		const callbackData = data.split('-');
		const userChatId = Number(callbackData[2]);
		const orderNumber = callbackData[3] + '-' + callbackData[4];

		ctx.session.addReview = {
			to: userChatId,
			numberOrder: orderNumber,
		};
		await ctx.scene.enter(ScenesType.AddReview);
	}

	/************************** Оплата **************************/
	@On('pre_checkout_query')
	async answerPreCheckoutQuery(@Ctx() ctx: TaxiBotContext) {
		await ctx.answerPreCheckoutQuery(true);
	}

	@On('successful_payment')
	async successfulPayment(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		await this.paymentService.closePayment(chatId);
		await ctx.reply(successfulPayment);
	}
}
