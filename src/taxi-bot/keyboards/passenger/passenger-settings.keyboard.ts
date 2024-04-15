import { Markup } from 'telegraf';
import { PassengerButtons } from '../../buttons/passenger.buttons';

export function passengerSettingsKeyboard(name: string, phone: string, city: string) {
	return Markup.inlineKeyboard([
		[Markup.button.callback(name, PassengerButtons.settings.name.callback)],
		[Markup.button.callback(phone, PassengerButtons.settings.phone.callback)],
		[Markup.button.callback(city, PassengerButtons.settings.city.callback)],
	]);
}
