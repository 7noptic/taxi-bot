import { Markup } from 'telegraf';
import { PassengerButtons } from '../buttons/passenger.buttons';

export function selectTypeOrderKeyboard() {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			PassengerButtons.order.type.drive.label,
			PassengerButtons.order.type.drive.callback,
		),
		Markup.button.callback(
			PassengerButtons.order.type.delivery.label,
			PassengerButtons.order.type.delivery.callback,
		),
	]);
}
