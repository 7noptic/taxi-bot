import { Module } from '@nestjs/common';
import { HelpBotUpdate } from './help-bot.update';
import { DriverModule } from '../driver/driver.module';
import { PassengerModule } from '../passenger/passenger.module';
import { AppealModule } from '../appeal/appeal.module';
import { OpenAppealScene } from './scenes/open-appeal.scene';
import { TaxiBotValidation } from '../taxi-bot/taxi-bot.validation';
import { TaxiBotModule } from '../taxi-bot/taxi-bot.module';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [DriverModule, PassengerModule, AppealModule, TaxiBotModule],
	providers: [HelpBotUpdate, OpenAppealScene, TaxiBotValidation, LoggerService],
})
export class HelpBotModule {}
