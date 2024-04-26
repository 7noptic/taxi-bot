import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './driver.model';
import { DriverAdapter } from './driver.adapter';
import { DriverProcessor } from './driver.processor';
import { BullModule } from '@nestjs/bull';
import { QueueType } from '../types/queue.type';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
		BullModule.registerQueue({
			name: QueueType.Order,
		}),
	],
	controllers: [DriverController],
	providers: [DriverService, DriverAdapter, DriverProcessor],
	exports: [DriverService, DriverAdapter],
})
export class DriverModule {}