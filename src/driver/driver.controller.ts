import { Body, Controller, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
	constructor(private readonly driverService: DriverService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateDriverDto) {
		return this.driverService.create(dto);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: CreateDriverDto) {}
}
