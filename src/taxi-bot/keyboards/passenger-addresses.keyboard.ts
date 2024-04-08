import { Markup } from 'telegraf';
import { PassengerButtons } from '../buttons/passenger.buttons';

export function passengerAddressesKeyboard() {
	return Markup.keyboard([
		[
			Markup.button.callback(PassengerButtons.address.add, PassengerButtons.address.add),

			Markup.button.callback(PassengerButtons.address.delete, PassengerButtons.address.delete),
		],

		[Markup.button.callback(PassengerButtons.address.back, PassengerButtons.address.back)],
	]).resize();
}
