import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { BotName } from '../types/bot-name.type';

@Update()
export class HelpBotUpdate {
	constructor(@InjectBot(BotName.Help) private readonly helpBot: Telegraf<Context>) {}

	@Start()
	async start(@Ctx() ctx: Context) {
		await ctx.reply('test');
	}
}
