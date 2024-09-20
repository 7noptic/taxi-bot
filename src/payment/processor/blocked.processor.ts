// @Processor(QueueType.Blocked)
// export class BlockedProcessor {
// 	constructor(
// 		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
// 		private readonly driverService: DriverService,
// 		private readonly paymentService: PaymentService,
// 	) {}
//
// 	@Process(QueueTaskType.SendBlockedToDrivers)
// 	async sendBlocked(job: Job) {
// 		const chatId: number = job.data.chatId;
//
// 		await this.driverService.lockedUser(chatId);
// 		await this.bot.telegram.sendMessage(chatId, youLocked);
// 	}
//
// 	@OnQueueError({ name: QueueTaskType.SendBlockedToDrivers })
// 	async onError(error) {
// 		console.log(error);
// 	}
// }
