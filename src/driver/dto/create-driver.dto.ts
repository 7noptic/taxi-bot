import { City } from '../../city/city.model';

export class CreateDriverDto {
	username: string;
	phone: string;
	chatId: string;
	first_name: string;
	last_name: string;
	city: City;
	rating: number[];
	carBrand: string;
	carColor: string;
	carNumber: string;
}
