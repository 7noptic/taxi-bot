import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CarDto {
	@IsString()
	carBrand: string;

	@IsString()
	carColor: string;

	@IsString()
	carNumber: string;
}

export class CreateDriverDto {
	@IsString()
	username: string;

	@IsString()
	phone: string;

	@IsString()
	email: string;

	@IsString()
	chatId: number;

	@IsString()
	first_name: string;

	@IsString()
	last_name: string;

	@IsString()
	city: string;

	@ValidateNested()
	@Type(() => CarDto)
	car: CarDto;
}
