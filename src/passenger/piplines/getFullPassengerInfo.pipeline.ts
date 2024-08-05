import { TypeOrder } from '../../order/Enum/type-order';
import { StatusOrder } from '../../order/Enum/status-order';

export function getFullPassengerInfoPipeline(chatId: number) {
	return [
		{
			$match: {
				chatId,
			},
		},
		{
			$lookup: {
				from: 'reviews',
				localField: 'chatId',
				foreignField: 'from',
				as: 'reviewFrom',
			},
		},
		{
			$lookup: {
				from: 'reviews',
				localField: 'chatId',
				foreignField: 'to',
				as: 'reviewTo',
			},
		},
		{
			$lookup: {
				from: 'notes',
				localField: 'chatId',
				foreignField: 'chatId',
				as: 'notes',
			},
		},
		{
			$lookup: {
				from: 'orders',
				localField: 'chatId',
				foreignField: 'passengerId',
				as: 'orders',
			},
		},
		{
			$addFields: {
				reviewFrom: {
					$function: {
						body: `function (reviews = []) {
								reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
								return reviews;
							}`,
						args: ['$reviewFrom'],
						lang: 'js',
					},
				},
				reviewTo: {
					$function: {
						body: `function (reviews = []) {
								reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
								return reviews;
							}`,
						args: ['$reviewTo'],
						lang: 'js',
					},
				},
				notes: {
					$function: {
						body: `function (notes = []) {
								notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
								return notes;
							}`,
						args: ['$notes'],
						lang: 'js',
					},
				},
				orders: {
					$function: {
						body: `function (orders = []) {
								orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
								return orders;
							}`,
						args: ['$orders'],
						lang: 'js',
					},
				},
				leftReview: {
					$size: '$reviewFrom',
				},
				countOrders: {
					$size: '$orders',
				},
				driveCount: {
					$size: {
						$filter: {
							input: '$orders',
							as: 'order',
							cond: {
								$and: [
									{ $eq: ['$$order.type', TypeOrder.DRIVE] },
									{ $ne: ['$$order.status', StatusOrder.CancelDriver] },
									{ $ne: ['$$order.status', StatusOrder.CancelPassenger] },
								],
							},
						},
					},
				},
				deliveryCount: {
					$size: {
						$filter: {
							input: '$orders',
							as: 'order',
							cond: {
								$and: [
									{ $eq: ['$$order.type', TypeOrder.DELIVERY] },
									{ $ne: ['$$order.status', StatusOrder.CancelDriver] },
									{ $ne: ['$$order.status', StatusOrder.CancelPassenger] },
								],
							},
						},
					},
				},
				canceledCount: {
					$size: {
						$filter: {
							input: '$orders',
							as: 'order',
							cond: {
								$or: [
									{ $eq: ['$$order.status', StatusOrder.CancelDriver] },
									{ $eq: ['$$order.status', StatusOrder.CancelPassenger] },
								],
							},
						},
					},
				},
				averageRating: { $avg: '$rating' },
				receivedReview: {
					$size: '$reviewTo',
				},
			},
		},
	];
}
