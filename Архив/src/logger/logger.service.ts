import { Injectable, LoggerService as ILoggerService } from '@nestjs/common';
import * as fs from 'fs';
import { LoggerType } from './logger.type';

@Injectable()
export class LoggerService implements ILoggerService {
	log(message: string) {
		this.writeToFile(`[${new Date().toLocaleString()}]: 📢 ` + message, LoggerType.Log);
	}

	error(message: string) {
		this.writeToFile(`[${new Date().toLocaleString()}]: ❌ ` + message, LoggerType.Error);
	}

	warn(message: string) {
		this.writeToFile(`[${new Date().toLocaleString()}]: ⚠️ ` + message, LoggerType.Warn);
	}

	debug(message: string) {
		this.writeToFile(`[${new Date().toLocaleString()}]: 🐞 ` + message, LoggerType.Debug);
	}

	private writeToFile(message: string, loggerType: LoggerType) {
		const filePath = `logs/${loggerType}.txt`;

		fs.access('logs', (err) => {
			if (err && err.code === 'ENOENT') {
				fs.mkdirSync('logs');
			}

			fs.appendFile(filePath, message + '\n', (err) => {
				if (err) {
					console.error('Error writing to file: ', err);
				}
			});
		});
	}
}
