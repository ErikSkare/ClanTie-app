import {io} from "@/expressApp";
import {router, protectedProcedure} from "@/trpc";
import sendUseCase, {SendSchema} from "./use-cases/send";
import getByMemberUseCase, {GetByMemberSchema} from "./use-cases/getByMember";
import saveToAlbumUseCase, {SaveToAlbumSchema} from "./use-cases/saveToAlbum";

// Trpc
export default router({
  send: protectedProcedure
    .input(SendSchema)
    .mutation(
      async ({ctx, input}) =>
        await sendUseCase(ctx.prisma, io, ctx.session, input)
    ),
  getByMember: protectedProcedure
    .input(GetByMemberSchema)
    .query(
      async ({ctx, input}) =>
        await getByMemberUseCase(ctx.prisma, ctx.session, input)
    ),
  saveToAlbum: protectedProcedure
    .input(SaveToAlbumSchema)
    .mutation(
      async ({ctx, input}) =>
        await saveToAlbumUseCase(ctx.prisma, ctx.session, input)
    ),
});
