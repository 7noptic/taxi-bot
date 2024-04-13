import { City } from '../../city/city.model';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDriverDto {
	@IsString()
	username: string;

	@IsString()
	phone: string;

	@IsString()
	chatId: string;

	@IsString()
	first_name: string;

	@IsString()
	last_name: string;

	@ValidateNested()
	@Type(() => City)
	city: City;

	@IsString()
	carBrand: string;

	@IsString()
	carColor: string;

	@IsString()
	carNumber: string;
}
