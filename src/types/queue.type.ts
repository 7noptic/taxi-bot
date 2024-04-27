export enum QueueType {
	Order = 'order',
	Payment = 'payment',
	Blocked = 'blocked',
}

export enum QueueTaskType {
	SendOrderToDrivers = 'send-order-to-drivers',
	SendPaymentToDrivers = 'send-payment-to-drivers',
	SendBlockedToDrivers = 'send-blocked-to-drivers',
}
