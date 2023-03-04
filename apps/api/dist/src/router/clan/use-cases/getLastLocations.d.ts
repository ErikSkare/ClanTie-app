import { z } from "zod";
import { PrismaClient } from "@prisma/client";
export declare const GetLastLocationsSchema: z.ZodObject<{
    clanId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    clanId: number;
}, {
    clanId: number;
}>;
export default function GetLastLocationsUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof GetLastLocationsSchema>): Promise<{
    lastPosition: {
        longitude: number | undefined;
        latitude: number | undefined;
        when: Date | undefined;
    };
    userId: number;
    user: import(".prisma/client").User;
    createdAt: Date;
    clanId: number;
    nickname: string;
    avatarKey: string;
    avatarUrl: string;
}[]>;
