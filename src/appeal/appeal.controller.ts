import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { AppealService } from './appeal.service';
import { SendMessageDto } from './dto/send-message.dto';
import { APPEAL_NOT_FOUND } from './appeal.constants';
import { InjectBot } from 'nestjs-telegraf';
import { BotName } from '../types/bot-name.type';
import { Telegraf } from 'telegraf';
import { HelpBotContext } from '../help-bot/help-bot.context';
import { QueryType } from '../types/query.type';
import { LoggerService } from '../logger/logger.service';
import { OpenAppealKeyboard } from '../help-bot/keyboards/open-appeal.keyboard';
import { successAppeal } from '../taxi-bot/constatnts/message.constants';

@Controller('appeal')
export class AppealController {
	constructor(
		private readonly appealService: AppealService,
		private readonly loggerService: LoggerService,
		@InjectBot(BotName.Help) private readonly helpBot: Telegraf<HelpBotContext>,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateAppealDto) {
		try {
			return this.appealService.create(dto);
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('sendMessage/:id')
	async sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto) {
		try {
			await this.helpBot.telegram.sendMessage(dto.chatId, dto.text);
			return this.appealService.sendMessage(id, dto);
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		try {
			return this.appealService.findById(id);
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@Patch('close/:chatId')
	async closeAppealByChatId(@Param('chatId') chatId: string) {
		try {
			const closedAppeal = await this.appealService.closeAppealByChatId(Number(chatId));
			await this.helpBot.telegram.sendMessage(Number(chatId), successAppeal, {
				parse_mode: 'HTML',
				reply_markup: OpenAppealKeyboard().reply_markup,
			});
			if (!closedAppeal) {
				throw new NotFoundException(APPEAL_NOT_FOUND);
			}
			return closedAppeal;
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@Delete(':id')
	async deleteById(@Param('id') id: string) {
		try {
			const deletedDocument = this.appealService.deleteById(id);
			if (!deletedDocument) {
				throw new NotFoundException(APPEAL_NOT_FOUND);
			}
			return deletedDocument;
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async updateById(@Param('id') id: string, @Body() dto: Partial<CreateAppealDto>) {
		try {
			const updatedDocument = this.appealService.updateById(id, dto);
			if (!updatedDocument) {
				throw new NotFoundException(APPEAL_NOT_FOUND);
			}
			return updatedDocument;
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@HttpCode(200)
	@Post('findByUser/:userId')
	async findByUserId(@Param('userId') userId: string) {
		try {
			return this.appealService.findByUserId(userId);
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@Get('getLimitOrder/:currentPage')
	async getLimitOrder(@Param('currentPage') currentPage: QueryType['currentPage']) {
		try {
			return this.appealService.getLimitAll(currentPage);
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@Post('all')
	async getAllOrder() {
		try {
			return this.appealService.getAll();
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}

	@Get('findByNumberAppeal/:numberAppeal')
	async findByNumberOrder(@Param('numberAppeal') numberAppeal: string) {
		try {
			return this.appealService.findByNumberAppeal(numberAppeal);
		} catch (e) {
			this.loggerService.error('getPriceText: ' + e?.toString());
		}
	}
}
