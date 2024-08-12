import { StatusDriver } from '../types/status-driver.type';

export const DriverButtons = {
	profile: {
		status: {
			[StatusDriver.Online]: '🟢 На линии',
			[StatusDriver.Offline]: '⚪ Занят',
		},
		statistics: '📊 Статистика',
		commission: '💳 Комиссия',
	},
	settings: {
		settings: {
			label: '⚙️ Настройки',
			callback: 'settings-driver',
		},
		name: {
			callback: 'edit-driver-name',
		},
		phone: {
			callback: 'edit-driver-phone',
		},
		city: {
			callback: 'edit-driver-city',
		},
		car: {
			callback: 'edit-driver-car',
		},
		accessTypeOrder: {
			callback: 'edit-driver-access-type-order',
		},
	},
	order: {
		bargain: {
			label: '💵 Торг',
			callback: 'order-bargain-',
		},
		access: {
			label: '✅ Принять',
			callback: 'order-access-',
		},
		inDrive: {
			place: {
				label: '🅿️ На месте',
			},
			go: {
				label: '🚕 Поехали',
			},
			finish: {
				label: '🏁 Завершить заказ',
			},
			cancel: {
				label: 'Отменить заказ (-3⚡️)',
			},
			cancelSuccess: {
				label: 'Я подтверждаю отмену заказа (-3⚡️)',
			},
			cancelFail: {
				label: 'Не отменять заказ',
			},
		},
		time: {
			'3': {
				label: '3 мин',
				callback: '3',
			},
			'5': {
				label: '5 мин',
				callback: '5',
			},
			'7': {
				label: '7 мин',
				callback: '7',
			},
			'10': {
				label: '10 мин',
				callback: '10',
			},
			'15': {
				label: '15 мин',
				callback: '15',
			},
			'20': {
				label: '20 мин',
				callback: '20',
			},
		},
	},
	payment: {
		pay: {
			label: '💵 Оплатить',
			callback: 'call-payment-',
		},
		iPaid: {
			label: '✅ Оплатил',
			callback: 'i_paid_',
		},
	},
};
