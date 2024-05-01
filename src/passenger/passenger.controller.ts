import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { PassengerService } from './passenger.service';

@Controller('passenger')
export class PassengerController {
	constructor(private readonly passengerService: PassengerService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreatePassengerDto) {
		return this.passengerService.create(dto);
	}

	@Get('getRating/:chatId')
	async getRatingById(@Param('chatId') chatId: number) {
		return this.passengerService.getRatingById(chatId);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: CreatePassengerDto) {}

	@Get(':id')
	async getFullPassengerInfo(@Param('id') id: string) {
		return this.passengerService.getFullPassengerInfo(Number(id));
	}

	@Get('')
	async getAllPassenger() {
		return this.passengerService.getAll();
	}
}
