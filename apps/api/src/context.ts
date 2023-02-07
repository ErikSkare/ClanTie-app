import {PrismaClient} from "@prisma/client";
import {CreateExpressContextOptions} from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import Tokens from "./router/auth/tokens";

export const prisma = new PrismaClient();

export interface UserIdPayload extends jwt.JwtPayload {
  userId: number;
}

export async function createContext({req}: CreateExpressContextOptions) {
  const session = await Tokens.getUser(
    req.headers.authorization?.split(" ")[1],
    process.env.ACCESS_SECRET as string,
    prisma
  );
  return {
    prisma,
    session,
  };
}
