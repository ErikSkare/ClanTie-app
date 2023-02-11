// Trpc
import appRouter from "./src/router";

export type AppRouter = typeof appRouter;

// Socket.io
import type {ClientToServerEvents, ServerToClientEvents} from "./src/io";

export type {ClientToServerEvents, ServerToClientEvents};
