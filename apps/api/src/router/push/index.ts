import {router, protectedProcedure, publicProcedure} from "@/trpc";
import registerTokenUseCase, {
  RegisterTokenSchema,
} from "./use-cases/registerToken";
import removeTokenUseCase, {RemoveTokenSchema} from "./use-cases/removeToken";

// Trpc
export default router({
  registerToken: protectedProcedure
    .input(RegisterTokenSchema)
    .mutation(
      async ({ctx, input}) =>
        await registerTokenUseCase(ctx.prisma, ctx.session, input)
    ),
  removeToken: publicProcedure
    .input(RemoveTokenSchema)
    .mutation(
      async ({ctx, input}) => await removeTokenUseCase(ctx.prisma, input)
    ),
});
