import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueTaskType, QueueType } from '../types/queue.type';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { TaxiBotContext } from '../taxi-bot/taxi-bot.context';

@Processor(QueueType.Newsletter)
export class NewsletterProcessor {
	constructor(@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>) {}

	@Process(QueueTaskType.SendNews)
	async sendBlocked(job: Job) {
		const chatId: number = job.data.chatId;
		const message: string = job.data.message;

		await this.bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' });
	}

	@OnQueueError({ name: QueueTaskType.SendNews })
	async onError(error) {
		console.log(error);
	}
}
