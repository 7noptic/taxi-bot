import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
	constructor(private readonly cityService: CityService) {}

	@Post('create')
	async create(@Body() dto: CreateCityDto) {
		return this.cityService.create(dto);
	}

	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.cityService.getById(id);
	}

	@Get('byName/:name')
	async findByName(@Param('name') name: string) {
		return this.cityService.getByName(name);
	}

	@Delete(':id')
	async deleteById(@Param('id') id: string) {
		return this.cityService.deleteById(id);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: CreateCityDto) {
		return this.cityService.updateById(id, dto);
	}

	// @HttpCode(200)
	// @Post()
	// async find(@Body() dto: FindCityDto) {}
}
