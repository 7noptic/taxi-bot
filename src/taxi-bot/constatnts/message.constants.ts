import { Passenger } from '../../passenger/passenger.model';

export const WhatName = 'Как вас зовут?';
export const WhatNumber = 'Введите ваш номер телефона';
export const WhatCity = 'Выберите адрес';
export const greeting = (name: string) =>
	`Привет ${name}, вы успешно зарегистрировались и теперь можете пользоваться нашим сервисом 🌟`;

export const errorRegistration =
	'Что-то пошло не так, Проверьте введенные вами данные и повторите регистрацию заново';

export const startAddAddress = 'Чтобы добавить адрес, ответьте на пару вопросов';
export const startDeleteAddress = 'Для удаления адреса, введите его название';
export const WhatNameAddress =
	'Введите название адреса, например: Дом, Работа, Родители. \nНазвание адреса должно быть уникальным';
export const WhatAddress = 'Введите адрес, например: ул. Московская 207, дом 6, 1 подъезд';

export const errorAddAddress =
	'Что-то пошло не так... Проверьте введенные вами данные и повторите добавление адреса снова';

export const errorDeleteAddress =
	'Что-то пошло не так... Проверьте верно ли вы ввели название вашего адреса и повторите попытку';

export const NoAddresses =
	'У вас пока нет добавленных адресов, но вы можете добавить адрес нажав на кнопку ниже';
export const getEndingWord = (number: number, words: string[]) => {
	const cases = [2, 0, 1, 1, 1, 2];
	return words[
		number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
	];
};
export const YourAddresses = (addresses: Passenger['address']) =>
	`У вас добавлено ${addresses.length} ${getEndingWord(addresses.length, ['адрес', 'адреса', 'адресов'])}.\n\n${addresses.map((address) => address.name + ' - ' + address.address).join('\n')}`;

export const goBack = 'Возвращаемся назад';

export const successAddAddress = 'Адрес успешно добавлен';
export const successDeleteAddress = 'Адрес успешно удален';
