import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';

@Controller('passenger')
export class PassengerController {
	@Post('create')
	async create(@Body() dto: CreatePassengerDto) {}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: CreatePassengerDto) {}
}
