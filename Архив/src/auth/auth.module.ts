import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../configs/jwt.strategy';
import { LoggerService } from '../logger/logger.service';

@Module({
	imports: [
		AdminModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
		PassportModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, LoggerService],
})
export class AuthModule {}
