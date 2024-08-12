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
				price: {
					$gt: 0,
				},
			},
		},
		{
			$lookup: {
				from: 'reviews',
				localField: 'driverId',
				foreignField: 'to',
				as: 'reviews',
			},
		},
		{
			$addFields: {
				reviews: {
					$function: {
						body: `function (reviews = [], start, end) {
							// Filter reviews based on createdAt
							reviews = reviews.filter(review => {
								return review.createdAt >= new Date(start) && review.createdAt <= new Date(end);
							});

							// Sort the filtered reviews
							reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
							return reviews;
						}`,
						args: ['$reviews', start, end], // Pass start and end as arguments
						lang: 'js',
					},
				},
				sumCommission: { $sum: '$commission' },
				price: { $sum: '$price' },
				count: { $sum: 1 },
			},
		},
		// {
		//  $group: {
		//   _id: null,
		//   sumCommission: { $sum: '$commission' },
		//   price: { $sum: '$price' },
		//   count: { $sum: 1 },
		//  },
		// },
	];
}
