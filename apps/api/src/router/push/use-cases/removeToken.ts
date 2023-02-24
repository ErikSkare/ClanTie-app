import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {z} from "zod";

export const RemoveTokenSchema = z.object({token: z.string()});

export default async function removeTokenUseCase(
  prisma: PrismaClient,
  input: z.infer<typeof RemoveTokenSchema>
) {
  try {
    await prisma.device.delete({
      where: {pushToken: input.token},
    });
  } catch (err) {
    throw new TRPCError({code: "BAD_REQUEST"});
  }
}
