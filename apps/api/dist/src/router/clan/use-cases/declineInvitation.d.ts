import { z } from "zod";
import { PrismaClient } from "@prisma/client";
export declare const DeclineInvitationSchema: z.ZodObject<{
    fromId: z.ZodNumber;
    clanId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    clanId: number;
    fromId: number;
}, {
    clanId: number;
    fromId: number;
}>;
export default function DeclineInvitationUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof DeclineInvitationSchema>): Promise<void>;
