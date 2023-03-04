import { PrismaClient } from "@prisma/client";
import { z } from "zod";
export declare const GetAlbumPicturesSchema: z.ZodObject<{
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
export default function getAlbumPicturesUseCase(prisma: PrismaClient, session: number, input: z.infer<typeof GetAlbumPicturesSchema>): Promise<{
    result: (import(".prisma/client").Picture & {
        imageUrl: string;
    })[];
    newCursor: number | undefined;
}>;
