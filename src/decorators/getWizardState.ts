import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { WizardContext } from 'telegraf/scenes';

export const wizardState = createParamDecorator((data, context: ExecutionContextHost) => {
	const ctx = context.getArgByIndex(0) as WizardContext;
	return ctx.wizard.state;
});
