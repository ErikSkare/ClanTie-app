import {router, publicProcedure} from "@/trpc";
import {TRPCError} from "@trpc/server";
import {Prisma} from "@prisma/client";
import {z} from "zod";
import {isUniqueConstraintViolation} from "@/router/utils";
import {ValidationError} from "@/router/errors";
import Tokens from "./tokens";
import Passwords from "./passwords";

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
            email: input.email.toLowerCase(),
            firstName: input.firstName,
            lastName: input.lastName,
            password: await Passwords.hash(input.password),
          },
        });

        return Tokens.generate(user.id);
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
    }),
});

export default authRouter;
