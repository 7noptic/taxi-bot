import { Driver } from '../../driver/driver.model';
import { Passenger } from '../../passenger/passenger.model';
import { OrderDocument } from '../../order/order.model';
import { IsString } from 'class-validator';

export class CreateReviewDto {
	@IsString()
	from: Passenger['chatId'] | Driver['chatId'];

	@IsString()
	to: Passenger['chatId'] | Driver['chatId'];

	@IsString()
	orderId: OrderDocument['numberOrder'];

	@IsString()
	text: string;
}
