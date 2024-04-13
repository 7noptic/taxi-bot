import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateOrderDto) {
		return this.orderService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Get(':id')
	async getCommissionForLastWeek(@Param('id') id: number) {
		return this.orderService.getCommissionForCurrentWeek(id);
	}
}
