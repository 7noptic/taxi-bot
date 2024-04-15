import { Markup } from 'telegraf';
import { AccessTypeOrder } from '../../../driver/Enum/access-type-order';
import { ConstantsService } from '../../../constants/constants.service';

export function selectAccessOrderTypeKeyboard() {
	return Markup.inlineKeyboard([
		[
			Markup.button.callback(
				ConstantsService.accessOrderTypeToRus[AccessTypeOrder.DRIVE],
				AccessTypeOrder.DRIVE.toString(),
			),
		],
		[
			Markup.button.callback(
				ConstantsService.accessOrderTypeToRus[AccessTypeOrder.DELIVERY],
				AccessTypeOrder.DELIVERY.toString(),
			),
		],
		[
			Markup.button.callback(
				ConstantsService.accessOrderTypeToRus[AccessTypeOrder.ALL],
				AccessTypeOrder.ALL,
			),
		],
	]);
}
