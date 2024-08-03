export enum StatusOrder {
	DriverInBusy = 'driverInBusy', // Водитель выполняет другой заказ
	Created = 'created', // Создан, но не найден водитель
	Wait = 'wait', // Найден водитель и водитель в пути к пассажиру
	InPlace = 'inPlace', // Водитель на месте ожидает пассажира
	InProcess = 'inProcess', // Водитель везет пассажира
	Success = 'success', // Поездка успешно завершена
	CancelDriver = 'cancelDriver', // Поездка отменена водителем
	CancelPassenger = 'cancelPassenger', // Поездка отменена пассажиром
}
