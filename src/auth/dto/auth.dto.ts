import { IsEmail, IsString } from 'class-validator';
import { NOT_EMAIL } from '../../constants/default.constants';

export class AuthDto {
	@IsString()
	@IsEmail({}, { message: NOT_EMAIL })
	email: string;

	@IsString()
	password: string;
}
