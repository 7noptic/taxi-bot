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
import { newPaymentMessage } from '../../taxi-bot/constatnts/message.constants';
import { callPaymentKeyboard } from '../../taxi-bot/keyboards/driver/call-payment.keyboard';

@Processor(QueueType.Payment)
export class PaymentProcessor {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly orderService: OrderService,
		private readonly paymentService: PaymentService,
	) {}

	@Process(QueueTaskType.SendPaymentToDrivers)
	async sendPayment(job: Job) {
		const chatId: number = job.data.chatId;
		const { sumCommission, count } = await this.orderService.getCommissionForPreviousWeek(chatId);
		if (sumCommission == 0) {
			return;
		}
		const dto: CreatePaymentDto = {
			chatId,
			price: sumCommission,
			countOrder: count,
		};

		const payment = await this.paymentService.createPayment(dto);
		await this.bot.telegram.sendMessage(chatId, newPaymentMessage(sumCommission, count), {
			parse_mode: 'HTML',
			reply_markup: callPaymentKeyboard(sumCommission).reply_markup,
		});
	}

	@OnQueueError({ name: QueueTaskType.SendPaymentToDrivers })
	async onError(error) {
		console.log(error);
	}
}
