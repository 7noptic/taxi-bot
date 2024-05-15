import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	NotFoundException,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ALREADY_REGISTERED_ERROR } from '../auth/auth.constants';
import { JwtGuard } from '../guards/jwt.guard';
import { ConstantsService } from '../constants/constants.service';
import { LoggerService } from '../logger/logger.service';

@Controller('admin')
export class AdminController {
	constructor(
		private readonly adminService: AdminService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: CreateAdminDto) {
		try {
			const oldAdmin = await this.adminService.findAdminByEmail(dto.email);
			if (oldAdmin) {
				throw new BadRequestException(ALREADY_REGISTERED_ERROR);
			}
			return await this.adminService.create(dto);
		} catch (e) {
			this.loggerService.error('register Admin: ' + e?.toString());
		}
	}

	@Delete(':id')
	async deleteById(@Param('id') id: string) {
		try {
			const deletedAdmin = await this.adminService.findAdminById(id);
			if (!deletedAdmin) {
				throw new NotFoundException(ConstantsService.NOT_FOUND_ERROR('администратор'));
			}
			return await this.adminService.deleteById(id);
		} catch (e) {
			this.loggerService.error('deleteById Admin: ' + e?.toString());
		}
	}
}
