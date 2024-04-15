export function getCommissionForWeekPipeline(chatId: number, start: Date, end: Date) {
	return [
		{
			$match: {
				driverId: chatId,
				createdAt: {
					$gte: start,
					$lte: end,
				},
				commission: {
					$gt: 0,
				},
			},
		},
		{
			$group: {
				_id: null,
				sumCommission: { $sum: '$commission' },
				count: { $sum: 1 },
			},
		},
	];
}
