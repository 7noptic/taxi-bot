import { OrderService } from '../../../order/order.service';
import { passengerProfileKeyboard } from './passenger-profile.keyboard';
import { cancelOrderKeyboard } from './cancel-order.keyboard';

export async function selectPassengerKeyboard(chatId: number, orderService: OrderService) {
	const order = await orderService.findActiveOrderByPassengerId(chatId);
	if (order) {
		return cancelOrderKeyboard();
	}

	return passengerProfileKeyboard();
}
