import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function callPaymentKeyboard(prices: number[]) {
	return Markup.inlineKeyboard(
		prices.map((price: number) => [
			Markup.button.callback(
				`${DriverButtons.payment.pay.label} ${price}₽`,
				`${DriverButtons.payment.pay.callback}${price}00`,
			),
		]),
	);
}
