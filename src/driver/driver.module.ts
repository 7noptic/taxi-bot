import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './driver.model';
import { DriverAdapter } from './driver.adapter';
import { BullModule } from '@nestjs/bull';
import { QueueType } from '../types/queue.type';
import { OrderProcessor } from './processor/order.processor';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [
		LoggerModule,
		MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
		BullModule.registerQueue({
			name: QueueType.Order,
		}),
	],
	controllers: [DriverController],
	providers: [DriverService, DriverAdapter, OrderProcessor, LoggerService],
	exports: [DriverService, DriverAdapter],
})
export class DriverModule {}
