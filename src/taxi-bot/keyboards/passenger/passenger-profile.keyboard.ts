import { Markup } from 'telegraf';
import { PassengerButtons } from '../../buttons/passenger.buttons';
import { commonButtons } from '../../buttons/common.buttons';

export function passengerProfileKeyboard() {
	return Markup.keyboard([
		[Markup.button.callback(PassengerButtons.profile.callCar, PassengerButtons.profile.callCar)],
		[
			Markup.button.callback(
				PassengerButtons.profile.addresses,
				PassengerButtons.profile.addresses,
			),

			Markup.button.callback(commonButtons.profile.profile, commonButtons.profile.profile),
		],
		[
			Markup.button.callback(commonButtons.profile.help, commonButtons.profile.help),
			Markup.button.callback(PassengerButtons.profile.settings, PassengerButtons.profile.settings),
		],
	]).resize();
}
