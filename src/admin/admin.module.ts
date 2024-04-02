import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
	controllers: [AdminController],
})
export class AdminModule {}
