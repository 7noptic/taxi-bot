import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from '../auth/dto/auth.dto';

@Controller('admin')
export class AdminController {
	@Post('register')
	async register(@Body() dto: AuthDto) {}
}
