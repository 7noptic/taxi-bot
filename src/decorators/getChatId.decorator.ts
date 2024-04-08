import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Context } from 'telegraf';

export const ChatId = createParamDecorator((data, context: ExecutionContextHost) => {
	const ctx = context.getArgByIndex(0) as Context;
	// @ts-ignore
	return ctx.message?.from?.id || ctx?.update?.message?.from.id;
});
