import { CityModel } from '../city/city.model';

export class UserModel {
	_id: string;
	username: string;
	number: string;
	chatId: string;
	first_name: string;
	last_name: string;
	city: CityModel;
}
