import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.model';
import { Model } from 'mongoose';
import { TypeId } from '../short-id/Enums/type-id.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { ShortIdService } from '../short-id/short-id.service';
import { endOfWeek, startOfWeek, subWeeks } from 'date-fns';
import { OrdersInfoDto } from './dto/orders-info.dto';
import { DriverOrdersInfoDto } from './dto/driver-orders-info.dto';
import { getCommissionForWeekPipeline } from './pipelines/getCommissionForWeek.pipeline';
import { getPassengerOrdersInfoPipeline } from './pipelines/getPassengerOrdersInfo.pipeline';
import { getDriverOrdersInfoPipeline } from './pipelines/getDriverOrdersInfo.pipeline';
import { StatusOrder } from './Enum/status-order';

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

	async findById(id: string) {
		return this.orderModel.findById(id);
	}

	async switchOrderStatusById(id: string, status: StatusOrder) {
		return this.orderModel
			.findByIdAndUpdate(
				id,
				{
					status: status,
				},
				{
					new: true,
				},
			)
			.exec();
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
		const result = await this.orderModel.aggregate(
			getCommissionForWeekPipeline(chatId, start, end),
		);

		return {
			sumCommission: result.length > 0 ? result[0].sumCommission : 0,
			count: result.length > 0 ? result[0].count : 0,
		};
	}

	async getPassengerOrdersInfo(chatId: number): Promise<OrdersInfoDto> {
		const result = await this.orderModel.aggregate(getPassengerOrdersInfoPipeline(chatId));

		if (result.length > 0) {
			return result[0];
		} else {
			return {
				totalCount: 0,
				driveCount: 0,
				deliveryCount: 0,
				canceledCount: 0,
			};
		}
	}

	async getDriverOrdersInfo(chatId: number): Promise<DriverOrdersInfoDto> {
		const result = await this.orderModel.aggregate(getDriverOrdersInfoPipeline(chatId));

		if (result.length > 0) {
			return result[0];
		} else {
			return {
				earnedToday: 0,
				earnedCurrentWeek: 0,
				countToday: 0,
				driveCountToday: 0,
				deliveryCountToday: 0,
				canceledCountToday: 0,
				countCurrentWeek: 0,
				driveCountCurrentWeek: 0,
				deliveryCountCurrentWeek: 0,
				canceledCountCurrentWeek: 0,
				countAll: 0,
				driveCountAll: 0,
				deliveryCountAll: 0,
				canceledCountAll: 0,
			};
		}
	}
}
