import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { PassengerModel } from './passenger.model';

@Controller('passenger')
export class PassengerController {
	@Post('create')
	async create(@Body() dto: Omit<PassengerModel, '_id'>) {}

	@Patch(':id')
	async update(@Param('id') id: PassengerModel['_id'], @Body() dto: PassengerModel) {}
}
