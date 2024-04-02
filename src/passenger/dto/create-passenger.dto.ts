import { City } from '../../city/city.model';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePassengerDto {
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

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Number)
	rating: number[];
}
