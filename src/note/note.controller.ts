import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { JwtGuard } from '../guards/jwt.guard';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('note')
export class NoteController {
	constructor(
		private readonly noteService: NoteService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async createNote(@Body() dto: CreateNoteDto) {
		try {
			return this.noteService.create(dto);
		} catch (e) {
			this.loggerService.error('createNote: ' + e?.toString());
		}
	}
}
