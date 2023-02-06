import {router, protectedProcedure} from "@/trpc";
import {uploadImage} from "@/s3";
import {z} from "zod";

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
});

export default clanRouter;
