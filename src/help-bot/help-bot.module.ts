import { Module } from '@nestjs/common';
import { HelpBotUpdate } from './help-bot.update';

@Module({
	providers: [HelpBotUpdate],
})
export class HelpBotModule {}
