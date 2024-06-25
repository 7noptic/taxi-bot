import { Module } from '@nestjs/common';
import { AppealController } from './appeal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appeal, AppealSchema } from './appeal.model';
import { AppealService } from './appeal.service';
import { ShortIdModule } from '../short-id/short-id.module';
import { LoggerModule } from '../logger/logger.module';
import { SocketService } from '../socket/socket.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Appeal.name, schema: AppealSchema }]),
		ShortIdModule,
		LoggerModule,
	],
	controllers: [AppealController],
	providers: [AppealService, SocketService],
	exports: [AppealService],
})
export class AppealModule {}
