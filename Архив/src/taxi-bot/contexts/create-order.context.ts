import { Order } from '../../order/order.model';
import { City } from '../../city/city.model';

export interface CreateOrderContext {
	wizard: {
		state: {
			type: Order['type'];
			addressFrom: string;
			addressTo: string;
			comment: Order['comment'];
			price: Order['price'];
			minPrice: City['minPrice'];
			id: string;
			driverId: number;
		};
	};
}
