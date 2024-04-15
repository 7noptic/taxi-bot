import { Markup } from 'telegraf';
import { commonButtons } from '../buttons/common.buttons';

export function helpKeyboard() {
	return Markup.inlineKeyboard([
		[Markup.button.callback(commonButtons.help.faq.label, commonButtons.help.faq.callback)],
		[Markup.button.callback(commonButtons.help.price.label, commonButtons.help.price.callback)],
		[Markup.button.callback(commonButtons.help.about.label, commonButtons.help.about.callback)],
		[Markup.button.callback(commonButtons.help.support.label, commonButtons.help.support.callback)],
	]);
}
