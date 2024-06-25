import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function goDriveKeyboard() {
	return Markup.keyboard([
		Markup.button.callback(
			DriverButtons.order.inDrive.go.label,
			DriverButtons.order.inDrive.go.label,
		),
		Markup.button.callback(
			DriverButtons.order.inDrive.cancel.label,
			DriverButtons.order.inDrive.cancel.label,
		),
	]).resize();
}
