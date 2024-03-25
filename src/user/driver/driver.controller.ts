import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { DriverModel } from './driver.model';

@Controller('driver')
export class DriverController {
	@Post('create')
	async create(@Body() dto: Omit<DriverModel, '_id'>) {}

	@Patch(':id')
	async update(@Param('id') id: DriverModel['_id'], @Body() dto: DriverModel) {}
}
