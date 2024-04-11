import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Context } from 'telegraf';

export const userInfo = createParamDecorator((data, context: ExecutionContextHost) => {
	const ctx = context.getArgByIndex(0) as Context;
	// @ts-ignore
	return ctx.update.callback_query?.from || ctx.update.message?.from;
});
