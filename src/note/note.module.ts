import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteService } from './note.service';
import { Note, NoteSchema } from './note.model';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }])],
	controllers: [NoteController],
	providers: [NoteService, LoggerService],
	exports: [NoteService],
})
export class NoteModule {}
