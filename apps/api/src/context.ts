import {PrismaClient} from "@prisma/client";
import {CreateExpressContextOptions} from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export interface UserIdPayload extends jwt.JwtPayload {
  userId: number;
}

export async function getUserFromToken(
  token: string | undefined,
  secret: string
) {
  if (!token) return null;

  try {
    const {userId} = <UserIdPayload>jwt.verify(token, secret);
    return prisma.user.findUnique({where: {id: userId}});
  } catch {
    return null;
  }
}

export async function createContext({req}: CreateExpressContextOptions) {
  console.log(req.headers.authorization);

  const session = await getUserFromToken(
    req.headers.authorization?.split(" ")[1],
    process.env.ACCESS_SECRET as string
  );
  return {
    prisma,
    session,
  };
}
