import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.model';
import { AdminService } from './admin.service';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
	controllers: [AdminController],
	providers: [AdminService, LoggerService],
	exports: [AdminService],
})
export class AdminModule {}
