import {router, protectedProcedure} from "@/trpc";
import {uploadImage} from "@/s3";
import {z} from "zod";
import Clans from "./clans";

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
          user: {connect: {id: ctx.session.id}},
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
    const clansService = Clans(ctx.prisma);
    const clans = await ctx.prisma.clan.findMany({
      where: {
        members: {some: {userId: ctx.session.id}},
      },
      include: {members: true},
    });
    return Promise.all(
      clans.map((clan) => clansService.populateMemberAvatarUrls(clan))
    );
  }),
});

export default clanRouter;
