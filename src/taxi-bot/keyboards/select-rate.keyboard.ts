import { Markup } from 'telegraf';
import { commonButtons } from '../buttons/common.buttons';
import { UserType } from '../../types/user.type';

export function selectRateKeyboard(userChatId: number, typeUser: UserType, orderNumber: string) {
	return Markup.inlineKeyboard(
		Array.from({ length: 5 }, (_, index) => {
			console.log(index);
			return Markup.button.callback(
				commonButtons.rating.label,
				`${commonButtons.rating.callback}${userChatId}-${index + 1}-${typeUser}-${orderNumber}`,
			);
		}),
	);
}
