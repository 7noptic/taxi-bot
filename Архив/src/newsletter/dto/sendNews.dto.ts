import { NewsletterType } from '../enum/newsletter.type';

export interface SendNewsDto {
	type: NewsletterType | string;
	message: string;
}
