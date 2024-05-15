import { Action, Ctx, Hears, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { PassengerService } from '../../passenger/passenger.service';
import { DriverService } from '../../driver/driver.service';
import { registrationKeyboard } from '../keyboards/registration.keyboard';
import { TaxiBotContext } from '../taxi-bot.context';
import { ChatId } from '../../decorators/getChatId.decorator';
import { goBack, successfulPayment } from '../constatnts/message.constants';
import { commonButtons } from '../buttons/common.buttons';
import { BotName } from '../../types/bot-name.type';
import { ConstantsService } from '../../constants/constants.service';
import { helpKeyboard } from '../keyboards/help.keyboard';
import { SettingsService } from '../../settings/settings.service';
import { OrderService } from '../../order/order.service';
import { profileDriverSettingsKeyboard } from '../keyboards/driver/profile-settings.keyboard';
import { GetQueryData } from '../../decorators/getCityFromInlineQuery.decorator';
import { addReviewKeyboard } from '../keyboards/add-review.keyboard';
import { UserType } from '../../types/user.type';
import { ScenesType } from '../scenes/scenes.type';
import { PaymentService } from '../../payment/payment.service';
import { selectDriverKeyboard } from '../keyboards/driver/select-driver-keyboard';
import { selectPassengerKeyboard } from '../keyboards/passenger/select-passenger-keyboard';
import { Throttle } from '@nestjs/throttler';
import { throttles } from '../../app/app.throttles';
import { LoggerService } from '../../logger/logger.service';

@Update()
export class TaxiBotCommonUpdate {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly passengerService: PassengerService,
		private readonly driverService: DriverService,
		private readonly settingsService: SettingsService,
		private readonly orderService: OrderService,
		private readonly paymentService: PaymentService,
		private readonly loggerService: LoggerService,
	) {}

	@Throttle(throttles.send_message)
	@Start()
	async start(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			const passenger = await this.passengerService.findByChatId(chatId);
			const driver = await this.driverService.findByChatId(chatId);
			if (ctx?.scene) await ctx.scene.leave();

			if (!passenger && !driver) {
				await ctx.replyWithHTML(ConstantsService.WelcomeMessage, registrationKeyboard());
			} else if (passenger) {
				await ctx.reply(
					ConstantsService.greetingMessage,
					await selectPassengerKeyboard(chatId, this.orderService),
				);
			} else if (driver) {
				await ctx.reply(
					ConstantsService.greetingMessage,
					await selectDriverKeyboard(
						{
							chatId: driver.chatId,
							status: driver.status,
						},
						this.orderService,
					),
				);
			}
		} catch (e) {
			this.loggerService.error('start: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Hears(commonButtons.cancelOrder.label)
	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			if (ctx?.scene) await ctx.scene.leave();
			const passenger = await this.passengerService.findByChatId(chatId);
			if (passenger) {
				await ctx.reply(goBack, await selectPassengerKeyboard(chatId, this.orderService));
				return;
			}
			const driver = await this.driverService.findByChatId(chatId);

			if (driver) {
				await ctx.reply(
					goBack,
					await selectDriverKeyboard({ chatId, status: driver.status }, this.orderService),
				);
				return;
			}
			await ctx.reply(goBack, registrationKeyboard());
		} catch (e) {
			this.loggerService.error('goHome: ' + e?.toString());
		}
	}

	/************************** Пункт Помощь **************************/
	@Throttle(throttles.send_message)
	@Hears(commonButtons.profile.help)
	async getHelp(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx.sendPhoto({ url: ConstantsService.images.help });
			await ctx.replyWithHTML(commonButtons.profile.help, helpKeyboard());
		} catch (e) {
			this.loggerService.error('getHelp: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(commonButtons.help.faq.callback)
	async getFaq(@Ctx() ctx: TaxiBotContext) {
		try {
			const settings = await this.settingsService.getSettings();
			await ctx.replyWithHTML(settings.faqText);
		} catch (e) {
			this.loggerService.error('getFaq: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(commonButtons.help.price.callback)
	async getPriceText(@Ctx() ctx: TaxiBotContext) {
		try {
			const settings = await this.settingsService.getSettings();
			await ctx.replyWithHTML(settings.priceText);
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(commonButtons.help.about.callback)
	async getAboutText(@Ctx() ctx: TaxiBotContext) {
		try {
			const settings = await this.settingsService.getSettings();
			await ctx.replyWithHTML(settings.aboutText);
		} catch (e) {
			this.loggerService.error('getAboutText: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(commonButtons.help.support.callback)
	async getSupportText(@Ctx() ctx: TaxiBotContext) {
		try {
			const settings = await this.settingsService.getSettings();
			await ctx.replyWithHTML(settings.supportText);
		} catch (e) {
			this.loggerService.error('getSupportText: ' + e?.toString());
		}
	}

	/************************** Пункт Профиль **************************/
	@Throttle(throttles.send_message)
	@Hears(commonButtons.profile.profile)
	async getProfile(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
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
		} catch (e) {
			this.loggerService.error('getProfile: ' + e?.toString());
		}
	}

	/************************** Заказ **************************/
	@Throttle(throttles.send_message)
	@Action(new RegExp(commonButtons.rating.callback))
	async setRating(@Ctx() ctx: TaxiBotContext, @GetQueryData() data: any) {
		try {
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
		} catch (e) {
			this.loggerService.error('setRating: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@Action(new RegExp(commonButtons.review.callback))
	async addReview(@Ctx() ctx: TaxiBotContext, @GetQueryData() data: any) {
		try {
			const callbackData = data.split('-');
			const userChatId = Number(callbackData[2]);
			const orderNumber = callbackData[3] + '-' + callbackData[4];

			ctx.session.addReview = {
				to: userChatId,
				numberOrder: orderNumber,
			};
			await ctx.scene.enter(ScenesType.AddReview);
		} catch (e) {
			this.loggerService.error('addReview: ' + e?.toString());
		}
	}

	/************************** Оплата **************************/
	@Throttle(throttles.send_message)
	@On('pre_checkout_query')
	async answerPreCheckoutQuery(@Ctx() ctx: TaxiBotContext) {
		try {
			await ctx.answerPreCheckoutQuery(true);
		} catch (e) {
			this.loggerService.error('answerPreCheckoutQuery: ' + e?.toString());
		}
	}

	@Throttle(throttles.send_message)
	@On('successful_payment')
	async successfulPayment(
		@Ctx()
		ctx: TaxiBotContext & { update: { message: { successful_payment: { total_amount: number } } } },
		@ChatId() chatId: number,
	) {
		try {
			const price = Math.round(Number(ctx.update.message.successful_payment.total_amount / 100));
			await this.paymentService.closePayment(chatId, price);
			await ctx.reply(successfulPayment);
		} catch (e) {
			this.loggerService.error('successfulPayment: ' + e?.toString());
		}
	}
}
