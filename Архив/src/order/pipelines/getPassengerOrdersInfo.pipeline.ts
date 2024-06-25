import { TypeOrder } from '../Enum/type-order';
import { StatusOrder } from '../Enum/status-order';

export function getPassengerOrdersInfoPipeline(chatId: number) {
	return [
		{ $match: { passengerId: chatId } },
		{
			$group: {
				_id: null,
				totalCount: { $sum: 1 },
				driveCount: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $eq: ['$type', TypeOrder.DRIVE] },
									{ $ne: ['$status', StatusOrder.CancelDriver] },
									{ $ne: ['$status', StatusOrder.CancelPassenger] },
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				deliveryCount: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $eq: ['$type', TypeOrder.DELIVERY] },
									{ $ne: ['$status', StatusOrder.CancelDriver] },
									{ $ne: ['$status', StatusOrder.CancelPassenger] },
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				canceledCount: {
					$sum: {
						$cond: {
							if: {
								$or: [
									{ $eq: ['$status', StatusOrder.CancelDriver] },
									{ $eq: ['$status', StatusOrder.CancelPassenger] },
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				totalCount: 1,
				driveCount: 1,
				deliveryCount: 1,
				canceledCount: 1,
			},
		},
	];
}
