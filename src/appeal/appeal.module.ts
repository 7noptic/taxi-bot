import { Module } from '@nestjs/common';
import { AppealController } from './appeal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appeal, AppealSchema } from './appeal.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: Appeal.name, schema: AppealSchema }])],
	controllers: [AppealController],
})
export class AppealModule {}
