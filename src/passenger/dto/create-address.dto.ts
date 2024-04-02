import { City } from '../../city/city.model';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
	@IsString()
	name: string;

	@ValidateNested()
	@Type(() => City)
	city: City;

	@IsOptional()
	@IsString()
	district?: string;

	@IsOptional()
	@IsString()
	street?: string;

	@IsOptional()
	@IsString()
	house?: string;

	@IsOptional()
	@IsString()
	entrance?: string;

	@IsOptional()
	@IsString()
	comment?: string;

	@IsString()
	address: string;
}
