import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueTaskType, QueueType } from '../../types/queue.type';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { TaxiBotContext } from '../../taxi-bot/taxi-bot.context';
import { OrderDocument } from '../../order/order.model';
import { Driver } from '../driver.model';
import { newOrderMessage } from '../../taxi-bot/constatnts/message.constants';
import { orderKeyboard } from '../../taxi-bot/keyboards/driver/order.keyboard';

@Processor(QueueType.Order)
export class OrderProcessor {
	constructor(@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>) {}

	@Process(QueueTaskType.SendOrderToDrivers)
	async sendOrder(job: Job) {
		const driver: Driver = job.data.driver;
		const order: OrderDocument = job.data.order;
		const passengerRating: string = job.data.passengerRating;
		try {
			await this.bot.telegram.sendMessage(driver.chatId, newOrderMessage(order, passengerRating), {
				parse_mode: 'HTML',
				reply_markup: orderKeyboard(order),
			});
		} catch (error) {
			console.error(`Error sending message to driver ${driver.chatId}: ${error.message}`);
		}
	}

	@OnQueueError({ name: QueueTaskType.SendOrderToDrivers })
	async onError(error) {
		console.log(error);
	}
}
