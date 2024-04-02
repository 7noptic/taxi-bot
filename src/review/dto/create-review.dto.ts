import { Driver } from '../../driver/driver.model';
import { Passenger } from '../../passenger/passenger.model';
import { Order } from '../../order/order.model';

export class CreateReviewDto {
	from: Passenger | Driver;
	to: Passenger | Driver;
	orderId: Order;
	text: string;
}
