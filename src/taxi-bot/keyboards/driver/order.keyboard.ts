import { OrderDocument } from '../../../order/order.model';
import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function orderKeyboard(order: OrderDocument) {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			DriverButtons.order.bargain.label,
			`${DriverButtons.order.bargain.callback}${order._id}-${order.passengerId}`,
		),
		Markup.button.callback(
			DriverButtons.order.access.label,
			`${DriverButtons.order.access.callback}${order._id}-${order.passengerId}`,
		),
	])['reply_markup'];
}
