import {router, protectedProcedure} from "@/trpc";
import {io} from "../../expressApp";
import {IoType} from "@/io";
import CreateClanUseCase, {CreateClanSchema} from "./use-cases/create";
import GetAllClansUseCase from "./use-cases/getAll";
import InviteUseCase, {InviteSchema} from "./use-cases/invite";
import DeclineInvitationUseCase, {
  DeclineInvitationSchema,
} from "./use-cases/declineInvitation";
import AcceptInvitationUseCase, {
  AcceptInvitationSchema,
} from "./use-cases/acceptInvitation";
import getByIdUseCase, {GetByIdSchema} from "./use-cases/getById";
import GetLastLocationsUseCase, {
  GetLastLocationsSchema,
} from "./use-cases/getLastLocations";
import getCurrentMemberUseCase, {
  GetCurrentMemberSchema,
} from "./use-cases/getCurrentMember";

// Trpc
export default router({
  create: protectedProcedure
    .input(CreateClanSchema)
    .mutation(async ({input, ctx}) =>
      CreateClanUseCase(ctx.prisma, ctx.session, input)
    ),
  getAll: protectedProcedure.query(async ({ctx}) =>
    GetAllClansUseCase(ctx.prisma, ctx.session)
  ),
  getById: protectedProcedure
    .input(GetByIdSchema)
    .query(async ({ctx, input}) =>
      getByIdUseCase(ctx.prisma, ctx.session, input)
    ),
  invite: protectedProcedure
    .input(InviteSchema)
    .mutation(async ({input, ctx}) =>
      InviteUseCase(ctx.prisma, io, ctx.session, input)
    ),
  declineInvitation: protectedProcedure
    .input(DeclineInvitationSchema)
    .mutation(async ({input, ctx}) =>
      DeclineInvitationUseCase(ctx.prisma, ctx.session, input)
    ),
  acceptInvitation: protectedProcedure
    .input(AcceptInvitationSchema)
    .mutation(async ({input, ctx}) =>
      AcceptInvitationUseCase(ctx.prisma, ctx.session, input)
    ),
  getLastLocations: protectedProcedure
    .input(GetLastLocationsSchema)
    .query(
      async ({input, ctx}) =>
        await GetLastLocationsUseCase(ctx.prisma, ctx.session, input)
    ),
  getCurrentMember: protectedProcedure
    .input(GetCurrentMemberSchema)
    .query(
      async ({input, ctx}) =>
        await getCurrentMemberUseCase(ctx.prisma, ctx.session, input)
    ),
});

// Socket.io
export function setupClanIo(io: IoType) {
  io.on("connection", (socket) => {
    socket.on("clan:start", (clanId) => {
      socket.join(`clan-${clanId}`);
    });
    socket.on("clan:stop", (clanId) => {
      socket.leave(`clan-${clanId}`);
    });
    socket.on("clan:joined", (clanId) => {
      io.to(`clan-${clanId}`).emit("clan:new-member");
    });
  });
}
