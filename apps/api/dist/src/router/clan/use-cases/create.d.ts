import { z } from "zod";
import { PrismaClient } from "@prisma/client";
export declare const CreateClanSchema: z.ZodObject<{
    clanName: z.ZodString;
    nickname: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nickname: string;
    clanName: string;
}, {
    nickname: string;
    clanName: string;
}>;
export default function CreateClanUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof CreateClanSchema>): Promise<import("aws-sdk/clients/s3").PresignedPost>;
