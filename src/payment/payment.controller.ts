import { Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { LoggerService } from '../logger/logger.service';

@Controller('payment')
export class PaymentController {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly loggerService: LoggerService,
	) {}

	@Post('createPayment')
	async createPayment() {
		try {
			return this.paymentService.sendBulkPayment();
		} catch (e) {
			this.loggerService.error('createPayment Payment: ' + e?.toString());
		}
	}
}
