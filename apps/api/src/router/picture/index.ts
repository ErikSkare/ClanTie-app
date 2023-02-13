import {io} from "@/expressApp";
import {router, protectedProcedure} from "@/trpc";
import sendUseCase, {SendSchema} from "./use-cases/send";
import getByIdUseCase, {GetByIdSchema} from "./use-cases/getById";

// Trpc
export default router({
  send: protectedProcedure
    .input(SendSchema)
    .mutation(
      async ({ctx, input}) =>
        await sendUseCase(ctx.prisma, io, ctx.session, input)
    ),
  getById: protectedProcedure
    .input(GetByIdSchema)
    .query(
      async ({ctx, input}) =>
        await getByIdUseCase(ctx.prisma, ctx.session, input)
    ),
});
