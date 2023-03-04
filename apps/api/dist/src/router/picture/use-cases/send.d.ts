import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { IoType } from "../../../io";
export declare const SendSchema: z.ZodObject<{
    clanId: z.ZodNumber;
    longitude: z.ZodNumber;
    latitude: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    clanId: number;
    longitude: number;
    latitude: number;
}, {
    clanId: number;
    longitude: number;
    latitude: number;
}>;
export default function sendUseCase(prisma: PrismaClient, io: IoType, session: number, input: z.infer<typeof SendSchema>): Promise<import("aws-sdk/clients/s3").PresignedPost>;
