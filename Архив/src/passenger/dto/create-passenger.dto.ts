import { IsString } from 'class-validator';

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

	@IsString()
	city: string;
}
