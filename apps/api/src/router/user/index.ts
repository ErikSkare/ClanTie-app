import {router, protectedProcedure} from "@/trpc";
import {IoType} from "@/io";
import MeWithMembershipsUseCase from "./use-cases/meWithMemberships";
import goOnlineUseCase from "./use-cases/goOnline";
import {prisma} from "@/context";
import goOfflineUseCase from "./use-cases/goOffline";

// Trpc
export default router({
  meWithMemberships: protectedProcedure.query(async ({ctx}) =>
    MeWithMembershipsUseCase(ctx.prisma, ctx.session)
  ),
});

// Socket.io
export function setupUserIo(io: IoType) {
  const socketCnt = new Map<number, number>();

  prisma.user.updateMany({data: {isActive: false}});

  io.on("connection", (socket) => {
    const userId = socket.data.userId as number;

    socketCnt.set(userId, (socketCnt.get(userId) ?? 0) + 1);
    goOnlineUseCase(prisma, io, userId as number);

    socket.on("disconnect", () => {
      socketCnt.set(userId, (socketCnt.get(userId) ?? 0) - 1);
      if (socketCnt.get(userId) == 0) {
        goOfflineUseCase(prisma, io, socket.data.userId as number);
      }
    });
  });
}
