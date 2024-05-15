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
import { BotName } from '../types/bot-name.type';
import { HelpBotModule } from '../help-bot/help-bot.module';
import { BullModule } from '@nestjs/bull';
import { PaymentModule } from '../payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from '../logger/logger.module';
import { SocketService } from '../socket/socket.service';

const store = Mongo({
	url: 'mongodb://localhost/taxi',
	database: 'taxi-bot',
});

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot('mongodb://localhost/taxi'),
		ThrottlerModule.forRoot([
			{
				ttl: 60,
				limit: 10,
			},
		]),
		BullModule.forRoot({
			redis: {
				host: '127.0.0.1',
				port: 6379,
			},
		}),
		ScheduleModule.forRoot(),
		PaymentModule,
		OrderModule,
		LoggerModule,
		CityModule,
		AuthModule,
		DriverModule,
		PassengerModule,
		AdminModule,
		AppealModule,
		HelpBotModule,
		ReviewModule,
		SettingsModule,
		MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }]),
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			botName: BotName.Taxi,
			useFactory: (configService: ConfigService) => ({
				token: configService.get('TAXI_BOT_TOKEN'),
				middlewares: [session({ store })],
				include: [TaxiBotModule],
			}),
			inject: [ConfigService],
		}),
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			botName: BotName.Help,
			useFactory: async (configService: ConfigService) => ({
				token: configService.get('HELP_BOT_TOKEN'),
				middlewares: [session({ store })],
				include: [HelpBotModule],
			}),
			inject: [ConfigService],
		}),
		TaxiBotModule,
	],
	controllers: [AppController],
	providers: [AppService, SettingsService, SocketService],
})
export class AppModule {
	constructor(private readonly settingsService: SettingsService) {}

	async onModuleInit() {
		await this.settingsService.initializeSettings();
	}
}
