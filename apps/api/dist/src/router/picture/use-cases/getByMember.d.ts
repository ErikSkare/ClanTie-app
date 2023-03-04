import { z } from "zod";
import { PrismaClient } from "@prisma/client";
export declare const GetByMemberSchema: z.ZodObject<{
    clanId: z.ZodNumber;
    userId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    userId: number;
    clanId: number;
}, {
    userId: number;
    clanId: number;
}>;
export default function getByMemberUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof GetByMemberSchema>): Promise<{
    pictures: {
        sender: import(".prisma/client").ClanMember & {
            avatarUrl: string;
        };
        id: number;
        key: string;
        senderUserId: number;
        senderClanId: number;
        longitude: import("@prisma/client/runtime").Decimal;
        latitude: import("@prisma/client/runtime").Decimal;
        saved: boolean;
        createdAt: Date;
        imageUrl: string;
    }[];
    offset: number;
    seenAll: boolean;
}>;
