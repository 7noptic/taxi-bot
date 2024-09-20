import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { PassengerModule } from '../passenger/passenger.module';
import { DriverModule } from '../driver/driver.module';
// import { NewsletterProcessor } from './newsletter.processor';
import { NewsletterController } from './newsletter.controller';
import { LoggerService } from '../logger/logger.service';
import { TaxiBotModule } from '../taxi-bot/taxi-bot.module';

@Module({
	imports: [
		// BullModule.registerQueue({
		// 	name: QueueType.Newsletter,
		// }),
		DriverModule,
		PassengerModule,
		TaxiBotModule,
	],

	providers: [NewsletterService, LoggerService],

	controllers: [NewsletterController],
})
export class NewsletterModule {}
