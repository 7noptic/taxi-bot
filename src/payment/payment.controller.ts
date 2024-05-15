import { Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { LoggerService } from '../logger/logger.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('payment')
export class PaymentController {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('createPayment')
	async createPayment() {
		try {
			return this.paymentService.sendBulkPayment();
		} catch (e) {
			this.loggerService.error('createPayment Payment: ' + e?.toString());
		}
	}
}
