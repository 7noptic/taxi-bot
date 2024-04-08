import { Passenger } from '../passenger/passenger.model';
import { getEndingWord } from '../taxi-bot/constatnts/message.constants';

export const defaultRating = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
export const defaultCityPrice = 100;
export const admin = 'admin';

export const STRING_LENGTH_ERROR = (string: string = 'строки'): string =>
	`Длинна ${string} должна быть в диапазоне от $constraint1 до $constraint2 символов`;

export const NOT_FOUND_ERROR = (string: string = 'Объект'): string => `Такой ${string} не найден`;

export const NOT_EMAIL = 'Укажите валидный email';

export const NOT_SUPPORTED_CITY_ERROR = 'Данный город не поддерживается в текущий момент.';

export enum BotName {
	Taxi = 'taxi',
	Help = 'help',
}

export const priceTextDefault =
	'<b>💵 Стоимость услуг</b>\n' +
	'Стоимость поездок обговаривается между водителем и пассажиром во время составления заказа.\n\n' +
	'ℹ️ Оплата производится\n' +
	'наличными, или переводом на карту водителя.';

export const faqTextDefault = '<b>Вопрос</b>\n' + 'Ответ\n\n';
export const aboutTextDefault = '<b>О нас</b>\n' + 'тыры пыры';

export const supportTextDefault =
	'Для обращения в поддержку напишите этому боту @HelpForTestimTaxi_bot';
export const getCountRating = (count: number) =>
	count - defaultRating.length <= 0 ? 0 : count - defaultRating.length;

export const getProfileInfoPassenger = (passenger: Passenger) =>
	`<b>Профиль</b>\n\n` +
	`Имя: ${passenger.first_name}\n` +
	`Рейтинг: ⭐️${(passenger.rating.reduce((curr, acc) => acc + curr, 0) / passenger.rating.length).toFixed(2)}` +
	` (${getCountRating(passenger.rating.length)} ${getEndingWord(getCountRating(passenger.rating.length), ['оценка', 'оценки', 'оценок'])})\n` +
	`Телефон: ${passenger.phone}\n` +
	`Населенный пункт: ${passenger.city}\n` +
	`\n\n` +
	`<b>🔄 История заказов</b>` +
	`\n\n` +
	`Всего заказов: <b>0</b>\n` +
	`Поездки: <b>0</b>\n` +
	`Доставки: <b>0</b>\n` +
	`Отменено: <b>0</b>\n`;
