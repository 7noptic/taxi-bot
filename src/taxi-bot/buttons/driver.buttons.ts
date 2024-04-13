import { StatusDriver } from '../types/status-driver.type';

export const DriverButtons = {
	profile: {
		status: {
			[StatusDriver.Online]: '🟢 Online',
			[StatusDriver.Offline]: '🔴 Offline',
		},
		statistics: '📊 Статистика',
		commission: '💳 Комиссия',
		help: 'ℹ️ Помощь',
		profile: '👨‍⚕️ Профиль',
	},
};
