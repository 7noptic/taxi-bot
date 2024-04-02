import { PassengerDocument } from '../../passenger/passenger.model';
import { DriverDocument } from '../../driver/driver.model';
import { Order } from '../../order/order.model';
import { AdminDocument } from '../../admin/admin.model';

export class MessagesDto {
	from: PassengerDocument['_id'] | AdminDocument['_id'];

	text: string;

	date: Date;
}

export class CreateAppealDto {
	numberOrder?: Order['numberOrder'];
	from: PassengerDocument['_id'] | DriverDocument['_id'];
	messages: MessagesDto[];
}
