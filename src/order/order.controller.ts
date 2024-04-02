import { Controller } from '@nestjs/common';

@Controller('order')
export class OrderController {
	// @Post('create')
	// async create(@Body() dto: Omit<Order, '_id'>) {}
	// @Get(':id')
	// async get(@Param('id') id: Order['_id']) {}
	// @Delete(':id')
	// async delete(@Param('id') id: Order['_id']) {}
	// @Patch(':id')
	// async update(@Param('id') id: Order['_id'], @Body() dto: Order) {}
	// @HttpCode(200)
	// @Post()
	// async find(@Body() dto: FindCityDto) {}
}
