import { IsString } from 'class-validator';

export class CreateNoteDto {
	@IsString()
	id: string;

	@IsString()
	text: string;
}
