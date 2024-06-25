import { Injectable } from '@nestjs/common';
import { Passenger } from '../passenger/passenger.model';
import { HelpBotButtons } from '../help-bot/buttons/help-bot.buttons';
import { Driver } from '../driver/driver.model';
import { OrdersInfoDto } from '../order/dto/orders-info.dto';
import { AccessTypeOrder } from '../driver/Enum/access-type-order';
import { UserType } from '../types/user.type';

@Injectable()
export class ConstantsService {
	static readonly taxiBotName = '@podvezy43_bot';
	static readonly helpBotName = '@podvezy_help43_bot';
	static readonly KirillName = '@podvezybothelp';
	static readonly defaultRating = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
	static readonly defaultPriority = 10;
	static readonly defaultCityPrice = 100;
	static readonly admin = 'admin';
	static readonly passenger = 'passenger';
	static readonly NOT_EMAIL = 'Укажите валидный email';
	static readonly NOT_SUPPORTED_CITY_ERROR = 'Данный город не поддерживается в текущий момент.';
	static readonly priceTextDefault =
		'<b>💵 Стоимость услуг</b>\n' +
		'Стоимость поездок обговаривается между водителем и пассажиром во время составления заказа.\n\n' +
		'ℹ️ Оплата производится\n' +
		'наличными, или переводом на карту водителя.';
	static readonly faqTextDefault = '<b>Вопрос</b>\n' + 'Ответ\n\n';
	static readonly aboutTextDefault =
		'<b>ℹ️ 0 сервисе</b>' +
		'\n\n' +
		'<b>Подвези бот</b> - это информационный ' +
		'сервис, с помощью которого ' +
		'водители находят пассажиров, а ' +
		'пассажиры - водителей в формате ' +
		'чат-бота Telegram.\n\n' +
		'Пользуясь сервисом, Вы ' +
		'даёте согласие на обработку ' +
		'персональных данных и ' +
		'акцептируете Пользовательское ' +
		'соглашение.';
	static readonly supportTextDefault = `Для обращения в поддержку напишите этому боту ${ConstantsService.helpBotName}`;
	static readonly images = {
		profile: 'https://i.postimg.cc/hjbsx0kb/Picsart-24-06-04-00-13-00-690-1.jpg',
		help: 'https://i.postimg.cc/FHQpH8dC/Picsart-24-06-04-00-11-05-807-1.jpg',
		settings: 'https://i.postimg.cc/MGgNtt3C/Picsart-24-06-04-00-12-08-222-2.jpg',
		addresses: 'https://i.postimg.cc/1zTh2yXY/Picsart-24-06-04-00-12-38-999-1.jpg',
		commission: 'https://i.postimg.cc/050XJ8xR/Picsart-24-06-04-00-13-36-577-1.jpg',
		statistic: 'https://i.postimg.cc/SKxWXhyd/Picsart-24-06-04-00-10-40-662-1.jpg',
		inDrive: 'https://i.postimg.cc/bvp2nRLT/IMG-20240603-121843-1.jpg',
	};
	static readonly GreetingDriverMessage =
		'Супер, давай познакомимся немного поближе что-бы ты смог пользоваться нашим удобным сервисом.';
	static readonly GreetingPassengerMessage =
		'Супер, давай познакомимся немного поближе что-бы ты смог пользоваться нашим удобным сервисом.';
	static readonly greetingMessage = 'Добро пожаловать!';
	static readonly HelpBotMessage = {
		NotRegistration: `Вы не зарегистрированы в нашем сервисе по заказу такси, чтобы воспользоваться поддержкой сначала зарегистрируйтесь в ${ConstantsService.taxiBotName}`,
		GreetingWithOpenAppeal: `Добро пожаловать в бот поддержки, для того чтобы открыть обращение нажмите на кнопку\n\n${HelpBotButtons.open.label}`,
		GreetingWithCloseAppeal:
			`Добро пожаловать в бот поддержки, в данный момент у вас есть незакрытое обращение.` +
			`\nЧтобы продолжить общение по вопросу, просто отправьте любое сообщение.` +
			`\nДля того чтобы открыть обращение нажмите на кнопку\n\n${HelpBotButtons.close.label}`,
		SuccessClosedAppeal: '✅ Обращение успешно закрыто',
		ErrorClosedAppeal:
			'❌ Что-то пошло не так.\nПопробуйте перезапустить бота выполнив команду /start',
		WhatNumberOrder:
			'Введите номер заказа\nНапример: <b>Заказ-lDDxFJ</b>\n\nИли отправьте "-", если вопрос не по заказу',
		WhatMessage: 'Введите сообщение, оператор постарается вам ответить как можно скорее',
		OpenAppeal: 'Для создания обращения ответьте на пару вопросов',
		SuccessOpenAppeal:
			'✅ Обращение успешно открыто, ожидание первого освободившегося оператора...',
		ErrorOpenAppeal: '❌ Что-то пошло не так.\nПопробуйте еще раз',
		NotOpenedAppeal: 'У вас нет открытых обращений.',
		SuccessSendMessage: '✅ Сообщение успешно отправлено',
	};
	static readonly callbackButtonTypeOrder = 'select-type';
	static readonly repeatInputText = '\n\nПовторите ввод';
	static readonly accessOrderTypeToRus = {
		[AccessTypeOrder.ALL]: 'Все заказы',
		[AccessTypeOrder.DRIVE]: 'Поездки',
		[AccessTypeOrder.DELIVERY]: 'Доставка',
	};
	static readonly defaultMaxAddresses = 10;

	static readonly WelcomeMessage =
		'<b>Приветствуем!</b> На клавиатуре выберите в роли кого вы хотите использовать этого бота?.\n\n';

	static readonly RegistrationMessage = (typeUser: UserType) =>
		`<b>Приветствуем!</b> Чтобы перейти к регистрации в качестве ${typeUser === UserType.Driver ? 'водителя' : 'пользователя'}, ` +
		`необходимо ознакомиться и согласиться с условиями Политики Конфиденциальности и Оферты.`;

	static readonly getEndingWord = (number: number, words: string[]) => {
		const cases = [2, 0, 1, 1, 1, 2];
		return words[
			number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
		];
	};

	static readonly STRING_LENGTH_ERROR = (
		string: string = 'строки',
		min: string | number = '$constraint1',
		max: string | number = '$constraint2',
	): string => `Длинна ${string} должна быть в диапазоне от ${min} до ${max} символов`;

	static readonly NOT_FOUND_ERROR = (string: string = 'Объект'): string =>
		`Такой ${string} не найден`;

	static readonly getCountRating = (count: number) =>
		count - ConstantsService.defaultRating.length <= 0
			? 0
			: count - ConstantsService.defaultRating.length;

	static getUserRating(rating: number[]) {
		return (rating?.reduce((curr, acc) => acc + curr, 0) / rating.length).toFixed(2);
	}

	static readonly getProfileInfoDefault = (user: Passenger | Driver) =>
		`<b>👤 Профиль</b>\n\n` +
		`Имя: ${user.first_name}\n` +
		`Рейтинг: ⭐️${ConstantsService.getUserRating(user.rating)}` +
		` (${ConstantsService.getCountRating(user.rating.length)} ${ConstantsService.getEndingWord(ConstantsService.getCountRating(user.rating.length), ['оценка', 'оценки', 'оценок'])})\n` +
		`Телефон: ${user.phone}\n` +
		`Населенный пункт: ${user.city}\n`;

	static readonly getProfileInfoPassenger = (passenger: Passenger, orders: OrdersInfoDto) =>
		ConstantsService.getProfileInfoDefault(passenger) +
		`\n\n` +
		`<b>🔄 История заказов</b>` +
		`\n\n` +
		`Всего заказов: <b>${orders.totalCount}</b>\n` +
		`Поездки: <b>${orders.driveCount}</b>\n` +
		`Доставки: <b>${orders.deliveryCount}</b>\n` +
		`Отменено: <b>${orders.canceledCount}</b>\n`;

	static readonly getProfileInfoDriver = (driver: Driver) =>
		ConstantsService.getProfileInfoDefault(driver) +
		`Приоритет: ${driver.priority}/${ConstantsService.defaultPriority}⚡️` +
		`\n\n` +
		`ℹ️ Чем выше приоритет, тем быстрее Вы получаете новые заказы` +
		`\n\n` +
		`Авто: <b>${driver.car.carBrand}</b>\n` +
		`Цвет: <b>${driver.car.carColor}</b>\n` +
		`Гос.номер: <b>${driver.car.carNumber}</b>` +
		`\n\n` +
		`Заказы: <b>${ConstantsService.accessOrderTypeToRus[driver.accessOrderType]}</b>` +
		`\n\n` +
		`ℹ️ Тип принимаемых заказов можно изменить в настройках`;

	static readonly roundToNearest50 = (num: number): number => {
		return Math.ceil(num / 50) * 50;
	};
}
