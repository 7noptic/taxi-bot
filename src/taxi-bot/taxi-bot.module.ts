import { Module } from '@nestjs/common';
import { TaxiBotUpdate } from './taxi-bot.update';
import { PassengerModule } from '../passenger/passenger.module';
import { DriverModule } from '../driver/driver.module';
import { RegisterDriverScene } from './scenes/registration-driver.scene';

@Module({
	imports: [PassengerModule, DriverModule],
	providers: [TaxiBotUpdate, RegisterDriverScene],
})
export class TaxiBotModule {}
