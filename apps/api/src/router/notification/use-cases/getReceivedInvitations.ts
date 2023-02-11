import {PrismaClient} from "@prisma/client";

export default async function getReceivedInvitationsUseCase(
  prisma: PrismaClient,
  session: number
) {
  return await prisma.invitation.findMany({
    where: {
      toUserId: session,
    },
    include: {
      fromUser: {select: {id: true, firstName: true, lastName: true}},
      clan: {select: {name: true, id: true}},
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
