import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from './settings.model';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }])],
	controllers: [SettingsController],
	providers: [SettingsService, LoggerService],
	exports: [SettingsService],
})
export class SettingsModule {}
