import { Markup } from 'telegraf';
import { commonButtons } from '../../buttons/common.buttons';

export function cancelOrderKeyboard() {
	return Markup.keyboard([
		Markup.button.callback(commonButtons.cancelOrder.label, commonButtons.cancelOrder.callback),
	]).resize();
}
