import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { AppealService } from './appeal.service';
import { SendMessageDto } from './dto/send-message.dto';
import { APPEAL_NOT_FOUND } from './appeal.constants';

@Controller('appeal')
export class AppealController {
	constructor(private readonly appealService: AppealService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateAppealDto) {
		return this.appealService.create(dto);
	}

	@UsePipes(new ValidationPipe())
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
		const deletedDocument = this.appealService.deleteById(id);
		if (!deletedDocument) {
			throw new NotFoundException(APPEAL_NOT_FOUND);
		}
		return deletedDocument;
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async updateById(@Param('id') id: string, @Body() dto: Partial<CreateAppealDto>) {
		const updatedDocument = this.appealService.updateById(id, dto);
		if (!updatedDocument) {
			throw new NotFoundException(APPEAL_NOT_FOUND);
		}
		return updatedDocument;
	}

	@HttpCode(200)
	@Post('findByUser/:userId')
	async findByUserId(@Param('userId') userId: string) {
		return this.appealService.findByUserId(userId);
	}
}
