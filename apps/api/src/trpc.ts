import {initTRPC, TRPCError} from "@trpc/server";
import {createContext} from "@/context";
import errorFormatter from "@/errorFormatter";
import superjson from "superjson";

const trpc = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter,
});

export const router = trpc.router;

export const middleware = trpc.middleware;

export const publicProcedure = trpc.procedure;

const isAuthed = trpc.middleware(({next, ctx}) => {
  if (!ctx.session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "INVALID_TOKEN",
    });
  return next({ctx: {...ctx, session: ctx.session as number}});
});

export const protectedProcedure = trpc.procedure.use(isAuthed);
