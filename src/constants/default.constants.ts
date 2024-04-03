export const defaultRating = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
export const defaultCityPrice = 100;
export const admin = 'admin';

export const STRING_LENGTH_ERROR = (string: string = 'строки'): string =>
	`Длинна ${string} должна быть в диапазоне от $constraint1 до $constraint2 символов`;

export const NOT_FOUND_ERROR = (string: string = 'Объект'): string => `Такой ${string} не найден`;

export const NOT_EMAIL = 'Укажите валидный email';
