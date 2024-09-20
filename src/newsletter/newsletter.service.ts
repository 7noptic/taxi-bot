import { Injectable } from '@nestjs/common';
import { NewsletterType } from './enum/newsletter.type';
import { Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { PassengerService } from '../passenger/passenger.service';
import { DriverService } from '../driver/driver.service';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { TaxiBotContext } from '../taxi-bot/taxi-bot.context';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class NewsletterService {
	constructor(
		private readonly driverService: DriverService,
		private readonly passengerService: PassengerService,
		private readonly loggerService: LoggerService,
		// @InjectQueue(QueueType.Newsletter) private readonly orderQueue: Queue,
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
	) {}

	async sendNews(type: string, message: string) {
		if (type! in NewsletterType) return;
		let users: (Passenger | Driver)[] = [];
		switch (type) {
			case NewsletterType.Passengers:
				users = await this.passengerService.getAllPassengersId();
				break;
			case NewsletterType.Drivers:
				users = await this.driverService.getAllDriversId();
				break;
			case NewsletterType.All:
				users = [
					...(await this.driverService.getAllDriversId()),
					...(await this.passengerService.getAllPassengersId()),
				];
		}
		const promises = users.map(async ({ chatId }) => {
			try {
				await this.bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' });
			} catch (error) {
				console.error(`Error sending message to driver ${chatId}: ${error.message}`);
			}
		});

		await Promise.all(promises).catch((e) =>
			this.loggerService.error('sendNews: ' + e?.toString()),
		);
	}
}
