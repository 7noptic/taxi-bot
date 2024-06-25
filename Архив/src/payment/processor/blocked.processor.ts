import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueTaskType, QueueType } from '../../types/queue.type';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { TaxiBotContext } from '../../taxi-bot/taxi-bot.context';
import { PaymentService } from '../payment.service';
import { DriverService } from '../../driver/driver.service';
import { youLocked } from '../../taxi-bot/constatnts/message.constants';

@Processor(QueueType.Blocked)
export class BlockedProcessor {
	constructor(
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		private readonly driverService: DriverService,
		private readonly paymentService: PaymentService,
	) {}

	@Process(QueueTaskType.SendBlockedToDrivers)
	async sendBlocked(job: Job) {
		const chatId: number = job.data.chatId;

		await this.driverService.lockedUser(chatId);
		await this.bot.telegram.sendMessage(chatId, youLocked);
	}

	@OnQueueError({ name: QueueTaskType.SendBlockedToDrivers })
	async onError(error) {
		console.log(error);
	}
}
