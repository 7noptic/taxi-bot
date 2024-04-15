import { Markup } from 'telegraf';

export function selectPriceOrderKeyboard(minPrice: number) {
	const keyboard = Array.from({ length: 2 }, (_, i) => {
		return Array.from({ length: 4 }, (_, j) => {
			const price = minPrice + 50 * (i * 4 + j);
			return Markup.button.callback(`${price}₽`, String(price));
		});
	});

	return Markup.inlineKeyboard(keyboard);
}
