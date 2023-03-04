import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const BroadcastToClanSchema: z.ZodObject<{
    byUserId: z.ZodNumber;
    clanId: z.ZodNumber;
    title: z.ZodString;
    body: z.ZodString;
    data: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    data?: any;
    clanId: number;
    byUserId: number;
    title: string;
    body: string;
}, {
    data?: any;
    clanId: number;
    byUserId: number;
    title: string;
    body: string;
}>;
export default function broadcastToClanUseCase(prisma: PrismaClient, input: z.infer<typeof BroadcastToClanSchema>): Promise<void>;
