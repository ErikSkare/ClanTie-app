import {z} from "zod";
import {PrismaClient, Prisma} from "@prisma/client";
import SocketIo from "socket.io";
import {TRPCError} from "@trpc/server";
import {ValidationError} from "@/router/errors";
import {isUniqueConstraintViolation} from "@/router/utils";

export const InviteSchema = z.object({
  email: z.string().email(),
  clanId: z.number(),
});

export default async function InviteUseCase(
  prisma: PrismaClient,
  io: SocketIo.Server,
  session: number,
  input: z.infer<typeof InviteSchema>
) {
  const toUser = await prisma.user.findUnique({
    where: {email: input.email.toLowerCase()},
    include: {memberships: true, receivedInvitations: true},
  });

  if (
    !toUser || // no user
    toUser.id == session || // trying to invite myself
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
    const newInv = await prisma.invitation.create({
      data: {
        clanId: input.clanId,
        fromUserId: session,
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
        isUniqueConstraintViolation(error, ["fromUserId", "toUserId", "clanId"])
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
}
