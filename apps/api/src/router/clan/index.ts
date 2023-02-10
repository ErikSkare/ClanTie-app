import {router, protectedProcedure} from "@/trpc";
import {uploadImage} from "@/s3";
import {z} from "zod";
import {Prisma} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {ValidationError} from "@/router/errors";
import ClanMembers from "./clanMembers";
import {isUniqueConstraintViolation} from "../utils";
import {io} from "../../expressApp";

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
  invite: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        clanId: z.number(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const toUser = await ctx.prisma.user.findUnique({
        where: {email: input.email.toLowerCase()},
        include: {memberships: true, receivedInvitations: true},
      });

      if (
        !toUser || // no user
        toUser.id == ctx.session || // trying to invite myself
        toUser.memberships.some((value) => value.clanId == input.clanId) || // already member
        toUser.receivedInvitations.some((value) => value.clanId == input.clanId) // already invited
      )
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: new ValidationError({
            email: ["A cím nem található!"],
          }),
        });

      try {
        const newInv = await ctx.prisma.invitation.create({
          data: {
            clanId: input.clanId,
            fromUserId: ctx.session,
            toUserId: toUser.id,
          },
          include: {
            fromUser: {select: {id: true, firstName: true, lastName: true}},
            clan: {select: {name: true, id: true}},
          },
        });
        io.to(`user-${newInv.toUserId}`).emit("newInvitation", newInv);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (
            isUniqueConstraintViolation(error, [
              "fromUserId",
              "toUserId",
              "clanId",
            ])
          )
            throw new TRPCError({
              code: "BAD_REQUEST",
              cause: new ValidationError({email: ["A cím nem található!"]}),
            });
        }
      }

      return {
        message: "Meghívás elküldve",
      };
    }),
  declineInvitation: protectedProcedure
    .input(
      z.object({
        fromId: z.number(),
        clanId: z.number(),
      })
    )
    .mutation(async ({input, ctx}) => {
      await ctx.prisma.invitation.delete({
        where: {
          fromUserId_toUserId_clanId: {
            clanId: input.clanId,
            fromUserId: input.fromId,
            toUserId: ctx.session,
          },
        },
      });
      return {message: "success"};
    }),
  acceptInvitation: protectedProcedure
    .input(
      z.object({fromId: z.number(), clanId: z.number(), nickname: z.string()})
    )
    .mutation(async ({input, ctx}) => {
      // eslint-disable-next-line
      const [invitation, member] = await ctx.prisma.$transaction([
        ctx.prisma.invitation.delete({
          where: {
            fromUserId_toUserId_clanId: {
              clanId: input.clanId,
              fromUserId: input.fromId,
              toUserId: ctx.session,
            },
          },
        }),
        ctx.prisma.clanMember.create({
          data: {
            clanId: input.clanId,
            nickname: input.nickname,
            userId: ctx.session,
          },
        }),
      ]);
      return uploadImage(member.avatarKey);
    }),
});

export default clanRouter;
