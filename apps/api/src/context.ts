import {PrismaClient} from "@prisma/client";
import {CreateExpressContextOptions} from "@trpc/server/adapters/express";
import {CreateFastifyContextOptions} from "@trpc/server/adapters/fastify";
import jwt from "jsonwebtoken";
import Tokens from "./router/auth/tokens";

export const prisma = new PrismaClient();

export interface UserIdPayload extends jwt.JwtPayload {
  userId: number;
}

export async function createContext({
  req,
}: CreateFastifyContextOptions | CreateExpressContextOptions) {
  const session = Tokens.getUserId(
    req.headers.authorization?.split(" ")[1],
    process.env.ACCESS_SECRET as string
  );
  return {
    prisma,
    session,
  };
}
