import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
	@IsNumber()
	chatId: number;
	@IsNumber()
	price: number;
	@IsString()
	numberPayment: string;
}
