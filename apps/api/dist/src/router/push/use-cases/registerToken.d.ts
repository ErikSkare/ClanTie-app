import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const RegisterTokenSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export default function registerTokenUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof RegisterTokenSchema>): Promise<{
    message: string;
} | undefined>;
