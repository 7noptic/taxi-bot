import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { PassengerService } from './passenger.service';
import { PASSENGER_NOT_FOUND } from './passenger.message';
import { Passenger } from './passenger.model';
import { QueryType } from '../types/query.type';
import { LoggerService } from '../logger/logger.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('passenger')
export class PassengerController {
	constructor(
		private readonly passengerService: PassengerService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreatePassengerDto) {
		try {
			return this.passengerService.create(dto);
		} catch (e) {
			this.loggerService.error('create Passenger: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('getRating/:chatId')
	async getRatingById(@Param('chatId') chatId: number) {
		try {
			return this.passengerService.getRatingById(chatId);
		} catch (e) {
			this.loggerService.error('getRatingById Passenger: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: Partial<Passenger>) {
		try {
			const passenger = await this.passengerService.update(Number(id), dto);
			if (!passenger) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return passenger;
		} catch (e) {
			this.loggerService.error('update Passenger: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('byChatId/:chatId')
	async getByChatId(@Param('chatId') chatId: string) {
		try {
			const passenger = await this.passengerService.findByChatId(Number(chatId));
			if (!passenger) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return passenger;
		} catch (e) {
			this.loggerService.error('getByChatId Passenger: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get(':id')
	async getFullPassengerInfo(@Param('id') id: string) {
		try {
			const passenger = await this.passengerService.getFullPassengerInfo(Number(id));
			if (!passenger) {
				throw new NotFoundException(PASSENGER_NOT_FOUND);
			}
			return passenger;
		} catch (e) {
			this.loggerService.error('getFullPassengerInfo Passenger: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('getLimitOrder/:currentPage')
	async getLimitPassenger(@Param('currentPage') currentPage: QueryType['currentPage']) {
		try {
			return this.passengerService.getLimitAll(currentPage);
		} catch (e) {
			this.loggerService.error('getLimitPassenger Passenger: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('all')
	async getAllPassenger() {
		try {
			return this.passengerService.getAll();
		} catch (e) {
			this.loggerService.error('getAllPassenger Passenger: ' + e?.toString());
		}
	}
}
