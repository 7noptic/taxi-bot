import { CityModel } from '../city/city.model';

export class AddressModel {
	name: string;
	city: CityModel;
	district: string;
	street: string;
	house: string;
	entrance: string;
	comment: string;
}
