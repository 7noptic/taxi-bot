export interface ResultStatisticAllDto {
	all: {
		totalOrders: number;
		totalCancelOrders: number;
		totalSuccess: number;
		totalDriverOrders: number;
		totalDeliveryOrders: number;
		totalPrice: number;
		totalCommission: number;
	};
	today: {
		totalOrders: number;
		totalCancelOrders: number;
		totalSuccess: number;
		totalDriverOrders: number;
		totalDeliveryOrders: number;
		totalPrice: number;
		totalCommission: number;
	};
	week: {
		totalOrders: number;
		totalCancelOrders: number;
		totalSuccess: number;
		totalDriverOrders: number;
		totalDeliveryOrders: number;
		totalPrice: number;
		totalCommission: number;
	};
	month: {
		totalOrders: number;
		totalCancelOrders: number;
		totalSuccess: number;
		totalDriverOrders: number;
		totalDeliveryOrders: number;
		totalPrice: number;
		totalCommission: number;
	};
}
