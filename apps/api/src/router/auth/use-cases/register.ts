import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {PrismaClient, Prisma} from "@prisma/client";
import {isUniqueConstraintViolation} from "@/router/utils";
import {ValidationError} from "@/router/errors";
import Passwords from "../passwords";
import Tokens from "../tokens";

export const RegisterSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

export default async function RegisterUseCase(
  prisma: PrismaClient,
  input: z.infer<typeof RegisterSchema>
) {
  try {
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        firstName: input.firstName,
        lastName: input.lastName,
        password: await Passwords.hash(input.password),
      },
    });
    return Tokens.generate(user.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (isUniqueConstraintViolation(error, ["email"])) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: new ValidationError({
            email: ["A cím már regisztrálva van!"],
          }),
        });
      }
    }
  }
}
