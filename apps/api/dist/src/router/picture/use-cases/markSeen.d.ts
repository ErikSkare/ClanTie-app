import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const MarkSeenSchema: z.ZodObject<{
    clanId: z.ZodNumber;
    pictureId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    clanId: number;
    pictureId: number;
}, {
    clanId: number;
    pictureId: number;
}>;
export default function markSeenUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof MarkSeenSchema>): Promise<{
    message: string;
}>;
