export enum StatusOrder {
	Created = 'created', // Создан, но не найден водитель
	Wait = 'wait', // Найден водитель и водитель в пути к пассажиру
	InProcess = 'inProcess', // Водитель везет пассажира
	Success = 'success', // Поездка успешно завершена
	CancelDriver = 'cancelDriver', // Поездка отменена водителем
	CancelPassenger = 'cancelPassenger', // Поездка отменена пассажиром
}
