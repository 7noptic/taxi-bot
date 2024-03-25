import { CityModel } from '../city/city.model';
import { AddressModule } from '../address/address.module';

export class UserModel {
	username: string;
	number: string;
	chatId: string;
	first_name: string;
	last_name: string;
	city: CityModel;
	address: { [key: string]: AddressModule };
}
