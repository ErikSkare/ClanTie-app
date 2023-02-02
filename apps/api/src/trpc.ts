import {initTRPC} from "@trpc/server";
import {createContext} from "@/context";
import {transformZodError, ValidationError} from "@/router/errors";
import {ZodError} from "zod";

const trpc = initTRPC.context<typeof createContext>().create({
  errorFormatter({shape, error}) {
    console.log(error.cause instanceof ValidationError);

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
  },
});

export const router = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;
