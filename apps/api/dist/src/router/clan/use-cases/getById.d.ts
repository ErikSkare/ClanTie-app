import { z } from "zod";
import { PrismaClient } from "@prisma/client";
export declare const GetByIdSchema: z.ZodObject<{
    clanId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    clanId: number;
}, {
    clanId: number;
}>;
export default function getByIdUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof GetByIdSchema>): Promise<{
    members: {
        content: {
            hasNew: boolean;
            hasAny: boolean;
        };
        userId: number;
        user: import(".prisma/client").User;
        createdAt: Date;
        clanId: number;
        nickname: string;
        avatarKey: string;
        avatarUrl: string;
    }[];
    id: number;
    name: string;
    createdAt: Date;
}>;
