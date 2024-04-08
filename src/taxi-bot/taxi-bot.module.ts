import { Module } from '@nestjs/common';
import { PassengerModule } from '../passenger/passenger.module';
import { DriverModule } from '../driver/driver.module';
import { RegisterDriverScene } from './scenes/registration-driver.scene';
import { CityModule } from '../city/city.module';
import { RegisterPassengerScene } from './scenes/registration-passenger.scene';
import { AddAddressScene } from './scenes/add-address.scene';
import { DeleteAddressScene } from './scenes/delete-address.scene';
import { TaxiBotCommonUpdate } from './updates/common.update';
import { TaxiBotPassengerUpdate } from './updates/passenger.update';
import { SettingsModule } from '../settings/settings.module';

@Module({
	imports: [PassengerModule, DriverModule, CityModule, SettingsModule],
	providers: [
		RegisterDriverScene,
		RegisterPassengerScene,
		AddAddressScene,
		DeleteAddressScene,
		TaxiBotCommonUpdate,
		TaxiBotPassengerUpdate,
	],
})
export class TaxiBotModule {}
