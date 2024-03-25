import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CityModel } from './city.model';
import { FindCityDto } from './dto/find-city.dto';

@Controller('city')
export class CityController {
	@Post('create')
	async create(@Body() dto: Omit<CityModel, '_id'>) {}

	@Get(':id')
	async get(@Param('id') id: CityModel['_id']) {}

	@Delete(':id')
	async delete(@Param('id') id: CityModel['_id']) {}

	@Patch(':id')
	async update(@Param('id') id: CityModel['_id'], @Body() dto: CityModel) {}

	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindCityDto) {}
}
