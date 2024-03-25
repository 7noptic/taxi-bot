import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
import { CityModule } from '../city/city.module';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [UserModule, OrderModule, CityModule, AuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
