import {router, protectedProcedure} from "@/trpc";
import {uploadImage} from "@/s3";
import {z} from "zod";
import ClanMembers from "./clanMembers";

const clanRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        clanName: z.string(),
        nickname: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const member = await ctx.prisma.clanMember.create({
        data: {
          nickname: input.nickname,
          user: {connect: {id: ctx.session}},
          clan: {
            create: {
              name: input.clanName,
            },
          },
        },
      });
      return uploadImage(member.avatarKey);
    }),
  getAll: protectedProcedure.query(async ({ctx}) => {
    const clanMembersService = ClanMembers(ctx.prisma);
    const clans = await ctx.prisma.clan.findMany({
      where: {
        members: {some: {userId: ctx.session}},
      },
      include: {members: true},
    });
    return clans.map((clan) => {
      return {
        ...clan,
        members: clanMembersService.populateAvatarUrls(clan.members),
      };
    });
  }),
});

export default clanRouter;
