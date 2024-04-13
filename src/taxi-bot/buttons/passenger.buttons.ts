import { ConstantsService } from '../../constants/constants.service';
import { TypeOrder } from '../../order/Enum/type-order';

export const PassengerButtons = {
	profile: {
		callCar: '🚕 Вызов автомобиля 🚚',
		addresses: '🏠 Адреса',
		profile: '👨‍⚕️ Профиль',
		help: 'ℹ️ Помощь',
		settings: '⚙️ Настройки',
	},
	address: {
		add: '✅ Добавить адрес',
		delete: '❌ Удалить адрес',
		back: '↩️ Назад',
	},
	help: {
		faq: {
			label: '❓ Вопрос-ответ',
			callback: 'faq',
		},
		price: {
			label: '💵 Стоимость',
			callback: 'price',
		},
		about: {
			label: 'ℹ️ О сервисе',
			callback: 'about',
		},
		support: {
			label: '🔔 Обратиться в поддержку',
			callback: 'support',
		},
	},
	settings: {
		name: {
			callback: 'edit-name',
		},
		phone: {
			callback: 'edit-phone',
		},
		city: {
			callback: 'edit-city',
		},
	},
	order: {
		type: {
			delivery: {
				label: 'Доставка 🚚',
				callback: `${ConstantsService.callbackButtonTypeOrder}${TypeOrder.DELIVERY}`,
			},
			drive: {
				label: '🚕 Поездка',
				callback: `${ConstantsService.callbackButtonTypeOrder}${TypeOrder.DRIVE}`,
			},
		},
		comment: {
			skip: {
				label: 'Пропустить',
				callback: 'skip-comment',
			},
		},
		final: {
			edit: {
				label: '✏️ Исправить',
				callback: 'edit-order',
			},
			success: {
				label: '✅ Всё верно!',
				callback: 'success-order',
			},
		},
	},
};
