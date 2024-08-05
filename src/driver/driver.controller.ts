import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverService } from './driver.service';
import { QueryType } from '../types/query.type';
import { PASSENGER_NOT_FOUND } from '../passenger/passenger.message';
import { Driver } from './driver.model';
import { LoggerService } from '../logger/logger.service';
import { JwtGuard } from '../guards/jwt.guard';
import { AddCommissionDto } from '../order/dto/add-commission.dto';

@Controller('driver')
export class DriverController {
	constructor(
		private readonly driverService: DriverService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateDriverDto) {
		try {
			return this.driverService.create(dto);
		} catch (e) {
			this.loggerService.error('create Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Delete('delete/:chatId')
	async delete(@Param('chatId') chatId: string) {
		try {
			return this.driverService.delete(Number(chatId));
		} catch (e) {
			this.loggerService.error('delete Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('getLimitOrder/:currentPage')
	async getLimitDriver(@Param('currentPage') currentPage: QueryType['currentPage']) {
		try {
			return this.driverService.getLimitAll(currentPage);
		} catch (e) {
			this.loggerService.error('getLimitOrder Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('blocked/getLimitOrder/:currentPage')
	async getLimitDriverBLocked(@Param('currentPage') currentPage: QueryType['currentPage']) {
		try {
			return this.driverService.getLimitBlocked(currentPage);
		} catch (e) {
			this.loggerService.error('getLimitDriverBLocked Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('all')
	async getAllDriver() {
		try {
			return this.driverService.getAll();
		} catch (e) {
			this.loggerService.error('getAllDriver Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('byChatId/:chatId')
	async getByChatId(@Param('chatId') chatId: string) {
		try {
			const driver = await this.driverService.findByChatId(chatId);
			if (!driver) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return driver;
		} catch (e) {
			this.loggerService.error('getByChatId Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: Partial<Driver>) {
		try {
			const driver = await this.driverService.update(Number(id), dto);
			if (!driver) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return driver;
		} catch (e) {
			this.loggerService.error('update Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('locked/:id')
	async lockedDriver(@Param('id') id: string) {
		try {
			const driver = await this.driverService.lockedUser(Number(id));
			if (!driver) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return driver;
		} catch (e) {
			this.loggerService.error('lockedDriver Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('unlocked/:id')
	async unlockedDriver(@Param('id') id: string) {
		try {
			const driver = await this.driverService.unlockedUser(Number(id));
			if (!driver) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return driver;
		} catch (e) {
			this.loggerService.error('unlockedDriver Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('activated/:id')
	async activatedDriver(@Param('id') id: string) {
		try {
			const driver = await this.driverService.activatedUser(Number(id));
			if (!driver) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return driver;
		} catch (e) {
			this.loggerService.error('activatedDriver Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get(':id')
	async getFullDriverInfo(@Param('id') id: string) {
		try {
			const driver = await this.driverService.getFullDriverInfo(Number(id));
			if (!driver) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return driver;
		} catch (e) {
			this.loggerService.error('getFullDriverInfo Driver: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('updateCommission/:id')
	async updateCommission(@Param('id') id: string, @Body() dto: AddCommissionDto) {
		try {
			const driver = await this.driverService.updateCommission(Number(id), dto);
			if (!driver) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return driver;
		} catch (e) {
			this.loggerService.error('updateCommission Driver: ' + e?.toString());
		}
	}
}
