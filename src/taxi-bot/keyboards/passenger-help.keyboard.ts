import { Markup } from 'telegraf';
import { PassengerButtons } from '../buttons/passenger.buttons';

export function passengerHelpKeyboard() {
	return Markup.inlineKeyboard([
		[Markup.button.callback(PassengerButtons.help.faq.label, PassengerButtons.help.faq.callback)],
		[
			Markup.button.callback(
				PassengerButtons.help.price.label,
				PassengerButtons.help.price.callback,
			),
		],
		[
			Markup.button.callback(
				PassengerButtons.help.about.label,
				PassengerButtons.help.about.callback,
			),
		],
		[
			Markup.button.callback(
				PassengerButtons.help.support.label,
				PassengerButtons.help.support.callback,
			),
		],
	]);
}
