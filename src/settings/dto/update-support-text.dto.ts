import { IsString } from 'class-validator';

export class UpdateSupportTextDto {
	@IsString()
	supportText: string;
}
