import appRouter from "./src/router";
import type {ClientToServerEvents, ServerToClientEvents} from "./src/events";

export type AppRouter = typeof appRouter;

export type {ClientToServerEvents, ServerToClientEvents};
