import { Markup } from 'telegraf';
import { HelpBotButtons } from '../buttons/help-bot.buttons';

export function CloseAppealKeyboard() {
	return Markup.keyboard([
		Markup.button.callback(HelpBotButtons.close.label, HelpBotButtons.close.callback),
	]).resize();
}
