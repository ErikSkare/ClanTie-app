import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const GetCurrentMemberSchema: z.ZodObject<{
    clanId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    clanId: number;
}, {
    clanId: number;
}>;
export default function getCurrentMemberUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof GetCurrentMemberSchema>): Promise<import(".prisma/client").ClanMember & {
    user: import(".prisma/client").User;
} & {
    avatarUrl: string;
}>;
