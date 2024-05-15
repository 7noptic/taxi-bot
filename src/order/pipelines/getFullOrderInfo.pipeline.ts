import { Types } from 'mongoose';

export function getFullOrderInfoPipeline(orderId: string) {
	return [
		{
			$match: {
				_id: new Types.ObjectId(orderId),
			},
		},
		{
			$lookup: {
				from: 'reviews',
				localField: 'numberOrder',
				foreignField: 'orderId',
				as: 'reviews',
			},
		},

		{
			$lookup: {
				from: 'appeals',
				localField: 'numberOrder',
				foreignField: 'numberOrder',
				as: 'appeals',
			},
		},
	];
}
