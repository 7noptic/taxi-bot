import { StatusOrder } from '../Enum/status-order';
import { TypeOrder } from '../Enum/type-order';

export function getAllStatisticPipeline() {
	return {
		$group: {
			_id: null,
			[`totalOrders`]: { $sum: 1 },
			[`totalCancelOrders`]: {
				$sum: {
					$cond: [
						{
							$or: [
								{ $eq: ['$status', StatusOrder.CancelDriver] },
								{ $eq: ['$status', StatusOrder.CancelPassenger] },
							],
						},
						1,
						0,
					],
				},
			},
			[`totalSuccessOrders`]: {
				$sum: {
					$cond: [{ $eq: ['$status', StatusOrder.Success] }, 1, 0],
				},
			},
			[`totalDriverOrders`]: {
				$sum: {
					$cond: [
						{
							$and: [
								{ $eq: ['$status', StatusOrder.Success] },
								{ $eq: ['$type', TypeOrder.DRIVE] },
							],
						},
						1,
						0,
					],
				},
			},
			[`totalDeliveryOrders`]: {
				$sum: {
					$cond: [
						{
							$and: [
								{ $eq: ['$status', StatusOrder.Success] },
								{ $eq: ['$type', TypeOrder.DELIVERY] },
							],
						},
						1,
						0,
					],
				},
			},
			[`totalPrice`]: { $sum: '$price' },
			[`totalCommission`]: { $sum: '$commission' },
		},
	};
}
