import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { AppealService } from './appeal.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('appeal')
export class AppealController {
	constructor(private readonly appealService: AppealService) {}

	@Post('create')
	async create(@Body() dto: CreateAppealDto) {
		return this.appealService.create(dto);
	}

	@HttpCode(200)
	@Post('sendMessage/:id')
	async sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto) {
		return this.appealService.sendMessage(id, dto);
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.appealService.findById(id);
	}

	@Delete(':id')
	async deleteById(@Param('id') id: string) {
		return this.appealService.deleteById(id);
	}

	@Patch(':id')
	async updateById(@Param('id') id: string, @Body() dto: Partial<CreateAppealDto>) {
		return this.appealService.updateById(id, dto);
	}

	@HttpCode(200)
	@Post('findByUser/:userId')
	async findByUserId(@Param('userId') userId: string) {}
}
