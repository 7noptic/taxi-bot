import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';

@Controller('driver')
export class DriverController {
	@Post('create')
	async create(@Body() dto: CreateDriverDto) {}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: CreateDriverDto) {}
}
