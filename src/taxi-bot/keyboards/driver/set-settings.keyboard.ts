import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';
import { ConstantsService } from '../../../constants/constants.service';

export function setDriverSettingsKeyboard(
	name: string,
	phone: string,
	city: string,
	car: string,
	accessTypeOrder: string,
	email: string,
) {
	return Markup.inlineKeyboard([
		[Markup.button.callback(name, DriverButtons.settings.name.callback)],
		[Markup.button.callback(phone, DriverButtons.settings.phone.callback)],
		[
			Markup.button.callback(
				!!email ? email : 'Добавить Email',
				DriverButtons.settings.email.callback,
			),
		],
		[Markup.button.callback(city, DriverButtons.settings.city.callback)],
		[Markup.button.callback(car, DriverButtons.settings.car.callback)],
		[
			Markup.button.callback(
				ConstantsService.accessOrderTypeToRus[accessTypeOrder],
				DriverButtons.settings.accessTypeOrder.callback,
			),
		],
	]);
}
