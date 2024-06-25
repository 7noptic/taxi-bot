import { Markup } from 'telegraf';
import { PassengerButtons } from '../../buttons/passenger.buttons';

export function finalOrderKeyboard() {
	return Markup.inlineKeyboard([
		[
			Markup.button.callback(
				PassengerButtons.order.final.edit.label,
				PassengerButtons.order.final.edit.callback,
			),
		],
		[
			Markup.button.callback(
				PassengerButtons.order.final.success.label,
				PassengerButtons.order.final.success.callback,
			),
		],
	]);
}
