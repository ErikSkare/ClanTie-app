import { z } from "zod";
import { PrismaClient } from "@prisma/client";
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export default function LoginUseCase(prisma: PrismaClient, input: z.infer<typeof LoginSchema>): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
