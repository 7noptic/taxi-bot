import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './payment.model';
import { Model } from 'mongoose';
import { DriverService } from '../driver/driver.service';

@Injectable()
export class PaymentService {
	constructor(
		@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
		private readonly driverService: DriverService,
	) {}

	async createPayment(dto: CreatePaymentDto) {
		return this.paymentModel.create(dto);
	}

	async bulkCreatePayment() {
		const test = this.driverService.getAllDriversId();
		return test;
	}
}
