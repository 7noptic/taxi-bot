import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverService } from './driver.service';
import { QueryType } from '../types/query.type';
import { PASSENGER_NOT_FOUND } from '../passenger/passenger.message';
import { Driver } from './driver.model';
import { LoggerService } from '../logger/logger.service';

@Controller('driver')
export class DriverController {
	constructor(
		private readonly driverService: DriverService,
		private readonly loggerService: LoggerService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateDriverDto) {
		try {
			return this.driverService.create(dto);
		} catch (e) {
			this.loggerService.error('create Driver: ' + e?.toString());
		}
	}

	@Get('getLimitOrder/:currentPage')
	async getLimitOrder(@Param('currentPage') currentPage: QueryType['currentPage']) {
		try {
			return this.driverService.getLimitAll(currentPage);
		} catch (e) {
			this.loggerService.error('getLimitOrder Driver: ' + e?.toString());
		}
	}

	@Post('all')
	async getAllOrder() {
		try {
			return this.driverService.getAll();
		} catch (e) {
			this.loggerService.error('getAllOrder Driver: ' + e?.toString());
		}
	}

	@Get('byChatId/:chatId')
	async getByChatId(@Param('chatId') chatId: string) {
		try {
			const driver = await this.driverService.findByChatId(Number(chatId));
			if (!driver) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return driver;
		} catch (e) {
			this.loggerService.error('getByChatId Driver: ' + e?.toString());
		}
	}

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
}
