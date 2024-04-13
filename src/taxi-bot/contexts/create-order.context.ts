import { Order } from '../../order/order.model';
import { City } from '../../city/city.model';

export interface CreateOrderContext {
	wizard: {
		state: {
			type: Order['type'];
			addressFrom: Order['addressFrom']['address'];
			addressTo: Order['addressTo']['address'];
			comment: Order['comment'];
			price: Order['price'];
			minPrice: City['minPrice'];
		};
	};
}
