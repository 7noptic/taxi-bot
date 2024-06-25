import { Module } from '@nestjs/common';
import { ErrorHandlingService } from './error-handling.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [LoggerModule],
	providers: [ErrorHandlingService],
})
export class ErrorHandlingModule {}
