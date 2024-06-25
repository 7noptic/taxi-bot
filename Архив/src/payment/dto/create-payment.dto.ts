import { IsNumber } from 'class-validator';

export class CreatePaymentDto {
	@IsNumber()
	chatId: number;
	@IsNumber()
	price: number;
	@IsNumber()
	countOrder: number;
}
