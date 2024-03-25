import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderModel } from './order.model';

@Controller('order')
export class OrderController {
	@Post('create')
	async create(@Body() dto: Omit<OrderModel, '_id'>) {}

	@Get(':id')
	async get(@Param('id') id: OrderModel['_id']) {}

	@Delete(':id')
	async delete(@Param('id') id: OrderModel['_id']) {}

	@Patch(':id')
	async update(@Param('id') id: OrderModel['_id'], @Body() dto: OrderModel) {}

	// @HttpCode(200)
	// @Post()
	// async find(@Body() dto: FindCityDto) {}
}
