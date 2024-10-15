import { Passenger } from '../../passenger/passenger.model';
import { ConstantsService } from '../../constants/constants.service';
import { commonButtons } from '../buttons/common.buttons';
import { PassengerButtons } from '../buttons/passenger.buttons';
import { DriverButtons } from '../buttons/driver.buttons';
import { StatusDriver } from '../types/status-driver.type';
import { DriverOrdersInfoDto } from '../../order/dto/driver-orders-info.dto';
import { BlockedType } from '../../driver/Enum/blocked-type';
import { Order } from '../../order/order.model';
import { Car, Driver } from '../../driver/driver.model';
import { TypeOrder } from '../../order/Enum/type-order';
import { Review } from '../../review/review.model';

export const WhatName = 'Ваше имя?';
export const WhatNameRegistration = `${WhatName}`;

export const WhatNameRegistrationPassenger = `${WhatName}\n\nℹ️ Оно будет отображаться водителю во время заказа. Пример: Виктор / Дмитрий / Андрей`;

export const WhatNameRegistrationDriver = `${WhatName}\n\nℹ️ Оно будет отображаться пользователю во время заказа. Пример: Виктор / Дмитрий / Андрей`;
export const WhatNumber = 'Введите ваш номер телефона в формате +79991112233';
export const WhatNumberDriver =
	'Укажите Ваш номер телефона в формате +79991112233. Он будет отображаться пользователю во время заказа';

export const WhatNumberPassenger =
	'Укажите Ваш номер телефона в формате +79991112233. Он будет отображаться водителю во время заказа';

export const WhatNumberRegistration = `${WhatNumber}\n\nℹ️ Либо поделитесь контактом для автоматического ввода номера (нажмите скрепочку)`;
export const WhatNumberRegistrationDriver = `${WhatNumberDriver}\n\nℹ️ Либо поделитесь контактом для автоматического ввода номера (нажмите скрепочку)`;
export const WhatNumberRegistrationPassenger = `${WhatNumberPassenger}\n\nℹ️ Либо поделитесь контактом для автоматического ввода номера (нажмите скрепочку)`;
export const errorNumber =
	'Номер телефона указан не в правильном формате.\nПожалуйста, укажите ваш номер телефона в формате +79991112233';

export const errorEmail = 'Email указан не верно.';
export const WhatCity = 'Выберите город';
export const WhatEmail = 'Введите email';

export const WarningEditCar =
	'❗После изменения автомобиля необходимо будет отправить подтверждающие документы.';
export const WhatCarBrand =
	'Ваш автомобиль?\nУкажите марку и модель, например, Lada Granta / ВАЗ 2110 / Hyundai Solaris\n';
export const WhatCarColor = 'Введите цвет автомобиля\nНапример: Белый';
export const WhatCarNumber = 'Гос.номер Вашего авто? Например: М046РН43';
export const WhatAccessOrderType = 'Выберите тип принимаемых заказов';
export const greeting = (name: string) =>
	`Мы рады нашему с Вами знакомству, <b>${name}!</b>\nРегистрация завершена`;

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
	`<b>${DriverButtons.profile.status[StatusDriver.Offline]} / ${DriverButtons.profile.status[StatusDriver.Online]}</b> - Установить статус для получения заказов\n\n` +
	`<b>${DriverButtons.profile.statistics}</b> - Отображение заработка и статистики по заказам\n\n` +
	`<b>${DriverButtons.profile.commission}</b>  - Оплата комиссии сервиса\n\n` +
	`<b>${commonButtons.profile.help}</b>  - дополнительная информация, поддержка\n\n` +
	`<b>${commonButtons.profile.profile}</b> - данные Вашего профиля, история заказов, настройки учётной записи`;

export const welcomeMessage = (name: string) =>
	`Рады приветствовать Вас в Подвези Бот${!!name ? `, <b>${name}</b>` : ''}! \nНаш сервис только запустился, и в первое время может не быть заказов🥺 \n` +
	`Но мы обещаем, что ждать долго их не придётся - впереди реклама и денежный конкурс!🙂`;

export const errorRegistration =
	'Что-то пошло не так, Проверьте введенные вами данные и повторите регистрацию заново';

export const startAddAddress = 'Чтобы добавить адрес, ответьте на пару вопросов';
export const maxAddress = `Вы не можете добавить более ${ConstantsService.defaultMaxAddresses} ${ConstantsService.getEndingWord(ConstantsService.defaultMaxAddresses, ['адреса', 'адресов', 'адресов'])}`;
export const startDeleteAddress = 'Для удаления адреса, введите его название';
export const startEditName = `Чтобы отменить изменение имени нажмите\n\n${commonButtons.back}`;
export const startEditPhone = `Чтобы отменить изменение номера нажмите\n\n${commonButtons.back}`;
export const startEditEmail = `Чтобы отменить изменение email нажмите\n\n${commonButtons.back}`;
export const startEditCity = `Чтобы отменить изменение города нажмите\n\n${commonButtons.back}`;
export const startEditCar = `Чтобы отменить изменение автомобиля нажмите\n\n${commonButtons.back}`;
export const startAccessOrderTypeCar = `Чтобы отменить изменение типа принимаемых заказов нажмите\n\n${commonButtons.back}`;
export const startCreateOrder = `\n\nЧтобы отменить создание заказа нажмите\n\n${commonButtons.back}`;
export const isBlockedPassenger = `Вы не можете полноценно пользоваться нашим сервисом, так как ваш аккаунт заблокирован ❌.\n\nЗа более подробной информацией вы можете обратиться в бот поддержки ${ConstantsService.helpBotName}`;
export const WhatNameAddress =
	'Введите название адреса, например: Дом, Работа, Родители. \nНазвание адреса должно быть уникальным';
export const WhatAddress = 'Введите адрес, например: ул. Московская 207, 1 подъезд';

export const errorAddAddress =
	'Что-то пошло не так... Проверьте введенные вами данные и повторите добавление адреса снова';

export const errorDeleteAddress =
	'Что-то пошло не так... Проверьте верно ли вы ввели название вашего адреса и повторите попытку';

export const NoAddresses =
	'У вас пока нет добавленных адресов, но вы можете добавить адрес нажав на кнопку ниже';

export const YourAddresses = (addresses: Passenger['address']) =>
	`У вас добавлено ${addresses.length} ${ConstantsService.getEndingWord(addresses.length, ['адрес', 'адреса', 'адресов'])}.\n\n` +
	`${addresses.map((address) => `<b>${address.name}: </b> ${address.address}`).join('\n')}`;

export const goBack = 'Возвращаемся назад';

export const successAddAddress = 'Адрес успешно добавлен';
export const successDeleteAddress = 'Адрес успешно удален';

export const settingsText =
	'<b>⚙️ Настройки</b>\n\nЗдесь вы можете изменить имя, номер телефона, населенный пункт';

export const settingsDriverText =
	'<b>⚙️ Настройки</b>\n\nЗдесь вы можете изменить имя, номер телефона, email, населенный пункт, тип принимаемых заказов, автомобиль';

export const successEditName = 'Имя успешно изменено';
export const successAddReview = 'Отзыв успешно отправлен';
export const successEditPhone = 'Номер успешно изменён';

export const successEditEmail = 'Email успешно изменён';
export const successEditCity = 'Город успешно изменён';
export const successEditCar =
	'❗Вы изменили автомобиль, необходимо отправить подтверждающие фотографии:\n' +
	' - транспортного средства\n' +
	' - свидетельство регистрации\n' +
	'нашему оператору с пометкой «Смена авто»: ' +
	ConstantsService.KirillName;
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
	'Укажите вознаграждение для водителя\n\nℹ️ Выберите из предложенных, или укажите своё в формате целого числа\nНапример: 130₽ / 180₽ / 225₽';

export const accessOrder = (
	type: string,
	addressFrom: string,
	addressTo: string,
	price: number,
	comment?: string,
) =>
	`<b>${type}</b>\n\n` +
	`Откуда: <b>${addressFrom}</b>\n` +
	`Куда: <b>${addressTo}</b>\n` +
	`${comment ? 'Комментарий: ' + `<b>${comment}\n</b>` : ''}\n` +
	`💵 <b>${price}₽</b>`;

export const errorPrice = (price: number) =>
	`Некорректно введена цена.\nСумма должна быть не меньше ${price} рублей.`;

export const successOrder = (numberOrder: string) =>
	`<b>${numberOrder}</b> создан!\n\n🔄 Ожидаем ответа от водителей`;

export const commissionText = (
	commission: number,
	commissionCurrentWeek: number,
	countOrderCurrentWeek: number,
	commissionLastWeek?: number[],
	countOrderLastWeek?: number[],
	driverCommission?: number,
) =>
	'💵 <b>Комиссия</b>\n\n' +
	`Комиссия сервиса за текущую неделю - <b>${commissionCurrentWeek}₽</b>\n` +
	`За <b>${countOrderCurrentWeek} ${ConstantsService.getEndingWord(countOrderCurrentWeek, ['заказ', 'заказа', 'заказов'])}</b>` +
	`${
		commissionLastWeek.length && countOrderLastWeek.length
			? `\n\n💳 Оплата за ${countOrderLastWeek.length} ${ConstantsService.getEndingWord(countOrderLastWeek.length, ['неделю', 'недели', 'недель'])}\n` +
				commissionLastWeek
					.map((commission, index) => {
						return (
							`Стоимость ${index + 1} ${ConstantsService.getEndingWord(index + 1, ['недели', 'недель', 'недель'])}: ` +
							`<b>${commission}₽ ` +
							`(${countOrderLastWeek[index]} ${ConstantsService.getEndingWord(countOrderLastWeek[index], ['заказ', 'заказа', 'заказов'])})</b>`
						);
					})
					.join('\n')
			: ''
	}` +
	'\n\nℹ️ Оплата производится каждый понедельник' +
	`\nℹ️ Стоимость коммиссии за заказ: <b>${driverCommission ? driverCommission : commission} руб.</b>`;

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
	[StatusDriver.Online]: 'Теперь Вы на линии! Ожидайте заказ!',
	[StatusDriver.Offline]: 'Вы ушли с линии. Ждём Вас снова!',
};

export const driverBlockedText = {
	[BlockedType.NotPaid]:
		'Вам необходимо оплатить комиссию, чтобы вы могли продолжить пользоваться нашим сервисом.\n' +
		`Сделать это можно нажав на кнопку\n${DriverButtons.profile.commission}`,
	[BlockedType.ToggleCar]:
		'❗Ваш профиль на модерации, необходимо отправить подтверждающие фотографии:\n' +
		' - транспортного средства\n' +
		' - свидетельство регистрации\n' +
		'нашему оператору с пометкой «Подтверждение документов»: ' +
		ConstantsService.KirillName,
	[BlockedType.NotConfirmed]:
		'❗Ваш профиль на модерации.\n' +
		'✅	Для активации учётной записи необходимо отправить фотографии:\n' +
		' - транспортного средства\n' +
		' - свидетельство регистрации\n' +
		// ' - Водительского удостоверения\n' +
		'нашему оператору с пометкой «Подтверждение документов»: ' +
		ConstantsService.KirillName,
	[BlockedType.No]: 'Ваш аккаунт заблокирован',
};

export const NotDrivers = `К сожалению в данный момент нет подходящих водителей.😞\nВозможно они появятся чуть позже...`;
export const newOrderMessage = (order: Order, rating: number[]) => {
	return (
		`🟢 Новый заказ! <b>${PassengerButtons.order.type[order.type].label}</b>\n\n` +
		// `ℹ️ <b>${order.numberOrder}</b>\n` +
		`Рейтинг: ⭐️${ConstantsService.getUserRating(rating)}` +
		` (${ConstantsService.getCountRating(rating.length)} ${ConstantsService.getEndingWord(ConstantsService.getCountRating(rating.length), ['оценка', 'оценки', 'оценок'])})\n\n` +
		`Откуда: <b>${order.addressFrom}</b>\n` +
		`Куда: <b>${order.addressTo}</b>\n` +
		`${order.comment ? `Комментарий: <b>${order.comment}</b>\n\n` : '\n'}` +
		`Стоимость <b>${order.price}₽</b>`
	);
};

export const errorValidation = 'Что-то не так с данными 😞';
export const confirmCancelOrder =
	'Вы уверены, что хотите отменить заказ? Ваш приоритет будет снижен.';
export const notConfirmCancelOrder = 'Продолжаем заказ ☺️';

export const timeDeliveryText = '🕐 Укажите время подачи';
export const desiredPriceText = '💵 Укажите желаемое вознаграждение\nили введите сумму вручную.';
export const successfulProposalSubmissionText = `✅ Ваше предложение отправлено пользователю. Ожидайте ответа!`;
export const driverOffer = (driver: Driver, time: number, price?: number) =>
	`✅ <b>${driver.first_name} (⭐️ ${ConstantsService.getUserRating(driver.rating)}` +
	` ${ConstantsService.getCountRating(driver.rating.length)} ${ConstantsService.getEndingWord(ConstantsService.getCountRating(driver.rating.length), ['оценка', 'оценки', 'оценок'])})\n` +
	`${driver.car.carColor} ${driver.car.carBrand} | ${driver.car.carNumber}</b>\n` +
	`Предложил вам уехать за <b>${price ? `${price}₽.` : 'вашу цену.'}</b>\n` +
	`Подача авто в течение <b>${time} минут.</b>`;

export const orderNotAvailable = `Заказ больше недоступен😞`;
export const startSuccessOrder = 'Чтобы отправить свое предложение по заказу ответьте на вопросы.';
export const cancelOffer = '❌ Предложение отменено.';
export const successOfferText = (order: Order, driver: Driver, isSecondaryOrder?: boolean) =>
	`✅ <b>${order.numberOrder} принят!\n\n` +
	`${isSecondaryOrder ? '⚠️ Водитель выполняет другой заказ и сразу спешит к вам!☺️\n\n' : ''}` +
	`👤 ${driver.first_name} ` +
	`⭐️${ConstantsService.getUserRating(driver.rating)}` +
	` (${ConstantsService.getCountRating(driver.rating.length)} ${ConstantsService.getEndingWord(ConstantsService.getCountRating(driver.rating.length), ['оценка', 'оценки', 'оценок'])})</b>\n\n` +
	`Цвет: <b>${driver.car.carColor}</b>\n` +
	`Авто: <b>${driver.car.carBrand}</b>\n` +
	`Гос.номер: <b>${driver.car.carNumber}</b>\n\n` +
	`📞 <b><a href=":tel${driver.phone}">${driver.phone}</a></b>\n` +
	`💵 Цена: <b>${order.price}₽</b>\n` +
	`🕐 Приедет через: <b>${order.submissionTime} минут</b>` +
	`${!isSecondaryOrder ? '\n\n✏️ Чтобы связаться с водителем, просто отправьте сообщение.' : ''}`;

export const successOfferForDriver = (order: Order, passenger: Passenger, driverIsBusy: boolean) =>
	`✅ <b>${order.numberOrder} ${driverIsBusy ? 'поставлен в очередь' : 'принят'}!\n\n` +
	`${PassengerButtons.order.type[order.type].label}</b>\n\n` +
	`💵 Цена <b>${order.price}₽</b>\n` +
	`Откуда: <b>${order.addressFrom}</b>\n` +
	`Куда: <b>${order.addressTo}</b>\n` +
	`${order.comment ? `Комментарий: <b>${order.comment}</b>\n` : ''}\n` +
	`📞<b><a href="tel:${passenger.phone}">${passenger.phone}</a></b>\n\n` +
	`🕐 До подачи: <b>${order.submissionTime} минуты</b>\n\n` +
	`${!driverIsBusy ? `✏️ Чтобы связаться с пассажиром, просто отправьте сообщение.` : ''}`;

export const successSecondOfferForDriver = (order: Order, minute?: number) =>
	`✅<b>Следующий ${order.numberOrder} начат!\n\n` +
	`${PassengerButtons.order.type[order.type].label}</b>\n\n` +
	`💵 Цена <b>${order.price}₽</b>\n` +
	`Откуда: <b>${order.addressFrom}</b>\n` +
	`Куда: <b>${order.addressTo}</b>\n` +
	`${order.comment ? `Комментарий: <b>${order.comment}</b>\n` : ''}\n\n` +
	`🕐 До подачи: <b>${minute ? minute : order.submissionTime} минуты</b>\n\n` +
	`✏️ Чтобы связаться с пассажиром, просто отправьте сообщение.`;

export const cancelOrderForDriver = 'Пользователь отменил заказ';

export const cancelOrderTimeout = 'Время поиска водителей истекло, ваш заказ отменен.';
export const successSendMessage = '✅ Сообщение успешно отправлено';
export const successGoOrder = '✅ Начали поездку';
export const offerIsNoLongerValid = '❌ Предложение больше не действительно😞';
export const youHaveActiveOrder =
	'Сначала необходимо завершить текущий заказ, прежде чем брать новый';
export const comeOnShift = 'Выйдите на смену, чтобы принимать заказы';
export const driverInPlace = (type: TypeOrder, car: Car) =>
	type == TypeOrder.DELIVERY
		? '🅿️ Водитель на месте'
		: `🕐 Вас ожидает:\n\n <b>${car.carColor} ${car.carBrand} ${car.carNumber}</b>`;
export const driverGoOrder =
	'✅ Водитель начал поездку.\nПожалуйста, пристегните ремень безопасности.';
export const messageFromDriver = '💬 Сообщение от водителя\n\n';
export const messageFromPassenger = '💬 Сообщение от пассажира\n\n';
export const passengerAlreadyLeaving = '🚶 Пользователь уже выходит';
export const cancelOrderByDriver = '⚠️ Вы отменили заказ, ваш приоритет будет снижен.';
export const cancelOrderToPassenger =
	'Водитель отменил заказ.\n\nВернитесь в меню и создайте новый.';
export const errorGlobal = `Что-то пошло не так... 😞\nПопробуйте перезапустить бота выполнив команду /start.\n\nЕсли бот работает некорректно, вы можете обратиться в поддержку ${ConstantsService.helpBotName}`;
export const errorMain = `Что-то пошло не так... 😞\nПопробуйте снова.`;
export const successFinishOrderToPassenger = (price: number) =>
	'✅ Водитель завершил поездку.\n' +
	`Стоимость - <b>${price}₽</b>\n\n` +
	'Оцените качество поездки:';

export const successFinishOrderToDriver = (price: number) =>
	'🎉 <b>Поездка завершена! +1⚡️</b>.\n' +
	`Сумма заказа - <b>${price}₽</b>\n\n` +
	'Оцените пользователя:';

export const notBusy = '🕐 Ожидаем новых заказов.';
export const workFinish = '✅ Смена завершена.';
export const orderCloseNextOrder = 'Этот заказ завершен, переходим к следующему';
export const notBusyPassenger = 'Вернитесь назад, чтобы снова создавать заказы';
export const driverInGo = (count: number) =>
	`🚕 Водитель в пути к вам.\nБудет через ` +
	`${count} ${ConstantsService.getEndingWord(count, ['минуту', 'минуты', 'минут'])}`;

export const addReviewText = 'Напишите текст вашего отзыва';
export const newPaymentMessage = (price: number, count: number) =>
	`Вам необходимо оплатить комиссию, за пользование нашим сервисом\n` +
	`Если вы не оплатите комиссию в течение 3 дней, ваш аккаунт будет заблокирован.\n\n` +
	`💳 К оплате:  <b>${price}₽` +
	`(${count} ${ConstantsService.getEndingWord(count, ['заказ', 'заказа', 'заказов'])})</b>`;

export const weeklyResultMessage = (
	price: number,
	countOrders: number,
	rating: string,
	commission: number,
	serviceCommission: number,
) =>
	`🎉 Итоги прошлой недели:\n\n` +
	`💵 Заработано: <b>${price.toLocaleString('ru-RU')}₽ (${countOrders} ${ConstantsService.getEndingWord(countOrders, ['заказ', 'заказа', 'заказов'])})</b>\n` +
	`⭐️ Рейтинг:  <b>${rating}</b>\n` +
	`⭐️ Комиссия сервиса:  <b>${commission}₽ (${countOrders} ${ConstantsService.getEndingWord(countOrders, ['заказ', 'заказа', 'заказов'])} / ${serviceCommission}₽ за заказ)</b>\n`;

export const ReviewsMessage = (reviews: Review[]) =>
	`👤 <b>Отзывы пользователей:</b>\n\n` +
	reviews.map(({ text }, index) => `<b>${index + 1}) ${text}</b>`).join('\n\n');

export const notEnoughAmountToPay =
	'❗Вы выполнили менее 10 заказов за эту неделю. Комиссия сервиса не взимается. Удачных поездок!';

export const paymentTitle = 'Оплата за пользование сервисом';
export const successfulPayment = 'Вы успешно оплатили комиссию.';
export const notPayment =
	'Вы не оплатили комиссию. Возможно оплата еще не прошла, попробуйте через несколько минут';
export const youLocked =
	'Вы не оплатили комиссию😞\n⛔️Ваш аккаунт был заблокирован.\n\nОплатите комиссию, чтобы продолжить пользоваться нашим сервисом.';

export const successAppeal =
	'Администратор закрыл ваше обращение. Надеюсь вы остались довольны работой нашего сервиса.';

export const successUnlockedDriver =
	'Ваш аккаунт разблокирован, теперь вы можете пользоваться нашим сервисом.';

export const successAcceptedDriver =
	'✅ Ваша учетная запись активирована, теперь вы можете пользоваться нашим сервисом ☺️.';

export const linkForPayment = (link: string, email: string) =>
	`${!!email ? '<b>Для получения чека вам необходимо заполнить Email в профиле</b>\n\n' : ''}` +
	`Ваша ссылка для оплаты:\n` +
	`${link}\n\n` +
	`Оплату необходимо произвести в течении <b>10 минут</b>.\n` +
	`После успешной оплаты нажмите на кнопку <b>"${DriverButtons.payment.iPaid.label}"</b>`;
