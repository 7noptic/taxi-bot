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
};
