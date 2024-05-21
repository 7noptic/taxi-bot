import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
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
import { QueryType } from '../types/query.type';

@Controller('admin')
export class AdminController {
	constructor(
		private readonly adminService: AdminService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
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

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Delete('byId/:id')
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

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('getLimitOrder/:currentPage')
	async getLimitOrder(@Param('currentPage') currentPage: QueryType['currentPage']) {
		try {
			return this.adminService.getLimitAll(currentPage);
		} catch (e) {
			this.loggerService.error('getLimitOrder Admin: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('findByName/:name')
	async findByName(@Param('name') name: string) {
		try {
			return this.adminService.findByName(name);
		} catch (e) {
			this.loggerService.error('findByName Admin: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('getByEmail/:email')
	async getByEmail(@Param('email') email: string) {
		try {
			return this.adminService.getByEmail(email);
		} catch (e) {
			this.loggerService.error('getByEmail Admin: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('all')
	async getAllOrder() {
		try {
			return this.adminService.getAll();
		} catch (e) {
			this.loggerService.error('getAllOrder Admin: ' + e?.toString());
		}
	}
}
