import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { IoType } from "../../../io";
export declare const AcceptInvitationSchema: z.ZodObject<{
    fromId: z.ZodNumber;
    clanId: z.ZodNumber;
    nickname: z.ZodString;
}, "strip", z.ZodTypeAny, {
    clanId: number;
    nickname: string;
    fromId: number;
}, {
    clanId: number;
    nickname: string;
    fromId: number;
}>;
export default function AcceptInvitationUseCase(prisma: PrismaClient, io: IoType, session: number, input: z.infer<typeof AcceptInvitationSchema>): Promise<import("aws-sdk/clients/s3").PresignedPost>;
