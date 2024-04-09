import { Module } from '@nestjs/common';
import { HelpBotUpdate } from './help-bot.update';
import { DriverModule } from '../driver/driver.module';
import { PassengerModule } from '../passenger/passenger.module';
import { AppealModule } from '../appeal/appeal.module';
import { OpenAppealScene } from './scenes/open-appeal.scene';

@Module({
	imports: [DriverModule, PassengerModule, AppealModule],
	providers: [HelpBotUpdate, OpenAppealScene],
})
export class HelpBotModule {}
