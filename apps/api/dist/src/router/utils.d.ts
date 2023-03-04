import { Prisma } from "@prisma/client";
export type UniqueConstraintViolationError = Prisma.PrismaClientKnownRequestError & {
    meta: {
        target: string[];
    };
};
export declare function isUniqueConstraintViolation(error: Prisma.PrismaClientKnownRequestError, key: string[]): boolean;
export declare function exclude<ObjectType, Key extends keyof ObjectType>(object: ObjectType, keys: Key[]): Omit<ObjectType, Key>;
