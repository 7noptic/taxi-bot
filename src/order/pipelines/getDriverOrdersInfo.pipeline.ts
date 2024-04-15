import { TypeOrder } from '../Enum/type-order';
import { StatusOrder } from '../Enum/status-order';
import { startOfDay, startOfWeek } from 'date-fns';

export function getDriverOrdersInfoPipeline(chatId: number) {
	const today = new Date();
	const startOfToday = startOfDay(today);
	const startOfCurrentWeek = startOfWeek(today);
	return [
		{ $match: { driverId: chatId } },
		{
			$group: {
				_id: null,
				earnedToday: {
					$sum: {
						$cond: { if: { $gte: ['$createdAt', startOfToday] }, then: '$price', else: 0 },
					},
				},
				earnedCurrentWeek: {
					$sum: {
						$cond: {
							if: { $gte: ['$createdAt', startOfCurrentWeek] },
							then: '$price',
							else: 0,
						},
					},
				},
				countToday: {
					$sum: { $cond: { if: { $gte: ['$createdAt', startOfToday] }, then: 1, else: 0 } },
				},
				driveCountToday: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $gte: ['$createdAt', startOfToday] },
									{ $eq: ['$type', TypeOrder.DRIVE] },
									{
										$not: {
											$or: [
												{ $eq: ['$status', StatusOrder.CancelDriver] },
												{ $eq: ['$status', StatusOrder.CancelPassenger] },
											],
										},
									},
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				deliveryCountToday: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $gte: ['$createdAt', startOfToday] },
									{ $eq: ['$type', TypeOrder.DELIVERY] },
									{
										$not: {
											$or: [
												{ $eq: ['$status', StatusOrder.CancelDriver] },
												{ $eq: ['$status', StatusOrder.CancelPassenger] },
											],
										},
									},
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				canceledCountToday: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $gte: ['$createdAt', startOfToday] },
									{
										$or: [
											{ $eq: ['$status', StatusOrder.CancelDriver] },
											{ $eq: ['$status', StatusOrder.CancelPassenger] },
										],
									},
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				countCurrentWeek: {
					$sum: { $cond: { if: { $gte: ['$createdAt', startOfCurrentWeek] }, then: 1, else: 0 } },
				},
				driveCountCurrentWeek: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $gte: ['$createdAt', startOfCurrentWeek] },
									{ $eq: ['$type', TypeOrder.DRIVE] },
									{
										$not: {
											$or: [
												{ $eq: ['$status', StatusOrder.CancelDriver] },
												{ $eq: ['$status', StatusOrder.CancelPassenger] },
											],
										},
									},
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				deliveryCountCurrentWeek: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $gte: ['$createdAt', startOfCurrentWeek] },
									{ $eq: ['$type', TypeOrder.DELIVERY] },
									{
										$not: {
											$or: [
												{ $eq: ['$status', StatusOrder.CancelDriver] },
												{ $eq: ['$status', StatusOrder.CancelPassenger] },
											],
										},
									},
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				canceledCountCurrentWeek: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $gte: ['$createdAt', startOfCurrentWeek] },
									{
										$or: [
											{ $eq: ['$status', StatusOrder.CancelDriver] },
											{ $eq: ['$status', StatusOrder.CancelPassenger] },
										],
									},
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				countAll: { $sum: 1 },
				driveCountAll: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $eq: ['$type', TypeOrder.DRIVE] },
									{
										$not: {
											$or: [
												{ $eq: ['$status', StatusOrder.CancelDriver] },
												{ $eq: ['$status', StatusOrder.CancelPassenger] },
											],
										},
									},
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				deliveryCountAll: {
					$sum: {
						$cond: {
							if: {
								$and: [
									{ $eq: ['$type', TypeOrder.DELIVERY] },
									{
										$not: {
											$or: [
												{ $eq: ['$status', StatusOrder.CancelDriver] },
												{ $eq: ['$status', StatusOrder.CancelPassenger] },
											],
										},
									},
								],
							},
							then: 1,
							else: 0,
						},
					},
				},
				canceledCountAll: {
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
	];
}
