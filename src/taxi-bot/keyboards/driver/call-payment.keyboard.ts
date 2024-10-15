import { Markup } from 'telegraf';
import { DriverButtons } from '../../buttons/driver.buttons';

export function callPaymentKeyboard(prices: number[] | number, paymentIDs: string | string[]) {
	return Markup.inlineKeyboard(
		// @ts-ignore
		Array.isArray(prices)
			? prices?.map((price: number, index) => [
					Markup.button.callback(
						`${DriverButtons.payment.pay.label} ${price}₽`,
						`${DriverButtons.payment.pay.callback}${price}00-${paymentIDs[index]}`,
					),
				])
			: [
					Markup.button.callback(
						`${DriverButtons.payment.pay.label} ${prices}₽`,
						`${DriverButtons.payment.pay.callback}${prices}00-${paymentIDs}`,
					),
				],
	);
}
