import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function finishKeyboard() {
	return Markup.keyboard([
		Markup.button.callback(
			DriverButtons.order.inDrive.finish.label,
			DriverButtons.order.inDrive.finish.label,
		),
		Markup.button.callback(
			DriverButtons.order.inDrive.cancel.label,
			DriverButtons.order.inDrive.cancel.label,
		),
	]).resize();
}
