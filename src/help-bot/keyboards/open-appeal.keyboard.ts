import { Markup } from 'telegraf';
import { HelpBotButtons } from '../buttons/help-bot.buttons';

export function OpenAppealKeyboard() {
	return Markup.keyboard([
		Markup.button.callback(HelpBotButtons.open.label, HelpBotButtons.open.callback),
	]).resize();
}
