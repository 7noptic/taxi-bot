import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueType } from '../types/queue.type';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { TaxiBotContext } from '../taxi-bot/taxi-bot.context';
import { OrderDocument } from '../order/order.model';
import { Driver } from './driver.model';

@Processor(QueueType.Order)
export class DriverProcessor {
	constructor(@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>) {}

	@Process()
	async handleJob(job: Job) {
		console.log(`Processing job ${job.id} with data`, job.data);
		const driver: Driver = job.data.driver;

		const order: OrderDocument = job.data.order;

		try {
			await this.bot.telegram.sendMessage(driver.chatId, `New order: ${order._id}`, {
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'Accept',
								callback_data: `success-order-${order.passengerId}`,
							},
						],
					],
				},
			});
			console.log(`Message sent to driver ${driver.chatId} for order ${order._id}`);
		} catch (error) {
			console.error(`Error sending message to driver ${driver.chatId}: ${error.message}`);
		}
	}
}
