import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function inDriveKeyboard() {
	return Markup.keyboard([
		Markup.button.callback(
			DriverButtons.order.inDrive.place.label,
			DriverButtons.order.inDrive.place.label,
		),
		Markup.button.callback(
			DriverButtons.order.inDrive.cancel.label,
			DriverButtons.order.inDrive.cancel.label,
		),
	]).resize();
}
