import { Module } from '@nestjs/common';
import { PassengerModule } from '../passenger/passenger.module';
import { DriverModule } from '../driver/driver.module';
import { CityModule } from '../city/city.module';
import { TaxiBotCommonUpdate } from './updates/common.update';
import { TaxiBotPassengerUpdate } from './updates/passenger.update';
import { SettingsModule } from '../settings/settings.module';
import { AddAddressScene } from './scenes/passenger/add-address.scene';
import { RegisterPassengerScene } from './scenes/passenger/registration-passenger.scene';
import { DeleteAddressScene } from './scenes/passenger/delete-address.scene';
import { EditNameScene } from './scenes/passenger/edit-name.scene';
import { EditCityScene } from './scenes/passenger/edit-city.scene';
import { EditPhoneScene } from './scenes/passenger/edit-phone.scene';
import { CreateOrderScene } from './scenes/passenger/create-order.scene';
import { OrderModule } from '../order/order.module';
import { TaxiBotValidation } from './taxi-bot.validation';
import { RegisterDriverScene } from './scenes/driver/registration-driver.scene';
import { TaxiBotDriverUpdate } from './updates/driver.update';
import { EditCitySceneDriver } from './scenes/driver/edit-city.scene';
import { EditPhoneSceneDriver } from './scenes/driver/edit-phone.scene';
import { EditNameSceneDriver } from './scenes/driver/edit-name.scene';
import { EditCarSceneDriver } from './scenes/driver/edit-car.scene';
import { EditAccessOrderTypeSceneDriver } from './scenes/driver/edit-access-order-type.scene';
import { BargainOrderScene } from './scenes/driver/bargain-order.scene';
import { AccessOrderScene } from './scenes/driver/access-order.scene';
import { ReviewModule } from '../review/review.module';
import { AddReviewScene } from './scenes/add-review.scene';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from '../payment/payment.module';
import { LoggerModule } from '../logger/logger.module';
import { EditEmailSceneDriver } from './scenes/driver/edit-email.scene';

@Module({
	imports: [
		PassengerModule,
		DriverModule,
		CityModule,
		SettingsModule,
		OrderModule,
		ReviewModule,
		ConfigModule,
		PaymentModule,
		LoggerModule,
	],
	providers: [
		RegisterDriverScene,
		RegisterPassengerScene,
		AddAddressScene,
		DeleteAddressScene,
		EditNameScene,
		EditPhoneScene,
		EditCityScene,
		BargainOrderScene,
		AccessOrderScene,
		AddReviewScene,
		EditNameSceneDriver,
		EditCarSceneDriver,
		EditAccessOrderTypeSceneDriver,
		EditPhoneSceneDriver,
		EditEmailSceneDriver,
		EditCitySceneDriver,
		CreateOrderScene,
		TaxiBotCommonUpdate,
		TaxiBotPassengerUpdate,
		TaxiBotDriverUpdate,
		TaxiBotValidation,
	],
})
export class TaxiBotModule {}
