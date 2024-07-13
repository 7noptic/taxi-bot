import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.enableCors();
	setupGracefulShutdown({ app });
	await app.listen(3000);
}

bootstrap();
