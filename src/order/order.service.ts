import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.model';
import { Model } from 'mongoose';
import { TypeId } from '../short-id/Enums/type-id.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { ShortIdService } from '../short-id/short-id.service';
import { OrdersInfoDto } from './dto/orders-info.dto';
import { DriverOrdersInfoDto } from './dto/driver-orders-info.dto';
import { getCommissionForWeekPipeline } from './pipelines/getCommissionForWeek.pipeline';
import { getPassengerOrdersInfoPipeline } from './pipelines/getPassengerOrdersInfo.pipeline';
import { getDriverOrdersInfoPipeline } from './pipelines/getDriverOrdersInfo.pipeline';
import { StatusOrder } from './Enum/status-order';
import { DriverService } from '../driver/driver.service';
import { SettingsService } from '../settings/settings.service';
import { QueryType, ResponseType } from '../types/query.type';
import { getFullOrderInfoPipeline } from './pipelines/getFullOrderInfo.pipeline';
import { Review } from '../review/review.model';
import { Appeal } from '../appeal/appeal.model';
import { getStatisticsByCityPipeline } from './pipelines/getStatisticsByCity.pipeline';
import { startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { getAllStatisticPipeline } from './pipelines/getAllStatistic.pipeline';
import { ResultStatisticAllDto } from './dto/result-statistic-all.dto';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
		private readonly shortIdService: ShortIdService,
		private readonly driverService: DriverService,
		private readonly settingsService: SettingsService,
	) {}

	async create(dto: CreateOrderDto): Promise<OrderDocument> {
		const numberOrder = this.shortIdService.generateUniqueId(TypeId.Order);
		return this.orderModel.create({ ...dto, numberOrder });
	}

	async findById(id: string) {
		return this.orderModel.findById(id);
	}

	async findByNumberOrder(text: string) {
		return this.orderModel
			.find({ numberOrder: { $regex: text, $options: 'i' } })
			.limit(40)
			.sort({ createdAt: -1 });
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

	async cancelOrderFromDriver(id: string) {
		const { driverId } = await this.orderModel
			.findByIdAndUpdate(
				id,
				{
					status: StatusOrder.CancelDriver,
				},
				{
					new: true,
				},
			)
			.exec();

		await this.driverService.switchBusyByChatId(driverId, false);
		await this.driverService.downgradeRating(driverId);
	}

	async successOrderFromDriver(id: string, driverId: number) {
		const { commission: driverCommission, commissionExpiryDate } =
			await this.driverService.findByChatId(driverId);
		const { commission: settingsCommission } = await this.settingsService.getSettings();
		const commission =
			driverCommission > 0 && commissionExpiryDate > new Date()
				? driverCommission
				: settingsCommission;

		// const { price } = await this.orderModel.findById(id);
		// const calculatedCommission = Math.round(price * (commission / 100));

		await this.orderModel
			.findByIdAndUpdate(
				id,
				{
					status: StatusOrder.Success,
					commission,
					// commission: calculatedCommission,
				},
				{
					new: true,
				},
			)
			.exec();

		// await this.driverService.switchBusyByChatId(driverId, false);
		await this.driverService.upgradeRating(driverId);
	}

	async findActiveOrderByDriverId(driverId: number): Promise<OrderDocument> {
		return this.orderModel.findOne({
			driverId,
			$or: [{ status: StatusOrder.InProcess }, { status: StatusOrder.Wait }],
		});
	}

	async findSecondActiveOrderByDriverId(driverId: number): Promise<OrderDocument> {
		return this.orderModel.findOne({
			driverId,
			status: StatusOrder.DriverInBusy,
		});
	}

	async findActiveOrderByPassengerId(passengerId: number) {
		return this.orderModel.findOne({
			passengerId,
			$or: [
				{ status: StatusOrder.InProcess },
				{ status: StatusOrder.Wait },
				{ status: StatusOrder.DriverInBusy },
			],
		});
	}

	async selectDriverForOrder(
		id: string,
		driverId: number,
		submissionTime: number,
		driverIsBusy: boolean,
		price?: number | null,
	) {
		const updateParams: Partial<Order> = {
			driverId,
			status: driverIsBusy ? StatusOrder.DriverInBusy : StatusOrder.Wait,
			submissionTime,
			findDriverAt: new Date(),
		};

		if (price) {
			updateParams.price = price;
		}

		const order = await this.orderModel.findByIdAndUpdate(id, updateParams, { new: true }).exec();

		await this.driverService.switchBusyByChatId(driverId, true);

		return order;
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

	async getLimitAll(currentPageInQuery?: QueryType['currentPage']): Promise<ResponseType<Order[]>> {
		const perPageCount = 10;
		const currentPage = Number(currentPageInQuery) || 1;
		const skip = perPageCount * (currentPage - 1);

		const orders: Order[] = await this.orderModel
			.find()
			.sort({ createdAt: -1 })
			.limit(perPageCount)
			.skip(skip);
		const total = await this.orderModel.countDocuments();

		return { data: orders, total, currentPage, perPageCount };
	}

	async getAll() {
		return this.orderModel.find().sort({ createdAt: -1 });
	}

	async getFullOrderInfo(orderId: string) {
		const order = (
			await this.orderModel.aggregate(getFullOrderInfoPipeline(orderId)).exec()
		)[0] as Order & {
			reviews: Review[];
			appeals: Appeal[];
		};
		return order ?? {};
	}

	async getStatisticsByCity() {
		// : Promise<ResultStatisticByCityDto>
		const stats = await this.orderModel.aggregate(getStatisticsByCityPipeline());

		return stats;
	}

	async getAllStatistic(): Promise<ResultStatisticAllDto> {
		const today = startOfDay(new Date());
		const weekStart = startOfWeek(today);
		const monthStart = startOfMonth(today);
		const allOrders = await this.orderModel.aggregate([{ $match: {} }, getAllStatisticPipeline()]);

		const todayOrders = await this.orderModel.aggregate([
			{ $match: { createdAt: { $gte: today } } },
			getAllStatisticPipeline(),
		]);

		const weekOrders = await this.orderModel.aggregate([
			{ $match: { createdAt: { $gte: weekStart } } },
			getAllStatisticPipeline(),
		]);

		const monthOrders = await this.orderModel.aggregate([
			{ $match: { createdAt: { $gte: monthStart } } },
			getAllStatisticPipeline(),
		]);
		const [allOrdersResult, todayOrdersResult, weekOrdersResult, monthOrdersResult] =
			await Promise.all([allOrders, todayOrders, weekOrders, monthOrders]);

		return {
			all: {
				totalOrders: allOrdersResult[0]?.totalOrders || 0,
				totalCancelOrders: allOrdersResult[0]?.totalCancelOrders || 0,
				totalSuccess: allOrdersResult[0]?.totalSuccessOrders || 0,
				totalDriverOrders: allOrdersResult[0]?.totalDriverOrders || 0,
				totalDeliveryOrders: allOrdersResult[0]?.totalDeliveryOrders || 0,
				totalPrice: allOrdersResult[0]?.totalPrice || 0,
				totalCommission: allOrdersResult[0]?.totalCommission || 0,
			},

			today: {
				totalOrders: todayOrdersResult[0]?.totalOrders || 0,
				totalCancelOrders: todayOrdersResult[0]?.totalCancelOrders || 0,
				totalSuccess: todayOrdersResult[0]?.totalSuccessOrders || 0,
				totalDriverOrders: todayOrdersResult[0]?.totalDriverOrders || 0,
				totalDeliveryOrders: todayOrdersResult[0]?.totalDeliveryOrders || 0,
				totalPrice: todayOrdersResult[0]?.totalPrice || 0,
				totalCommission: todayOrdersResult[0]?.totalCommission || 0,
			},
			week: {
				totalOrders: weekOrdersResult[0]?.totalOrders || 0,
				totalCancelOrders: weekOrdersResult[0]?.totalCancelOrders || 0,
				totalSuccess: weekOrdersResult[0]?.totalSuccessOrders || 0,
				totalDriverOrders: weekOrdersResult[0]?.totalDriverOrders || 0,
				totalDeliveryOrders: weekOrdersResult[0]?.totalDeliveryOrders || 0,
				totalPrice: weekOrdersResult[0]?.totalPrice || 0,
				totalCommission: weekOrdersResult[0]?.totalCommission || 0,
			},
			month: {
				totalOrders: monthOrdersResult[0]?.totalOrders || 0,
				totalCancelOrders: monthOrdersResult[0]?.totalCancelOrders || 0,
				totalSuccess: monthOrdersResult[0]?.totalSuccessOrders || 0,
				totalDriverOrders: monthOrdersResult[0]?.totalDriverOrders || 0,
				totalDeliveryOrders: monthOrdersResult[0]?.totalDeliveryOrders || 0,
				totalPrice: monthOrdersResult[0]?.totalPrice || 0,
				totalCommission: monthOrdersResult[0]?.totalCommission || 0,
			},
		};
	}
}
