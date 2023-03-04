import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const GetMessagesSchema: z.ZodObject<{
    clanId: z.ZodNumber;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cursor?: number | null | undefined;
    clanId: number;
    limit: number;
}, {
    cursor?: number | null | undefined;
    limit?: number | undefined;
    clanId: number;
}>;
export default function getMessagesUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof GetMessagesSchema>): Promise<{
    result: {
        sentBy: Omit<{
            user: {
                id: number;
                isActive: boolean;
            };
            nickname: string;
            avatarKey: string;
        }, "avatarKey"> & {
            avatarUrl: string;
        };
        images: {
            url: string;
        }[];
        createdAt: Date;
        content: string | null;
    }[];
    newCursor: number | undefined;
}>;
