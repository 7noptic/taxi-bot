import { Passenger } from '../../passenger/passenger.model';
import { Driver } from '../../driver/driver.model';
import { Order } from '../../order/order.model';
import { Message } from '../appeal.model';

export class CreateAppealDto {
	messages: Message[];
	numberAppeal: string;
	orderId?: Order;
	from: Passenger | Driver;
}
