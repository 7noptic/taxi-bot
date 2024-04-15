import { Passenger } from '../../passenger/passenger.model';
import { ConstantsService } from '../../constants/constants.service';
import { commonButtons } from '../buttons/common.buttons';
import { PassengerButtons } from '../buttons/passenger.buttons';
import { DriverButtons } from '../buttons/driver.buttons';
import { StatusDriver } from '../types/status-driver.type';
import { DriverOrdersInfoDto } from '../../order/dto/driver-orders-info.dto';
import { BlockedType } from '../../driver/Enum/blocked-type';

export const WhatName = 'Укажите ваше имя?';
export const WhatNameRegistration = `${WhatName}\n\nℹ️ Если Вы магазин или кафе и хотите
отправлять свою продукцию с помощью`;
export const WhatNumber = 'Введите ваш номер телефона в формате +79991112233';

export const WhatNumberRegistration = `${WhatNumber}\n\nℹ️ Либо поделитесь контактом для автоматического ввода номера`;
export const errorNumber =
	'Номер телефона указан не в правильном формате.\nПожалуйста, укажите ваш номер телефона в формате +79991112233';
export const WhatCity = 'Выберите город';

export const WhatCarBrand = 'Введите марку и модель автомобиля\nНапример: Lada Granta';
export const WhatCarColor = 'Введите цвет автомобиля\nНапример: Белый';
export const WhatCarNumber = 'Введите номер автомобиля\nНапример: аб000в';
export const WhatAccessOrderType = 'Выберите тип принимаемых заказов';
export const greeting = (name: string) =>
	`Мы рады нашему с Вами знакомству,<b>${name}!</b>\nРегистрация завершена`;

export const greetingPassenger = (name: string) =>
	`${greeting(name)}\n\n` +
	`Ознакомьтесь с функционалом меню: \n\n` +
	`<b>${PassengerButtons.profile.callCar}</b> - заказ поездки или доставки\n\n` +
	`<b>${PassengerButtons.profile.addresses}</b> - адресная книжка для часто используемых адресов\n\n` +
	`<b>${PassengerButtons.profile.settings}</b>  - изменить имя, номер телефона, населённый пункт\n\n` +
	`<b>${commonButtons.profile.help}</b>  - дополнительная информация, поддержка \n\n` +
	`<b>${commonButtons.profile.profile}</b> - данные Вашего профиля, история заказов, настройки учётной записи`;

export const greetingDriver = (name: string) =>
	`${greeting(name)}\n\n` +
	`Ознакомьтесь с функционалом меню: \n\n` +
	`<b>${DriverButtons.profile.status[StatusDriver.Offline]}</b> - Установить статус для получения заказов\n\n` +
	`<b>${DriverButtons.profile.statistics}</b> - Отображения заработка и статистики по заказам\n\n` +
	`<b>${DriverButtons.profile.commission}</b>  - Оплата комиссии сервиса\n\n` +
	`<b>${commonButtons.profile.help}</b>  - дополнительная информация, поддержка \n\n` +
	`<b>${commonButtons.profile.profile}</b> - данные Вашего профиля, история заказов, настройки учётной записи`;
export const errorRegistration =
	'Что-то пошло не так, Проверьте введенные вами данные и повторите регистрацию заново';

export const startAddAddress = 'Чтобы добавить адрес, ответьте на пару вопросов';
export const startDeleteAddress = 'Для удаления адреса, введите его название';
export const startEditName = `Чтобы отменить изменение имени нажмите\n\n${commonButtons.back}`;
export const startEditPhone = `Чтобы отменить изменение номера нажмите\n\n${commonButtons.back}`;
export const startEditCity = `Чтобы отменить изменение города нажмите\n\n${commonButtons.back}`;
export const startEditCar = `Чтобы отменить изменение автомобиля нажмите\n\n${commonButtons.back}`;
export const startAccessOrderTypeCar = `Чтобы отменить изменение типа принимаемых заказов нажмите\n\n${commonButtons.back}`;
export const startCreateOrder = `Для создания заказа ответьте на пару вопросов.\n\nЧтобы отменить создание заказа нажмите\n\n${commonButtons.back}`;
export const WhatNameAddress =
	'Введите название адреса, например: Дом, Работа, Родители. \nНазвание адреса должно быть уникальным';
export const WhatAddress = 'Введите адрес, например: ул. Московская 207, дом 6, 1 подъезд';

export const errorAddAddress =
	'Что-то пошло не так... Проверьте введенные вами данные и повторите добавление адреса снова';

export const errorDeleteAddress =
	'Что-то пошло не так... Проверьте верно ли вы ввели название вашего адреса и повторите попытку';

export const NoAddresses =
	'У вас пока нет добавленных адресов, но вы можете добавить адрес нажав на кнопку ниже';

export const YourAddresses = (addresses: Passenger['address']) =>
	`У вас добавлено ${addresses.length} ${ConstantsService.getEndingWord(addresses.length, ['адрес', 'адреса', 'адресов'])}.\n\n${addresses.map((address) => address.name + ' - ' + address.address).join('\n')}`;

export const goBack = 'Возвращаемся назад';

export const successAddAddress = 'Адрес успешно добавлен';
export const successDeleteAddress = 'Адрес успешно удален';

export const settingsText =
	'⚙️ Настройки\n\nЗдесь вы можете изменить имя, номер телефона, населенный пункт';

export const settingsDriverText =
	'⚙️ Настройки\n\nЗдесь вы можете изменить имя, номер телефона, населенный пункт, тип принимаемых заказов, автомобиль';

export const successEditName = 'Имя успешно изменено';
export const successEditPhone = 'Номер успешно изменён';
export const successEditCity = 'Город успешно изменён';
export const successEditCar = 'Автомобиль успешно изменён';
export const successEditAccessOrderType = 'Тип принимаемых заказов успешно изменён';
export const errorEditInfo =
	'Что-то пошло не так... Проверьте введенные вами данные и повторите изменение данных снова';
export const errorCreateOrder =
	'Что-то пошло не так... Проверьте введенные вами данные и повторите создание заказа снова';

export const selectTypeOrderText = 'Поедем или отправим посылку?';
export const selectAddressTextFrom = 'Откуда вас забрать?\n\nℹ️ Укажите адрес или место подачи';

export const selectAddressTextTo = 'Куда поедем?\n\nℹ️ Укажите адрес или место назначения';
export const selectComment = 'Укажите комментарий для водителя';
export const selectPrice =
	'Укажите вознаграждение для водителя\n\nℹ️ Выберите из предложенных, или укажите своё в формате целого числа\nНапример: 360';

export const accessOrder = (
	type: string,
	addressFrom: string,
	addressTo: string,
	price: number,
	comment?: string,
) =>
	`${type}\n\nОткуда: ${addressFrom}\nКуда: ${addressTo}\n${comment ? 'Комментарий: ' + comment + '\n' : ''}\n💵 ${price}₽`;

export const errorPrice = (price: number) => `Сумма должна быть не меньше ${price} рублей`;

export const successOrder = '🔄 Ожидаем ответа от водителей';

export const commissionText = (
	commissionCurrentWeek: number,
	countOrderCurrentWeek: number,
	commissionLastWeek?: number,
	countOrderLastWeek?: number,
) =>
	'💵 <b>Комиссия</b>\n\n' +
	`Комиссия сервиса за текущую неделю - <b>${commissionCurrentWeek}₽</b>\n` +
	`За <b>${countOrderCurrentWeek} ${ConstantsService.getEndingWord(countOrderCurrentWeek, ['заказ', 'заказа', 'заказов'])}</b>\n\n` +
	`${
		commissionLastWeek && countOrderLastWeek
			? `💳 К оплате:  <b>${commissionLastWeek}₽` +
				`(${countOrderLastWeek} ${ConstantsService.getEndingWord(countOrderLastWeek, ['заказ', 'заказа', 'заказов'])})</b>\n\n`
			: ''
	}` +
	'ℹ️ Оплата производится каждый понедельник';

export const statisticText = (statistic: DriverOrdersInfoDto) =>
	'💵 <b>Заработок</b>\n\n' +
	`За сегодня: <b>${statistic.earnedToday}₽</b>\n` +
	`За неделю: <b>${statistic.earnedCurrentWeek}₽</b>\n\n` +
	'🛎️ <b>Заказы</b>\n\n' +
	'<b>Сегодня</b>\n' +
	`Всего заказов: <b>${statistic.countToday}</b>\n` +
	`Поездки: <b>${statistic.driveCountToday}</b>\n` +
	`Доставка: <b>${statistic.deliveryCountToday}</b>\n` +
	`Отменено: <b>${statistic.canceledCountToday}</b>\n\n` +
	'<b>Текущая неделя</b>\n' +
	`Всего заказов: <b>${statistic.countCurrentWeek}</b>\n` +
	`Поездки: <b>${statistic.driveCountCurrentWeek}</b>\n` +
	`Доставка: <b>${statistic.deliveryCountCurrentWeek}</b>\n` +
	`Отменено: <b>${statistic.canceledCountCurrentWeek}</b>\n\n` +
	'<b>За все время</b>\n' +
	`Всего заказов: <b>${statistic.countAll}</b>\n` +
	`Поездки: <b>${statistic.driveCountAll}</b>\n` +
	`Доставка: <b>${statistic.deliveryCountAll}</b>\n` +
	`Отменено: <b>${statistic.canceledCountAll}</b>\n\n`;

export const toggleWorkShift = {
	[StatusDriver.Online]: 'Вы вышли на смену, ожидайте заказов',
	[StatusDriver.Offline]: 'Смена завершена',
};

export const driverBlockedText = {
	[BlockedType.NotPaid]:
		'Вам необходимо оплатить комиссию, чтобы вы могли продолжить пользоваться нашим сервисом.\n' +
		`Сделать это можно нажав на кнопку\n${DriverButtons.profile.commission}`,
	[BlockedType.NotConfirmed]: 'Ваш аккаунт не подтвержден, дождитесь подтверждения администратором',
};
