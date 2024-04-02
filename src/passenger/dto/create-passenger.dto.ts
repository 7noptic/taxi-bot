import { City } from '../../city/city.model';
import { Address } from '../passenger.model';

export class CreatePassengerDto {
	username: string;
	phone: string;
	chatId: string;
	first_name: string;
	last_name: string;
	city: City;
	rating: number[];
	address: Address;
}
