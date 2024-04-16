export interface AcceptanceOrderByDriverContext {
	wizard: {
		state: {
			time: number;
			price: number;
			minPrice: number;
			orderId: string;
			passengerId: number;
		};
	};
}
