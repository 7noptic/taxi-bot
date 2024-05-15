import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { endOfISOWeek, startOfISOWeek } from 'date-fns';
import { QueryType } from '../types/query.type';
import { LoggerService } from '../logger/logger.service';

@Controller('order')
export class OrderController {
	constructor(
		private readonly orderService: OrderService,
		private readonly loggerService: LoggerService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateOrderDto) {
		try {
			return this.orderService.create(dto);
		} catch (e) {
			this.loggerService.error('create Order: ' + e?.toString());
		}
	}

	@UsePipes(new ValidationPipe())
	@Get('infoPassenger/:id')
	async getPassengerOrdersInfo(@Param('id') id: number) {
		try {
			return this.orderService.getPassengerOrdersInfo(id);
		} catch (e) {
			this.loggerService.error('getPassengerOrdersInfo Order: ' + e?.toString());
		}
	}

	@Get('getLimitOrder/:currentPage')
	async getLimitOrder(@Param('currentPage') currentPage: QueryType['currentPage']) {
		try {
			return this.orderService.getLimitAll(currentPage);
		} catch (e) {
			this.loggerService.error('getLimitOrder Order: ' + e?.toString());
		}
	}

	@Get('findByNumberOrder/:numberOrder')
	async findByNumberOrder(@Param('numberOrder') numberOrder: string) {
		try {
			return this.orderService.findByNumberOrder(numberOrder);
		} catch (e) {
			this.loggerService.error('findByNumberOrder Order: ' + e?.toString());
		}
	}

	@Post('all')
	async getAllOrder() {
		try {
			return this.orderService.getAll();
		} catch (e) {
			this.loggerService.error('getAllOrder Order: ' + e?.toString());
		}
	}

	@Get('fullInfo/:orderId')
	async getFullOrderInfo(@Param('orderId') orderId: string) {
		try {
			return this.orderService.getFullOrderInfo(orderId);
		} catch (e) {
			this.loggerService.error('getFullOrderInfo Order: ' + e?.toString());
		}
	}

	@UsePipes(new ValidationPipe())
	@Get('getCommission/:id')
	async getCommissionForLastWeek(@Param('id') id: string) {
		try {
			const now = new Date();
			const startDate = startOfISOWeek(now);
			const endDate = endOfISOWeek(now);

			return this.orderService.getCommissionForWeek(startDate, endDate, Number(id));
		} catch (e) {
			this.loggerService.error('getCommissionForLastWeek Order: ' + e?.toString());
		}
	}
}
