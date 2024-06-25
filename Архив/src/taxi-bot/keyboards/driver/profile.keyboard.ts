import { Markup } from 'telegraf';
import { StatusDriver } from '../../types/status-driver.type';
import { DriverButtons } from '../../buttons/driver.buttons';
import { commonButtons } from '../../buttons/common.buttons';

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
			Markup.button.callback(commonButtons.profile.help, commonButtons.profile.help),
			Markup.button.callback(commonButtons.profile.profile, commonButtons.profile.profile),
		],
	]).resize();
}
