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

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: CreateAdminDto) {
		const oldAdmin = await this.adminService.findAdminByEmail(dto.email);
		if (oldAdmin) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		return await this.adminService.create(dto);
	}

	@Delete(':id')
	async deleteById(@Param('id') id: string) {
		const deletedAdmin = await this.adminService.findAdminById(id);
		if (!deletedAdmin) {
			throw new NotFoundException(ConstantsService.NOT_FOUND_ERROR('администратор'));
		}
		return await this.adminService.deleteById(id);
	}
}
