// import { Injectable } from '@nestjs/common';
// import { Wizard, WizardStep, Action, Ctx, Message } from 'nestjs-telegraf';
// import {
//   IUserData,
//   IUserRegistrationWizardContext,
// } from '../../interfaces/context.interface';
// import { EScenes, EWizard } from '../../shared/enums';
// import { saveUser } from '../../utils';
// import {
//   Message as TMessage,
//   Update,
// } from 'telegraf/typings/core/types/typegram';
//
// @Injectable()
// @Wizard(EWizard.USER_REGISTRATION)
// export class UserRegistrationWizard {
//   @WizardStep(1)
//   async onSceneEnter(@Ctx() ctx: IUserRegistrationWizardContext) {
//     const { message_id } = (await ctx.editMessageText(
//       'Укажите ваши Фамилию Имя Отчество:',
//     )) as Update.Edited & TMessage.TextMessage;
//     ctx.wizard.state['messageIds'] = [message_id];
//     ctx.wizard.next();
//   }
//
//   @WizardStep(2)
//   async onFullName(
//     @Ctx() ctx: IUserRegistrationWizardContext,
//     @Message() msg: { text: string },
//   ) {
//     const fullName = msg.text;
//     if (fullName.split(' ').length < 2) {
//       const { message_id } = (await ctx.reply(
//         'Пожалуйста, укажите как минимум Фамилию и Имя',
//       )) as Update.Edited & TMessage.TextMessage;
//       ctx.wizard.state['messageIds'] = [message_id];
//       return;
//     }
//     ctx.wizard.state['fullName'] = fullName;
//     ctx.wizard.state['messageIds'].push(ctx.message.message_id);
//     const { message_id } = (await ctx.reply(
//       'Укажите ваш номер телефона в формате +79110101001:',
//     )) as Update.Edited & TMessage.TextMessage;
//     ctx.wizard.state['messageIds'].push(message_id);
//
//     ctx.wizard.next();
//   }
//
//   @WizardStep(3)
//   async onPhoneNumber(
//     @Ctx() ctx: IUserRegistrationWizardContext,
//     @Message() msg: { text: string },
//   ) {
//     const phoneNumber = msg.text;
//     const phoneRegex = /^(?:(?:\+?7|8)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       const { message_id } = (await ctx.reply(
//         'Номер телефона указан не в правильном формате.\n\nПожалуйста, укажите ваш номер телефона в формате +79110101001',
//       )) as Update.Edited & TMessage.TextMessage;
//       ctx.wizard.state['messageIds'].push(message_id);
//       return;
//     }
//     ctx.wizard.state['phoneNumber'] = phoneNumber;
//     ctx.wizard.state['messageIds'].push(ctx.message.message_id);
//
//     const confirmationMessage = Ваши данные:\n\nФИО: ${ctx.wizard.state['fullName']}\nТелефон: ${phoneNumber};
//     const { message_id } = (await ctx.reply(confirmationMessage, {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             { text: '✅ Все верно', callback_data: 'CORRECT' },
//             { text: '❌ Изменить', callback_data: 'CHANGE' },
//           ],
//         ],
//       },
//     })) as Update.Edited & TMessage.TextMessage;
//
//     // remove prev messages
//     await ctx.telegram.deleteMessages(
//       ctx.message.chat.id,
//       ctx.wizard.state['messageIds'],
//     );
//
//     ctx.wizard.state['messageIds'] = [message_id];
//
//     ctx.wizard.next();
//   }
//
//   @Action('CORRECT')
//   async correctAction(
//     @Ctx()
//       ctx: IUserRegistrationWizardContext & {
//       update: Update.CallbackQueryUpdate;
//     },
//   ) {
//     // save user data
//     const telegramData = ctx.update.callback_query.from;
//     const collectedData = ctx.wizard.state as IUserData;
//     const userData = { ...telegramData, ...collectedData };
//     saveUser(userData);
//     // go to next step
//     await ctx.scene.enter(EScenes.FINAL_CONFIRMATION, {
//       userData,
//     });
//   }
//
//   @Action('CHANGE')
//   async changeAction(
//     @Ctx()
//       ctx: IUserRegistrationWizardContext & {
//       update: Update.CallbackQueryUpdate;
//     },
//   ) {
//     const { message_id } = (await ctx.reply(
//       'Укажите ваше Фамилию Имя Отчество:',
//     )) as Update.Edited & TMessage.TextMessage;
//     // remove prev messages
//     await ctx.telegram.deleteMessages(
//       ctx.update.callback_query.message.chat.id,
//       ctx.wizard.state['messageIds'],
//     );
//     ctx.wizard.state['messageIds'] = [message_id];
//
//     ctx.wizard.selectStep(1);
//   }
// }
