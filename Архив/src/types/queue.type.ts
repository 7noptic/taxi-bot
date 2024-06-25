export enum QueueType {
	Order = 'order',
	Payment = 'payment',
	Blocked = 'blocked',
	Newsletter = 'newsletter',
}

export enum QueueTaskType {
	SendOrderToDrivers = 'send-order-to-drivers',
	SendPaymentToDrivers = 'send-payment-to-drivers',
	SendBlockedToDrivers = 'send-blocked-to-drivers',
	SendNews = 'send-news',
}
