import {io} from "@/expressApp";
import {IoType} from "@/io";
import {router, protectedProcedure} from "@/trpc";
import getMessagesUseCase, {GetMessagesSchema} from "./use-cases/getMessages";
import SendMessageUseCase, {SendMessageSchema} from "./use-cases/sendMessage";

// Trpc
export default router({
  sendMessage: protectedProcedure
    .input(SendMessageSchema)
    .mutation(
      async ({ctx, input}) =>
        await SendMessageUseCase(ctx.prisma, io, ctx.session, input)
    ),
  getMessages: protectedProcedure
    .input(GetMessagesSchema)
    .query(
      async ({ctx, input}) =>
        await getMessagesUseCase(ctx.prisma, ctx.session, input)
    ),
});

// Socket.io
export function setupChatIo(io: IoType) {
  io.on("connection", (socket) => {
    socket.on("chat:start", (clanId) => socket.join(`chat-${clanId}`));
    socket.on("chat:stop", (clanId) => socket.leave(`chat-${clanId}`));
  });
}
