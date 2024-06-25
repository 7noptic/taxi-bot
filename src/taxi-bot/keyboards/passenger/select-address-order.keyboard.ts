import { Markup } from 'telegraf';
import { Address } from '../../../passenger/passenger.model';

export function selectAddressOrderKeyboard(
	passengerAddresses: Address[],
	savedAddresses?: Address[],
) {
	return Markup.inlineKeyboard([
		...passengerAddresses.map((address) => {
			return [Markup.button.callback(`🏠 ${address.name}`, address.name)];
		}),
		...savedAddresses?.map((address) => {
			return [Markup.button.callback(`🕐 ${address.address}`, address.name)];
		}),
	]);
}
