import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Get('')
	async getAllDriversId() {
		return await this.paymentService.bulkCreatePayment();
	}
}
