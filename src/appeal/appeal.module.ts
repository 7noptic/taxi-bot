import { Module } from '@nestjs/common';
import { AppealController } from './appeal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appeal, AppealSchema } from './appeal.model';
import { AppealService } from './appeal.service';
import { ShortIdModule } from '../short-id/short-id.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Appeal.name, schema: AppealSchema }]),
		ShortIdModule,
	],
	controllers: [AppealController],
	providers: [AppealService],
})
export class AppealModule {}
