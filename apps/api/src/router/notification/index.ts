import {router, protectedProcedure} from "@/trpc";
import getReceivedInvitationsUseCase from "./use-cases/getReceivedInvitations";

// Trpc
export default router({
  getReceivedInvitations: protectedProcedure.query(async ({ctx}) => {
    return await getReceivedInvitationsUseCase(ctx.prisma, ctx.session);
  }),
});
