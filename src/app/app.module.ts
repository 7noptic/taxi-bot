import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from '../order/order.module';
import { CityModule } from '../city/city.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DriverModule } from '../driver/driver.module';
import { PassengerModule } from '../passenger/passenger.module';
import { AdminModule } from '../admin/admin.module';
import { AppealModule } from '../appeal/appeal.module';
import { ReviewModule } from '../review/review.module';
import { SettingsModule } from '../settings/settings.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from '../settings/settings.service';
import { Settings, SettingsSchema } from '../settings/settings.model';
import { TelegrafModule } from 'nestjs-telegraf';
import { Mongo } from '@telegraf/session/mongodb';
import { session } from 'telegraf';
import { TaxiBotModule } from '../taxi-bot/taxi-bot.module';
import { BotName } from '../constants/default.constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const store = Mongo({
	url: 'mongodb://localhost/taxi',
	database: 'taxi-bot',
});

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot('mongodb://localhost/taxi'),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
		}),
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
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			botName: BotName.Taxi,
			useFactory: (configService: ConfigService) => ({
				token: configService.get('TAXI_BOT_TOKEN'),
				middlewares: [session({ store })],
			}),
			inject: [ConfigService],
		}),
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			botName: BotName.Help,
			useFactory: async (configService: ConfigService) => ({
				token: configService.get('HELP_BOT_TOKEN'),
			}),
			inject: [ConfigService],
		}),
		TaxiBotModule,
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
