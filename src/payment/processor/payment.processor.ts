import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueTaskType, QueueType } from '../../types/queue.type';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { TaxiBotContext } from '../../taxi-bot/taxi-bot.context';
import { OrderService } from '../../order/order.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentService } from '../payment.service';
import {
	newPaymentMessage,
	notEnoughAmountToPay,
} from '../../taxi-bot/constatnts/message.constants';
import { callPaymentKeyboard } from '../../taxi-bot/keyboards/driver/call-payment.keyboard';
import { LoggerService } from '../../logger/logger.service';

@Processor(QueueType.Payment)
export class PaymentProcessor {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly orderService: OrderService,
		private readonly paymentService: PaymentService,
		private readonly loggerService: LoggerService,
	) {}

	@Process(QueueTaskType.SendPaymentToDrivers)
	async sendPayment(job: Job) {
		try {
			const chatId: number = Number(job.data.chatId);
			const startOfPreviousWeek: Date = new Date(job.data.startOfPreviousWeek);
			const endOfPreviousWeek: Date = new Date(job.data.endOfPreviousWeek);

			const { sumCommission, count } = await this.orderService.getCommissionForWeek(
				startOfPreviousWeek,
				endOfPreviousWeek,
				chatId,
			);
			if (sumCommission == 0) {
				return;
			}

			if (sumCommission < 100) {
				await this.bot.telegram.sendMessage(chatId, notEnoughAmountToPay, {
					parse_mode: 'HTML',
				});
				return;
			}

			const dto: CreatePaymentDto = {
				chatId,
				price: sumCommission,
				countOrder: count,
			};

			await this.paymentService.createPayment(dto);
			await this.bot.telegram.sendMessage(chatId, newPaymentMessage(sumCommission, count), {
				parse_mode: 'HTML',
				reply_markup: callPaymentKeyboard(sumCommission).reply_markup,
			});
		} catch (error) {
			this.loggerService.error(QueueTaskType.SendPaymentToDrivers + error?.toString());
		}
	}

	@OnQueueError({ name: QueueTaskType.SendPaymentToDrivers })
	async onError(error: any) {
		this.loggerService.error(QueueTaskType.SendPaymentToDrivers + error?.toString());
	}
}
