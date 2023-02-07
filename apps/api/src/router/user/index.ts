import {router, protectedProcedure} from "@/trpc";
import ClanMembers from "../clan/clanMembers";

const userRouter = router({
  meWithMemberships: protectedProcedure.query(async ({ctx}) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session,
      },
      include: {
        memberships: true,
      },
    });

    const clanMembersService = ClanMembers(ctx.prisma);
    return {
      ...user,
      memberships: clanMembersService.populateAvatarUrls(user.memberships),
    };
  }),
});

export default userRouter;
