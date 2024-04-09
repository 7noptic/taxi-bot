import { Injectable } from '@nestjs/common';
import { Passenger } from '../passenger/passenger.model';

@Injectable()
export class ConstantsService {
	static readonly defaultRating = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
	static readonly defaultCityPrice = 100;
	static readonly admin = 'admin';
	static readonly NOT_EMAIL = 'Укажите валидный email';
	static readonly NOT_SUPPORTED_CITY_ERROR = 'Данный город не поддерживается в текущий момент.';
	static readonly priceTextDefault =
		'<b>💵 Стоимость услуг</b>\n' +
		'Стоимость поездок обговаривается между водителем и пассажиром во время составления заказа.\n\n' +
		'ℹ️ Оплата производится\n' +
		'наличными, или переводом на карту водителя.';
	static readonly faqTextDefault = '<b>Вопрос</b>\n' + 'Ответ\n\n';
	static readonly aboutTextDefault = '<b>О нас</b>\n' + 'тыры пыры';
	static readonly supportTextDefault =
		'Для обращения в поддержку напишите этому боту @HelpForTestimTaxi_bot';
	static readonly images = {
		profile: 'https://i.postimg.cc/gJT76zSQ/profile.jpg',
		help: 'https://i.postimg.cc/c4HCQ0xh/pict.jpg',
		settings: 'https://i.postimg.cc/26r83f94/pict.jpg',
	};
	static readonly WelcomeMessage =
		'Добро пожаловать в наш бот такси, чтобы начать пользоваться ботом вам необходимо пройти не большую регистрацию.';
	static readonly GreetingDriverMessage =
		'Давно тебя не было в уличных гонках, чтобы продолжить тебе необходимо ответить на пару вопросов.';
	static readonly GreetingPassengerMessage =
		'Супер, давай познакомимся немного поближе что-бы ты смог пользоваться нашим удобным сервисом';
	static readonly greetingMessage = 'Добро пожаловать!';

	static readonly getEndingWord = (number: number, words: string[]) => {
		const cases = [2, 0, 1, 1, 1, 2];
		return words[
			number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
		];
	};

	static readonly STRING_LENGTH_ERROR = (string: string = 'строки'): string =>
		`Длинна ${string} должна быть в диапазоне от $constraint1 до $constraint2 символов`;

	static readonly NOT_FOUND_ERROR = (string: string = 'Объект'): string =>
		`Такой ${string} не найден`;

	static readonly getCountRating = (count: number) =>
		count - ConstantsService.defaultRating.length <= 0
			? 0
			: count - ConstantsService.defaultRating.length;

	static readonly getProfileInfoPassenger = (passenger: Passenger) =>
		`<b>Профиль</b>\n\n` +
		`Имя: ${passenger.first_name}\n` +
		`Рейтинг: ⭐️${(passenger.rating.reduce((curr, acc) => acc + curr, 0) / passenger.rating.length).toFixed(2)}` +
		` (${ConstantsService.getCountRating(passenger.rating.length)} ${ConstantsService.getEndingWord(ConstantsService.getCountRating(passenger.rating.length), ['оценка', 'оценки', 'оценок'])})\n` +
		`Телефон: ${passenger.phone}\n` +
		`Населенный пункт: ${passenger.city}\n` +
		`\n\n` +
		`<b>🔄 История заказов</b>` +
		`\n\n` +
		`Всего заказов: <b>0</b>\n` +
		`Поездки: <b>0</b>\n` +
		`Доставки: <b>0</b>\n` +
		`Отменено: <b>0</b>\n`;
}
