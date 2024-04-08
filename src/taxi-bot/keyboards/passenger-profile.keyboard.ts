import { Markup } from 'telegraf';
import { PassengerButtons } from '../buttons/passenger.buttons';

export function passengerProfileKeyboard() {
	return Markup.keyboard([
		[Markup.button.callback(PassengerButtons.profile.callCar, PassengerButtons.profile.callCar)],
		[
			Markup.button.callback(
				PassengerButtons.profile.addresses,
				PassengerButtons.profile.addresses,
			),

			Markup.button.callback(PassengerButtons.profile.profile, PassengerButtons.profile.profile),
		],
		[
			Markup.button.callback(PassengerButtons.profile.help, PassengerButtons.profile.help),
			Markup.button.callback(PassengerButtons.profile.settings, PassengerButtons.profile.settings),
		],
	]).resize();
}
