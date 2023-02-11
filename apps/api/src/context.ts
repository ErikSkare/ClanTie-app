import {PrismaClient} from "@prisma/client";
import {CreateExpressContextOptions} from "@trpc/server/adapters/express";
import AccessUseCase from "./router/auth/use-cases/access";

export const prisma = new PrismaClient();

export async function createContext({req}: CreateExpressContextOptions) {
  const session = AccessUseCase(req.headers.authorization?.split(" ")[1]);
  return {
    prisma,
    session,
  };
}
