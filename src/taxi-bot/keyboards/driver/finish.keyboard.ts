import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';
import { StatusDriver } from '../../types/status-driver.type';

export function finishKeyboard(status: StatusDriver) {
	return Markup.keyboard([
		[
			Markup.button.callback(
				DriverButtons.order.inDrive.finish.label,
				DriverButtons.order.inDrive.finish.label,
			),
		],
		[
			Markup.button.callback(
				DriverButtons.profile.status[status],
				DriverButtons.profile.status[status],
			),
		],
		[
			Markup.button.callback(
				DriverButtons.order.inDrive.cancel.label,
				DriverButtons.order.inDrive.cancel.label,
			),
		],
	]).resize();
}
