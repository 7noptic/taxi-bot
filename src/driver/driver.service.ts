import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './driver.model';
import { Model } from 'mongoose';
import { CreateDriverDto } from './dto/create-driver.dto';
import { StatusDriver } from '../taxi-bot/types/status-driver.type';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { TaxiBotContext } from '../taxi-bot/taxi-bot.context';
import { Order } from '../order/order.model';
import { Queue } from 'bull';
import { QueueTaskType, QueueType } from '../types/queue.type';
import { InjectQueue } from '@nestjs/bull';
import { AccessTypeOrder } from './Enum/access-type-order';
import { NotDrivers } from '../taxi-bot/constatnts/message.constants';

@Injectable()
export class DriverService {
	constructor(
		@InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
		@InjectBot(BotName.Taxi) private readonly bot: Telegraf<TaxiBotContext>,
		@InjectQueue(QueueType.Order) private readonly orderQueue: Queue,
	) {}

	async create(dto: CreateDriverDto) {
		return this.driverModel.create(dto);
	}

	async findByChatId(chatId: number) {
		return await this.driverModel.findOne({ chatId }).exec();
	}

	async toggleStatusByChatId(chatId: number) {
		return this.driverModel
			.findOneAndUpdate(
				{ chatId },
				[
					{
						$set: {
							status: {
								$switch: {
									branches: [
										{ case: { $eq: ['$status', StatusDriver.Online] }, then: StatusDriver.Offline },
										{ case: { $eq: ['$status', StatusDriver.Offline] }, then: StatusDriver.Online },
									],
									default: '$status',
								},
							},
						},
					},
				],

				{ new: true },
			)
			.exec();
	}

	async editName(chatId: Driver['chatId'], new_name: Driver['first_name']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					first_name: new_name,
				},
			},
		);
	}

	async editPhone(chatId: Driver['chatId'], new_phone: Driver['phone']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					phone: new_phone,
				},
			},
		);
	}

	async editCity(chatId: Driver['chatId'], new_city: Driver['city']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					city: new_city,
				},
			},
		);
	}

	async editAccessTypeOrder(chatId: Driver['chatId'], new_access_type: Driver['accessOrderType']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					accessOrderType: new_access_type,
				},
			},
		);
	}

	async editCar(chatId: Driver['chatId'], new_car: Driver['car']) {
		return this.driverModel.findOneAndUpdate(
			{ chatId },
			{
				$set: {
					car: new_car,
				},
			},
		);
	}

	async sendBulkOrder(order: Order, passengerRating: string) {
		const drivers = await this.driverModel.find({
			status: StatusDriver.Online,
			city: order.city,
			$or: [{ accessOrderType: AccessTypeOrder.ALL }, { accessOrderType: order.type }],
		});
		if (!drivers.length) {
			await this.bot.telegram.sendMessage(order.passengerId, NotDrivers);
			return;
		}

		await Promise.all(
			drivers.map(async (driver) => {
				await this.orderQueue.add(
					QueueTaskType.SendOrderToDrivers,
					{ driver, order, passengerRating },
					{ delay: 100 },
				);
			}),
		);
	}
}
