import { Markup } from 'telegraf';
import { PassengerButtons } from '../../buttons/passenger.buttons';

export function skipCommentOrderKeyboard() {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			PassengerButtons.order.comment.skip.label,
			PassengerButtons.order.comment.skip.callback,
		),
	]);
}
