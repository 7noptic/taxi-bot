import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { JwtGuard } from '../guards/jwt.guard';
import { LoggerService } from '../logger/logger.service';
import { SendNewsDto } from './dto/sendNews.dto';

@Controller('newsletter')
export class NewsletterController {
	constructor(
		private readonly newsletterService: NewsletterService,
		private readonly loggerService: LoggerService,
	) {}

	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async sendNews(@Body() { type, message }: SendNewsDto) {
		try {
			return this.newsletterService.sendNews(type, message);
		} catch (e) {
			this.loggerService.error('create sendNews: ' + e?.toString());
		}
	}
}
