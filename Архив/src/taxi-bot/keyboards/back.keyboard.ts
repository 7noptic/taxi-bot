import { Markup } from 'telegraf';
import { commonButtons } from '../buttons/common.buttons';

export function backKeyboard() {
	return Markup.keyboard([Markup.button.callback(commonButtons.back, commonButtons.back)], {
		columns: 2,
	}).resize();
}
