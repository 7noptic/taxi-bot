import { Markup } from 'telegraf';
import { Address } from '../../passenger/passenger.model';

export function selectAddressOrderKeyboard(addresses: Address[]) {
	return Markup.inlineKeyboard([
		...addresses.map((address) => {
			return Markup.button.callback(address.address, address.address);
		}),
	]);
}
