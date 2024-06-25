import { ArgumentsHost, ExceptionFilter, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ErrorHandlingService implements ExceptionFilter {
	constructor(private readonly loggerService: LoggerService) {}

	catch(error: Error, host: ArgumentsHost) {
		console.error('Uncaught Exception:', error, host);

		this.loggerService.error(error.toString() + host.toString());
	}
}
