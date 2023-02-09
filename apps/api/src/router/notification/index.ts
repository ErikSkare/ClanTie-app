import {router, protectedProcedure} from "@/trpc";

const notificationRouter = router({
  getReceivedInvitations: protectedProcedure.query(async ({ctx}) => {
    return await ctx.prisma.invitation.findMany({
      where: {
        toUserId: ctx.session,
      },
      include: {
        fromUser: true,
        clan: {select: {name: true, id: true}},
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});

export default notificationRouter;
