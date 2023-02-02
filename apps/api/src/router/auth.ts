import {router, publicProcedure} from "@/trpc";
import {z} from "zod";
import {Prisma} from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {isUniqueConstraintViolation} from "./utils";
import {TRPCError} from "@trpc/server";
import {ValidationError} from "./errors";

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

async function checkPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function genTokens(userId: number) {
  const accessToken = jwt.sign({userId}, process.env.JWT_SECRET as string, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign({userId}, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  return {
    accessToken,
    refreshToken,
  };
}

const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            password: await hashPassword(input.password),
          },
        });

        return genTokens(user.id);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (isUniqueConstraintViolation(error, "email")) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              cause: new ValidationError({
                email: ["A cím már regisztrálva van!"],
              }),
            });
          }
        }
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      const user = await ctx.prisma.user.findUnique({
        where: {email: input.email},
      });
      if (!user)
        throw new TRPCError({code: "BAD_REQUEST", message: "Hibás adatok!"});

      const isPasswordsMatching = await checkPassword(
        input.password,
        user.password
      );
      if (!isPasswordsMatching)
        throw new TRPCError({code: "BAD_REQUEST", message: "Hibás adatok!"});

      return genTokens(user.id);
    }),
});

export default authRouter;
