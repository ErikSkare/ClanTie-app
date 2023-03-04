import { z } from "zod";
import { PrismaClient } from "@prisma/client";
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}>;
export default function RegisterUseCase(prisma: PrismaClient, input: z.infer<typeof RegisterSchema>): Promise<{
    accessToken: string;
    refreshToken: string;
} | undefined>;
