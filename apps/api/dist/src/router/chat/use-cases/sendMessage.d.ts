import { IoType } from "../../../io";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const SendMessageSchema: z.ZodObject<{
    clanId: z.ZodNumber;
    hasImage: z.ZodBoolean;
    content: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    clanId: number;
    content: string | null;
    hasImage: boolean;
}, {
    clanId: number;
    content: string | null;
    hasImage: boolean;
}>;
export default function SendMessageUseCase(prisma: PrismaClient, io: IoType, session: number, input: z.infer<typeof SendMessageSchema>): Promise<{
    upload: import("aws-sdk/clients/s3").PresignedPost | undefined;
}>;
