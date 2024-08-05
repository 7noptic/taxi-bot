import { IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
	@IsNumber()
	chatId: string;

	@IsString()
	text: string;
}
