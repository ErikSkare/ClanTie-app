import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {IoType} from "@/io";
import {uploadImage} from "@/s3";
import broadcastToClanUseCase from "@/router/push/use-cases/broadcastToClan";

export const SendSchema = z.object({
  clanId: z.number(),
  longitude: z.number(),
  latitude: z.number(),
});

export default async function sendUseCase(
  prisma: PrismaClient,
  io: IoType,
  session: number,
  input: z.infer<typeof SendSchema>
) {
  const candidate = await prisma.picture.create({
    data: {
      senderUserId: session,
      senderClanId: input.clanId,
      latitude: input.latitude,
      longitude: input.longitude,
    },
    include: {sender: {include: {clan: true}}},
  });

  io.to(`clan-${input.clanId}`).emit("clan:user-picture", session);

  broadcastToClanUseCase(prisma, {
    byUserId: session,
    clanId: input.clanId,
    title: candidate.sender.clan.name,
    body: `${candidate.sender.nickname} új képet küldött!`,
    data: {clanId: candidate.senderClanId, userId: candidate.senderUserId},
  });

  return uploadImage(candidate.key);
}
