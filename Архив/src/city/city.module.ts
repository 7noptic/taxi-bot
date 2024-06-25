import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './city.model';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: City.name, schema: CitySchema }])],
	controllers: [CityController],
	providers: [CityService, LoggerService],
	exports: [CityService],
})
export class CityModule {}
