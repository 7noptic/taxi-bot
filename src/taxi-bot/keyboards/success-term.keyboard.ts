import { Markup } from 'telegraf';
import { commonButtons } from '../buttons/common.buttons';

export function SuccessTermKeyboard() {
	return Markup.inlineKeyboard([
		[Markup.button.url(commonButtons.offer.label, commonButtons.offer.url)],
		[Markup.button.url(commonButtons.terms.label, commonButtons.terms.url)],
		[Markup.button.callback(commonButtons.success.label, commonButtons.success.callback)],
	]);
}
