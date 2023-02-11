import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {uploadImage} from "@/s3";

export const CreateClanSchema = z.object({
  clanName: z.string(),
  nickname: z.string(),
});

export default async function CreateClanUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof CreateClanSchema>
) {
  const member = await prisma.clanMember.create({
    data: {
      nickname: input.nickname,
      user: {connect: {id: session}},
      clan: {
        create: {
          name: input.clanName,
        },
      },
    },
  });
  return uploadImage(member.avatarKey);
}
