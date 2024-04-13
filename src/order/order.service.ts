import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.model';
import { Model } from 'mongoose';
import { TypeId } from '../short-id/Enums/type-id.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { ShortIdService } from '../short-id/short-id.service';
import { endOfWeek, startOfWeek, subWeeks } from 'date-fns';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
		private readonly shortIdService: ShortIdService,
	) {}

	async create(dto: CreateOrderDto): Promise<OrderDocument> {
		const numberOrder = this.shortIdService.generateUniqueId(TypeId.Order);
		return this.orderModel.create({ ...dto, numberOrder });
	}

	async getCommissionForCurrentWeek(chatId: number) {
		const startOfCurrentWeek = startOfWeek(new Date());
		const endOfCurrentWeek = endOfWeek(new Date());

		return await this.getCommissionForWeek(startOfCurrentWeek, endOfCurrentWeek, chatId);
	}

	async getCommissionForPreviousWeek(chatId: number) {
		const startOfPreviousWeek = startOfWeek(subWeeks(new Date(), 1));
		const endOfPreviousWeek = endOfWeek(subWeeks(new Date(), 1));

		return await this.getCommissionForWeek(startOfPreviousWeek, endOfPreviousWeek, chatId);
	}

	async getCommissionForWeek(start: Date, end: Date, chatId: number) {
		const orders = await this.orderModel.find({
			driverId: chatId,
			createdAt: {
				$gte: start,
				$lte: end,
			},
			commission: {
				$gt: 0,
			},
		});

		const sumCommission = orders.reduce((total, order) => total + order.commission, 0);

		return {
			sumCommission,
			count: orders.length,
		};
	}
}
