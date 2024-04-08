import { IsString } from 'class-validator';

export class UpdateFaqTextDto {
	@IsString()
	faqText: string;
}
