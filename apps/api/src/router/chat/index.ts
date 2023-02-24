import {router, protectedProcedure} from "@/trpc";
import getMessagesUseCase, {GetMessagesSchema} from "./use-cases/getMessages";
import SendMessageUseCase, {SendMessageSchema} from "./use-cases/sendMessage";

export default router({
  sendMessage: protectedProcedure
    .input(SendMessageSchema)
    .mutation(
      async ({ctx, input}) =>
        await SendMessageUseCase(ctx.prisma, ctx.session, input)
    ),
  getMessages: protectedProcedure
    .input(GetMessagesSchema)
    .query(
      async ({ctx, input}) =>
        await getMessagesUseCase(ctx.prisma, ctx.session, input)
    ),
});
