import { Markup } from 'telegraf';
import { StatusDriver } from '../../types/status-driver.type';
import { DriverButtons } from '../../buttons/driver.buttons';

export function driverProfileKeyboard(status: StatusDriver) {
	return Markup.keyboard([
		[
			Markup.button.callback(
				DriverButtons.profile.status[status],
				DriverButtons.profile.status[status],
			),
		],
		[
			Markup.button.callback(DriverButtons.profile.statistics, DriverButtons.profile.statistics),
			Markup.button.callback(DriverButtons.profile.commission, DriverButtons.profile.commission),
		],
		[
			Markup.button.callback(DriverButtons.profile.help, DriverButtons.profile.help),
			Markup.button.callback(DriverButtons.profile.profile, DriverButtons.profile.profile),
		],
	]).resize();
}
