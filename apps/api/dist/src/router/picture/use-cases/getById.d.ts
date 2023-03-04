import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const GetByIdSchema: z.ZodObject<{
    pictureId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    pictureId: number;
}, {
    pictureId: number;
}>;
export default function getByIdUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof GetByIdSchema>): Promise<{
    sender: import(".prisma/client").ClanMember & {
        clan: import(".prisma/client").Clan & {
            members: {
                userId: number;
            }[];
        };
    } & {
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
}>;
