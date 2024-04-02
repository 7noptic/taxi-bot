import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CreateAppealDto } from './dto/create-appeal.dto';

@Controller('appeal')
export class AppealController {
	@Post('create')
	async create(@Body() dto: CreateAppealDto) {}

	@Get(':id')
	async getById(@Param('id') id: string) {}

	@Delete(':id')
	async deleteById(@Param('id') id: string) {}

	@Patch(':id')
	async updateById(@Param('id') id: string, @Body() dto: CreateAppealDto) {}

	@HttpCode(200)
	@Post('findByUser/:userId')
	async findByUserId(@Param('userId') userId: string) {}
}
