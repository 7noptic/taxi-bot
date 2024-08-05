import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.model';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
	constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

	async create(dto: CreateNoteDto) {
		return this.noteModel.create(dto);
	}
}
