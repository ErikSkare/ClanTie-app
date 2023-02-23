import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {IoType} from "@/io";
import {uploadImage} from "@/s3";

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
  });

  io.to(`clan-${input.clanId}`).emit("clan:user-picture", session);

  return uploadImage(candidate.key);
}
