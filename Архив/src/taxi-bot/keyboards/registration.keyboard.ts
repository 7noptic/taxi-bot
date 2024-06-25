import { Markup } from 'telegraf';
import { registrationButtons } from '../buttons/registration.buttons';

export function registrationKeyboard() {
	return Markup.keyboard(
		[
			Markup.button.callback(
				registrationButtons.passenger.label,
				registrationButtons.passenger.callback,
			),
			Markup.button.callback(registrationButtons.driver.label, registrationButtons.driver.callback),
		],
		{ columns: 2 },
	).resize();
}
