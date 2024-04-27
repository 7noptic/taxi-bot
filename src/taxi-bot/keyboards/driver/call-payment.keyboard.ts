import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function callPaymentKeyboard(price: number) {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			DriverButtons.payment.pay.label,
			`${DriverButtons.payment.pay.callback}${price}00`,
		),
	]);
}
