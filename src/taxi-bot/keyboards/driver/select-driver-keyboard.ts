import { Driver } from '../../../driver/driver.model';
import { OrderService } from '../../../order/order.service';
import { StatusOrder } from '../../../order/Enum/status-order';
import { goDriveKeyboard } from './go-drive.keyboard';
import { finishKeyboard } from './finish.keyboard';
import { driverProfileKeyboard } from './profile.keyboard';

export async function selectDriverKeyboard(
	{ chatId, status }: Pick<Driver, 'chatId' | 'status'>,
	orderService: OrderService,
) {
	const order = await orderService.findActiveOrderByDriverId(chatId);
	if (order) {
		switch (order.status) {
			case StatusOrder.Wait:
				return goDriveKeyboard();
			case StatusOrder.InProcess:
				return finishKeyboard();
			default:
				return driverProfileKeyboard(status);
		}
	}

	return driverProfileKeyboard(status);
}
