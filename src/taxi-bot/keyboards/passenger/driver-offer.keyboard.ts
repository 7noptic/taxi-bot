import { Markup } from 'telegraf';
import { PassengerButtons } from '../../buttons/passenger.buttons';

export function driverOfferKeyboard(orderId: string, driverId: number, price?: number) {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			PassengerButtons.offer.cancel.label,
			`${PassengerButtons.offer.cancel.callback}${orderId}-${driverId}`,
		),
		Markup.button.callback(
			PassengerButtons.offer.success.label,
			`${PassengerButtons.offer.success.callback}${orderId}-${driverId}${price ? `-${price}` : ''}`,
		),
	]).reply_markup;
}
