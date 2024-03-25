import { CityModel } from '../../../city/city.model';

export interface IAddress {
	name: string;
	city: CityModel;
	district: string;
	street: string;
	house: string;
	entrance: string;
	comment: string;
}
