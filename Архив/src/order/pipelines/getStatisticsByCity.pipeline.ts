import { StatusOrder } from '../Enum/status-order';
import { TypeOrder } from '../Enum/type-order';

export function getStatisticsByCityPipeline() {
	return [
		{
			$match: {
				city: { $ne: null },
			},
		},
		{
			$group: {
				_id: '$city',
				totalOrders: { $sum: 1 },
				totalCancelOrders: {
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
				totalSuccess: { $sum: { $cond: [{ $eq: ['$status', StatusOrder.Success] }, 1, 0] } },
				totalDriver: {
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
				totalDelivery: {
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
				totalPrice: { $sum: '$price' },
				totalCommission: { $sum: '$commission' },
			},
		},
		{
			$project: {
				_id: 0,
				name: '$_id',
				totalOrders: 1,
				totalCancelOrders: 1,
				totalSuccess: 1,
				totalDriver: 1,
				totalDelivery: 1,
				totalPrice: 1,
				totalCommission: 1,
			},
		},
	];
}
