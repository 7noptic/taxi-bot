import { IsString } from 'class-validator';

export class UpdateAboutTextDto {
	@IsString()
	aboutText: string;
}
