import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { CityService } from './city.service';
import { QueryType } from '../types/query.type';
import { LoggerService } from '../logger/logger.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('city')
export class CityController {
	constructor(
		private readonly cityService: CityService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateCityDto) {
		try {
			return this.cityService.create(dto);
		} catch (e) {
			this.loggerService.error('create City: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('byId/:id')
	async findById(@Param('id') id: string) {
		try {
			return this.cityService.getById(id);
		} catch (e) {
			this.loggerService.error('findById City: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('byName/:name')
	async getByName(@Param('name') name: string) {
		try {
			return this.cityService.getByName(name);
		} catch (e) {
			this.loggerService.error('getByName City: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Delete('byId/:id')
	async deleteById(@Param('id') id: string) {
		try {
			return this.cityService.deleteById(id);
		} catch (e) {
			this.loggerService.error('deleteById City: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch('byId/:id')
	async update(@Param('id') id: string, @Body() dto: Partial<CreateCityDto>) {
		try {
			return this.cityService.updateById(id, dto);
		} catch (e) {
			this.loggerService.error('update City: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('getLimitOrder/:currentPage')
	async getLimitOrder(@Param('currentPage') currentPage: QueryType['currentPage']) {
		try {
			return this.cityService.getLimitAll(currentPage);
		} catch (e) {
			this.loggerService.error('getLimitOrder City: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('findByName/:name')
	async findByName(@Param('name') name: string) {
		try {
			return this.cityService.findByName(name);
		} catch (e) {
			this.loggerService.error('findByName City: ' + e?.toString());
		}
	}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('all')
	async getAllOrder() {
		try {
			return this.cityService.getAll();
		} catch (e) {
			this.loggerService.error('getAllOrder City: ' + e?.toString());
		}
	}
}
