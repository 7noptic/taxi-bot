import { Module } from '@nestjs/common';
import { TaxiBotUpdate } from './taxi-bot.update';
import { PassengerModule } from '../passenger/passenger.module';
import { DriverModule } from '../driver/driver.module';
import { RegisterDriverScene } from './scenes/registration-driver.scene';
import { CityModule } from '../city/city.module';
import { RegisterPassengerScene } from './scenes/registration-passenger.scene';
import { AddAddressScene } from './scenes/add-address.scene';
import { DeleteAddressScene } from './scenes/delete-address.scene';

@Module({
	imports: [PassengerModule, DriverModule, CityModule],
	providers: [
		TaxiBotUpdate,
		RegisterDriverScene,
		RegisterPassengerScene,
		AddAddressScene,
		DeleteAddressScene,
	],
})
export class TaxiBotModule {}
