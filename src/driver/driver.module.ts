import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './driver.model';
import { DriverAdapter } from './driver.adapter';

@Module({
	imports: [MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }])],
	controllers: [DriverController],
	providers: [DriverService, DriverAdapter],
	exports: [DriverService, DriverAdapter],
})
export class DriverModule {}
