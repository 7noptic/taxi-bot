import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function profileDriverSettingsKeyboard() {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			DriverButtons.settings.settings.label,
			DriverButtons.settings.settings.callback,
		),
	]);
}
