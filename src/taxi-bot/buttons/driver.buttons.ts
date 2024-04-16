import { StatusDriver } from '../types/status-driver.type';

export const DriverButtons = {
	profile: {
		status: {
			[StatusDriver.Online]: '🟢 Online',
			[StatusDriver.Offline]: '🔴 Offline',
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
		time: {
			'3': {
				label: '3️⃣',
				callback: '3',
			},
			'5': {
				label: '5️⃣',
				callback: '5',
			},
			'7': {
				label: '7️⃣',
				callback: '7',
			},
			'10': {
				label: '🔟',
				callback: '10',
			},
			'15': {
				label: '1️⃣5️⃣',
				callback: '15',
			},
			'20': {
				label: '2️⃣0️⃣',
				callback: '20',
			},
		},
	},
};
