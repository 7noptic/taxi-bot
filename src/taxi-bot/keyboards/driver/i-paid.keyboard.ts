import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function IPaidKeyboard(
	paymentId: string,
	price: number,
	idempotenceKey: string,
	numberPayment: string,
) {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			DriverButtons.payment.iPaid.label,
			`${DriverButtons.payment.iPaid.callback}${paymentId}_${price.toString()}_${idempotenceKey}_${numberPayment}`,
		),
	]);
}
