import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const RemoveTokenSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export default function removeTokenUseCase(prisma: PrismaClient, input: z.infer<typeof RemoveTokenSchema>): Promise<void>;
