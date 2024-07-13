import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { ScenesType } from './scenes.type';
import { TaxiBotCommonUpdate } from '../updates/common.update';
import { TaxiBotValidation } from '../taxi-bot.validation';
import { addReviewText, errorEditInfo, successAddReview } from '../constatnts/message.constants';
import { TaxiBotContext } from '../taxi-bot.context';
import { ChatId } from '../../decorators/getChatId.decorator';
import { CreateReviewDto } from '../../review/dto/create-review.dto';
import { AddReviewContext } from '../contexts/add-review.context';
import { ReviewService } from '../../review/review.service';
import { wizardState } from '../../decorators/getWizardState';
import { commonButtons } from '../buttons/common.buttons';
import { LoggerService } from '../../logger/logger.service';

@Wizard(ScenesType.AddReview)
export class AddReviewScene {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly taxiBotService: TaxiBotCommonUpdate,
		private readonly taxiBotValidation: TaxiBotValidation,
		private readonly loggerService: LoggerService,
	) {}

	@WizardStep(1)
	async onSceneEnter(
		@Ctx() ctx: WizardContext & TaxiBotContext & AddReviewContext,
	): Promise<string> {
		try {
			ctx.wizard.state.to = ctx.session.addReview.to;
			ctx.wizard.state.numberOrder = ctx.session.addReview.numberOrder;
			ctx?.wizard?.next();
			return addReviewText;
		} catch (e) {
			this.loggerService.error('onSceneEnter: ' + ctx?.toString() + e?.toString());
		}
	}

	@On('text')
	@WizardStep(2)
	async onName(
		@Ctx() ctx: WizardContext & TaxiBotContext & AddReviewContext,
		@Message() msg: { text: string },
		@ChatId() chatId: number,
		@wizardState() state: AddReviewContext['wizard']['state'],
	): Promise<string> {
		try {
			const valid = this.taxiBotValidation.checkMaxMinLengthString(msg.text, 2, 3000);
			if (valid === true) {
				await ctx?.scene?.leave();
				const dto: CreateReviewDto = {
					from: chatId,
					to: state.to,
					orderId: state.numberOrder,
					text: msg.text,
				};
				await this.reviewService.createReview(dto);
				await ctx
					.replyWithHTML(successAddReview)
					.catch((e) => this.loggerService.error('onName: ' + ctx?.toString() + e?.toString()));
				return;
			}
			await ctx
				.replyWithHTML(valid)
				.catch((e) => this.loggerService.error('onName: ' + ctx?.toString() + e?.toString()));
			return;
		} catch (e) {
			await ctx?.scene?.leave();
			await ctx
				.replyWithHTML(errorEditInfo)
				.catch((e) => this.loggerService.error('onName: ' + ctx?.toString() + e?.toString()));
			return '';
		}
	}

	@Hears(commonButtons.back)
	async goHome(@Ctx() ctx: TaxiBotContext, @ChatId() chatId: number) {
		try {
			await this.taxiBotService
				.goHome(ctx, chatId)
				.catch((e) => this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString()));
		} catch (e) {
			this.loggerService.error('goHome: ' + ctx?.toString() + e?.toString());
		}
	}
}
