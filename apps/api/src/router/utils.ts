import {Prisma} from "@prisma/client";

export type UniqueConstraintViolationError =
  Prisma.PrismaClientKnownRequestError & {
    meta: {
      target: string[];
    };
  };

export function isUniqueConstraintViolation(
  error: Prisma.PrismaClientKnownRequestError,
  key: string[]
) {
  const isUniqueConstraintViolation = error.code == "P2002";
  if (!isUniqueConstraintViolation) return false;

  const castedError = error as UniqueConstraintViolationError;
  let isViolationWithKey = true;
  for (const curr of key)
    isViolationWithKey &&= castedError.meta.target.includes(curr);
  return isViolationWithKey;
}

export function exclude<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  keys: Key[]
): Omit<ObjectType, Key> {
  for (const key of keys) {
    delete object[key];
  }
  return object;
}
