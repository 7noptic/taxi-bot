import { IsEmail, IsString } from 'class-validator';
import { ConstantsService } from '../../constants/constants.service';

export class AuthDto {
	@IsString()
	@IsEmail({}, { message: ConstantsService.NOT_EMAIL })
	email: string;

	@IsString()
	password: string;
}
