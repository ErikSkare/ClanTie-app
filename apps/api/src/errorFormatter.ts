import {DefaultErrorShape, TRPCError} from "@trpc/server";
import {ZodError} from "zod";
import {ValidationError} from "@/router/errors";

export function transformZodError(error: ZodError) {
  const {fieldErrors} = error.flatten();

  return new ValidationError(fieldErrors);
}

export default function errorFormatter({
  shape,
  error,
}: {
  shape: DefaultErrorShape;
  error: TRPCError;
}) {
  let transformedError;
  if (error.cause instanceof ZodError)
    transformedError = transformZodError(error.cause);
  else transformedError = error.cause;

  return {
    ...shape,
    data: {
      ...shape.data,
      fieldErrors:
        error.code == "BAD_REQUEST" &&
        transformedError instanceof ValidationError
          ? transformedError.fieldErrors
          : null,
    },
  };
}
