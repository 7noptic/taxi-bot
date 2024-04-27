import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './payment.model';
import { Model } from 'mongoose';
import { TypeId } from '../short-id/Enums/type-id.enum';
import { ShortIdService } from '../short-id/short-id.service';
import { QueueTaskType, QueueType } from '../types/queue.type';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DriverService } from '../driver/driver.service';
import { PaymentStatus } from './enum/payment-status';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PaymentService {
	constructor(
		@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
		@InjectQueue(QueueType.Payment) private readonly paymentQueue: Queue,
		@InjectQueue(QueueType.Blocked) private readonly blockedQueue: Queue,
		private readonly shortIdService: ShortIdService,
		private readonly driverService: DriverService,
	) {}

	async createPayment(dto: CreatePaymentDto) {
		const numberPayment = this.shortIdService.generateUniqueId(TypeId.Payment);
		return this.paymentModel.create({ ...dto, numberPayment });
	}

	async findNotPaidPayment(chatId: number) {
		return this.paymentModel.findOne({ chatId, status: PaymentStatus.NotPaid });
	}

	async closePayment(chatId: number) {
		await this.driverService.unlockedUser(chatId);

		return this.paymentModel.findOneAndUpdate(
			{ chatId },
			{
				status: PaymentStatus.Paid,
			},
		);
	}

	@Cron('0 9 * * 1')
	async sendBulkPayment() {
		const drivers = await this.driverService.getAllDriversId();
		if (!drivers.length) {
			return;
		}

		await Promise.all(
			drivers.map(async ({ chatId }) => {
				await this.paymentQueue.add(QueueTaskType.SendPaymentToDrivers, { chatId });
			}),
		);
	}

	@Cron('0 9 * * 4')
	async sendBulkBlocked() {
		const drivers = await this.paymentModel.find({ status: PaymentStatus.NotPaid }, 'chatId');
		if (!drivers.length) {
			return;
		}
		await Promise.all(
			drivers.map(async ({ chatId }) => {
				await this.blockedQueue.add(QueueTaskType.SendBlockedToDrivers, { chatId });
			}),
		);
	}
}
