import { Markup } from 'telegraf';
import { City } from '../../city/city.model';

export function selectCityKeyboard(cities: City[]) {
	return Markup.inlineKeyboard(
		cities.map((city) => [Markup.button.callback(city.name, city.name)]),
	);
}
