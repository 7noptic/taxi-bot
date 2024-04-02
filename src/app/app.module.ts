import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from '../order/order.module';
import { CityModule } from '../city/city.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DriverModule } from '../driver/driver.module';
import { PassengerModule } from '../passenger/passenger.module';
import { AdminModule } from '../admin/admin.module';
import { AppealModule } from '../appeal/appeal.module';
import { ReviewModule } from '../review/review.module';
import { SettingsModule } from '../settings/settings.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from '../settings/settings.service';
import { Settings, SettingsSchema } from '../settings/settings.model';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot('mongodb://localhost/taxi'),
		OrderModule,
		CityModule,
		AuthModule,
		DriverModule,
		PassengerModule,
		AdminModule,
		AppealModule,
		ReviewModule,
		SettingsModule,
		MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }]),
	],
	controllers: [AppController],
	providers: [AppService, SettingsService],
})
export class AppModule {
	constructor(private readonly settingsService: SettingsService) {}

	async onModuleInit() {
		await this.settingsService.initializeSettings();
	}
}
