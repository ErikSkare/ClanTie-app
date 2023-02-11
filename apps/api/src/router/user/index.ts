import {router, protectedProcedure} from "@/trpc";
import MeWithMembershipsUseCase from "./use-cases/meWithMemberships";

// Trpc
export default router({
  meWithMemberships: protectedProcedure.query(async ({ctx}) =>
    MeWithMembershipsUseCase(ctx.prisma, ctx.session)
  ),
});
