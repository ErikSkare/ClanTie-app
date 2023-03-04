import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { IoType } from "../../../io";
export declare const InviteSchema: z.ZodObject<{
    email: z.ZodString;
    clanId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    email: string;
    clanId: number;
}, {
    email: string;
    clanId: number;
}>;
export default function InviteUseCase(prisma: PrismaClient, io: IoType, session: number, input: z.infer<typeof InviteSchema>): Promise<void>;
