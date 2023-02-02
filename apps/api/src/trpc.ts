import {initTRPC} from "@trpc/server";
import {createContext} from "@/context";
import errorFormatter from "@/errorFormatter";

const trpc = initTRPC.context<typeof createContext>().create({
  errorFormatter,
});

export const router = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;
