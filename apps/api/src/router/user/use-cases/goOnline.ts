import {PrismaClient} from "@prisma/client";
import {IoType} from "@/io";

export default async function goOnlineUseCase(
  prisma: PrismaClient,
  io: IoType,
  session: number
) {
  await prisma.user.update({where: {id: session}, data: {isActive: true}});

  const clans = await prisma.clan.findMany({
    where: {members: {some: {userId: session}}},
    select: {id: true},
  });

  for (const clan of clans) {
    io.to(`clan-${clan.id}`).emit("user:online", session);
  }
}
