import { Markup } from 'telegraf';
import { PassengerButtons } from '../../buttons/passenger.buttons';

export function AlreadyLeavingKeyboard() {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			PassengerButtons.order.leaving.label,
			PassengerButtons.order.leaving.callback,
		),
	])['reply_markup'];
}
