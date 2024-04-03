import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { NOT_EMAIL, STRING_LENGTH_ERROR } from '../../constants/default.constants';

export class CreateAdminDto {
	@IsString()
	@Length(3, 30, { message: STRING_LENGTH_ERROR('имени') })
	@IsOptional()
	name: string;

	@IsString()
	@IsEmail({}, { message: NOT_EMAIL })
	email: string;

	@IsString()
	@Length(6, 20, { message: STRING_LENGTH_ERROR('пароля') })
	password: string;
}
