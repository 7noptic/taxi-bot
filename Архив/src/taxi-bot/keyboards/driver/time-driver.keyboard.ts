import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function timeDriverKeyboard() {
	return Markup.inlineKeyboard([
		[
			Markup.button.callback(
				DriverButtons.order.time['3'].label,
				DriverButtons.order.time['3'].callback,
			),
			Markup.button.callback(
				DriverButtons.order.time['5'].label,
				DriverButtons.order.time['5'].callback,
			),
			Markup.button.callback(
				DriverButtons.order.time['7'].label,
				DriverButtons.order.time['7'].callback,
			),
		],
		[
			Markup.button.callback(
				DriverButtons.order.time['10'].label,
				DriverButtons.order.time['10'].callback,
			),
			Markup.button.callback(
				DriverButtons.order.time['15'].label,
				DriverButtons.order.time['15'].callback,
			),
			Markup.button.callback(
				DriverButtons.order.time['20'].label,
				DriverButtons.order.time['20'].callback,
			),
		],
	]);
}
