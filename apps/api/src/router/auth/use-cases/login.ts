import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {PrismaClient} from "@prisma/client";
import Passwords from "../passwords";
import Tokens from "../tokens";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function LoginUseCase(
  prisma: PrismaClient,
  input: z.infer<typeof LoginSchema>
) {
  const user = await prisma.user.findUnique({
    where: {email: input.email.toLowerCase()},
  });

  if (!user)
    throw new TRPCError({code: "BAD_REQUEST", message: "Hibás adatok!"});

  const isPasswordsMatching = await Passwords.verify(
    input.password,
    user.password
  );

  if (!isPasswordsMatching)
    throw new TRPCError({code: "BAD_REQUEST", message: "Hibás adatok!"});

  return Tokens.generate(user.id);
}
