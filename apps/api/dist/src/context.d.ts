import { PrismaClient } from "@prisma/client";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined>;
export declare function createContext({ req }: CreateExpressContextOptions): Promise<{
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined>;
    session: number | undefined;
}>;
