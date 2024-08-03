import { Driver } from '../../../driver/driver.model';
import { OrderService } from '../../../order/order.service';
import { StatusOrder } from '../../../order/Enum/status-order';
import { goDriveKeyboard } from './go-drive.keyboard';
import { finishKeyboard } from './finish.keyboard';
import { driverProfileKeyboard } from './profile.keyboard';
import { inDriveKeyboard } from './in-drive.keyboard';

export async function selectDriverKeyboard(
	{ chatId, status }: Pick<Driver, 'chatId' | 'status'>,
	orderService: OrderService,
) {
	let order = await orderService.findActiveOrderByDriverId(chatId);

	if (!order) {
		order = await orderService.findSecondActiveOrderByDriverId(chatId);
	}

	if (order) {
		switch (order.status) {
			case StatusOrder.Wait:
				return inDriveKeyboard();
			case StatusOrder.InPlace:
				return goDriveKeyboard();
			case StatusOrder.InProcess:
				return finishKeyboard(status);
			default:
				return driverProfileKeyboard(status);
		}
	}

	return driverProfileKeyboard(status);
}
