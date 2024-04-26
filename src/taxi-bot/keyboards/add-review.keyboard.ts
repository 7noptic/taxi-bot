import { Markup } from 'telegraf';
import { commonButtons } from '../buttons/common.buttons';

export function addReviewKeyboard(userChatId: number, orderNumber: string) {
	return Markup.inlineKeyboard([
		Markup.button.callback(
			commonButtons.review.label,
			`${commonButtons.review.callback}${userChatId}-${orderNumber}`,
		),
	]);
}
