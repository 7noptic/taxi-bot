import { Markup } from 'telegraf';
import { PassengerButtons } from '../../buttons/passenger.buttons';

export function driverOfferKeyboard(
	orderId: string,
	driverId: number,
	submissionTime: number,
	price?: number,
) {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			PassengerButtons.offer.cancel.label,
			`${PassengerButtons.offer.cancel.callback}${orderId}-${driverId}-${submissionTime}`,
		),
		Markup.button.callback(
			PassengerButtons.offer.success.label,
			`${PassengerButtons.offer.success.callback}${orderId}-${driverId}-${submissionTime}${price ? `-${price}` : ''}`,
		),
	]).reply_markup;
}
