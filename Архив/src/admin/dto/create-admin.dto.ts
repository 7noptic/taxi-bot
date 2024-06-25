import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ConstantsService } from '../../constants/constants.service';

export class CreateAdminDto {
	@IsString()
	@Length(3, 30, { message: ConstantsService.STRING_LENGTH_ERROR('имени') })
	@IsOptional()
	name: string;

	@IsString()
	@IsEmail({}, { message: ConstantsService.NOT_EMAIL })
	email: string;

	@IsString()
	@Length(6, 20, { message: ConstantsService.STRING_LENGTH_ERROR('пароля') })
	password: string;
}
