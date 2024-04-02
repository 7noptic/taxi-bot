import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('city')
export class CityController {
	@Post('create')
	async create(@Body() dto: CreateCityDto) {}

	@Get(':id')
	async get(@Param('id') id: string) {}

	@Delete(':id')
	async delete(@Param('id') id: string) {}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: CreateCityDto) {}

	// @HttpCode(200)
	// @Post()
	// async find(@Body() dto: FindCityDto) {}
}
