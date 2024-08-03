import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function cancelOrderKeyboard() {
	return Markup.keyboard([
		[
			Markup.button.callback(
				DriverButtons.order.inDrive.cancelSuccess.label,
				DriverButtons.order.inDrive.cancelSuccess.label,
			),
		],

		[
			Markup.button.callback(
				DriverButtons.order.inDrive.cancelFail.label,
				DriverButtons.order.inDrive.cancelFail.label,
			),
		],
	]).resize();
}
