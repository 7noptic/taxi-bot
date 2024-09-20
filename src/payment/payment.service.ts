import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './payment.model';
import { Model } from 'mongoose';
import { TypeId } from '../short-id/Enums/type-id.enum';
import { ShortIdService } from '../short-id/short-id.service';
import { DriverService } from '../driver/driver.service';
import { PaymentStatus } from './enum/payment-status';
import { Cron } from '@nestjs/schedule';
import { endOfISOWeek, startOfISOWeek, subWeeks } from 'date-fns';
import {
	paymentTitle,
	ReviewsMessage,
	weeklyResultMessage,
	youLocked,
} from '../taxi-bot/constatnts/message.constants';
import { ICreatePayment } from '@a2seven/yoo-checkout';
import { ConstantsService } from '../constants/constants.service';
import { callPaymentKeyboard } from '../taxi-bot/keyboards/driver/call-payment.keyboard';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { TaxiBotContext } from '../taxi-bot/taxi-bot.context';
import { OrderService } from '../order/order.service';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PaymentService {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
		// @InjectQueue(QueueType.Payment) private readonly paymentQueue: Queue,
		// @InjectQueue(QueueType.Blocked) private readonly blockedQueue: Queue,
		private readonly shortIdService: ShortIdService,
		private readonly driverService: DriverService,
		private readonly orderService: OrderService,
		private readonly settingsService: SettingsService,
		private readonly loggerService: LoggerService,
	) {}

	async createPayment(dto: CreatePaymentDto) {
		const numberPayment = this.shortIdService.generateUniqueId(TypeId.Payment);
		return this.paymentModel.create({ ...dto, numberPayment });
	}

	async findNotPaidPayment(chatId: number): Promise<Payment[]> {
		return this.paymentModel.find({ chatId, status: PaymentStatus.NotPaid }).exec();
	}

	async findByPriceNotPaidPayment(chatId: number, price: number): Promise<Payment> {
		// console.log(chatId, price);
		return this.paymentModel.findOne({ chatId, status: PaymentStatus.NotPaid, price }).exec();
	}

	async closePayment(chatId: number, price: number) {
		const payments = await this.findNotPaidPayment(chatId);
		if (payments.length === 1) {
			await this.driverService.unlockedUser(chatId);
		}

		const payment = this.paymentModel
			.findOneAndUpdate(
				{ chatId, price },
				{
					status: PaymentStatus.Paid,
				},
			)
			.exec();

		return payment;
	}

	@Cron('0 9 * * 1')
	async sendBulkPayment() {
		const drivers = await this.driverService.getAllDriversId();
		if (!drivers.length) {
			return;
		}
		const now = new Date();
		const startOfPreviousWeek = startOfISOWeek(subWeeks(now, 1));
		const endOfPreviousWeek = endOfISOWeek(subWeeks(now, 1));
		const { commission: serviceCommission } = await this.settingsService.getSettings();
		const promises = drivers.map(async ({ chatId, rating }) => {
			try {
				const { sumCommission, count, price, reviews } =
					await this.orderService.getCommissionForWeek(
						startOfPreviousWeek,
						endOfPreviousWeek,
						chatId,
					);

				if (sumCommission == 0) {
					return;
				}

				const dto: CreatePaymentDto = {
					chatId,
					price: sumCommission,
					countOrder: count,
				};

				await this.createPayment(dto);

				await this.bot.telegram.sendMessage(
					chatId,
					weeklyResultMessage(
						price,
						count,
						ConstantsService.getUserRating(rating),
						sumCommission,
						serviceCommission,
					),
					{
						parse_mode: 'HTML',
						reply_markup: callPaymentKeyboard(sumCommission).reply_markup,
					},
				);
				if (!!reviews && !!reviews?.length) {
					await this.bot.telegram.sendMessage(chatId, ReviewsMessage(reviews), {
						parse_mode: 'HTML',
					});
				}

				return;
			} catch (e) {
				this.loggerService.error('sendBulkPayment: ' + e?.toString());
			}
		});

		await Promise.all(promises).catch((e) =>
			this.loggerService.error('sendBulkPayment: ' + e?.toString()),
		);
	}

	@Cron('0 9 * * 4')
	async sendBulkBlocked() {
		const drivers = await this.paymentModel.find({ status: PaymentStatus.NotPaid }, 'chatId');
		if (!drivers.length) {
			return;
		}
		const promises = drivers.map(async ({ chatId }) => {
			try {
				await this.driverService.lockedUser(chatId);
				await this.bot.telegram.sendMessage(chatId, youLocked);
			} catch (e) {
				this.loggerService.error('sendBulkBlocked: ' + e?.toString());
			}
		});

		await Promise.all(promises).catch((e) =>
			this.loggerService.error('sendBulkBlocked: ' + e?.toString()),
		);
	}

	createTGPayload(price: number, driverEmail: string): ICreatePayment {
		const convertedPrice: string = Math.round(price / 100).toFixed(2);
		// const phone = `+${phoneString.replace(/[^0-9]/g, '')}`;
		const email = !!driverEmail ? driverEmail : 'test@gmail.com';
		return {
			amount: {
				value: convertedPrice,
				currency: 'RUB',
			},
			description: paymentTitle,
			payment_method_data: {
				type: 'bank_card',
			},
			confirmation: {
				type: 'redirect',
				return_url: ConstantsService.botLink,
			},
			receipt: {
				customer: {
					email,
				},
				items: [
					{
						description: paymentTitle,
						quantity: '1',
						amount: { value: convertedPrice, currency: 'RUB' },
						vat_code: 1,
						payment_mode: 'full_payment',
						payment_subject: 'service',
					},
				],
				email,
			},
		};
	}
}
