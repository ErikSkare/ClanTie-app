import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const SaveToAlbumSchema: z.ZodObject<{
    pictureId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    pictureId: number;
}, {
    pictureId: number;
}>;
export default function toggleSavedUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof SaveToAlbumSchema>): Promise<{
    message: string;
}>;
