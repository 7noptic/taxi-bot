import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly loggerService: LoggerService,
	) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { email, password }: AuthDto) {
		try {
			const { email: validateEmail } = await this.authService.validateUser(email, password);
			return this.authService.login(validateEmail);
		} catch (e) {
			this.loggerService.error('login auth: ' + e?.toString());
		}
	}
}
