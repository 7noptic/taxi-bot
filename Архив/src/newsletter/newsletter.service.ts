import { Injectable } from '@nestjs/common';
import { NewsletterType } from './enum/newsletter.type';
import { Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { PassengerService } from '../passenger/passenger.service';
import { DriverService } from '../driver/driver.service';
import { QueueTaskType, QueueType } from '../types/queue.type';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class NewsletterService {
	constructor(
		private readonly driverService: DriverService,
		private readonly passengerService: PassengerService,
		@InjectQueue(QueueType.Newsletter) private readonly orderQueue: Queue,
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
		await Promise.all(
			users.map(async ({ chatId }) => {
				await this.orderQueue.add(QueueTaskType.SendNews, { chatId, message }, { delay: 100 });
			}),
		);
	}
}
