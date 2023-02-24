import {isUniqueConstraintViolation} from "@/router/utils";
import {Prisma, PrismaClient} from "@prisma/client";
import {z} from "zod";

export const RegisterTokenSchema = z.object({token: z.string()});

export default async function registerTokenUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof RegisterTokenSchema>
) {
  try {
    await prisma.device.create({
      data: {userId: session, pushToken: input.token},
    });
    return {message: "success"};
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (isUniqueConstraintViolation(error, ["userId", "pushToken"])) {
        return {message: "already registered!"};
      }
    }
  }
}
