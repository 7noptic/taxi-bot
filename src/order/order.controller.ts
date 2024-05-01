import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { endOfISOWeek, startOfISOWeek } from 'date-fns';

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
	async getCommissionForLastWeek(@Param('id') id: string) {
		const now = new Date();
		const startDate = startOfISOWeek(now);
		const endDate = endOfISOWeek(now);

		return this.orderService.getCommissionForWeek(startDate, endDate, Number(id));
	}

	@UsePipes(new ValidationPipe())
	@Get('infoPassenger/:id')
	async getPassengerOrdersInfo(@Param('id') id: number) {
		return this.orderService.getPassengerOrdersInfo(id);
	}
}
