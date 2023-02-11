import {Express} from "express";
import timer from "long-timeout";
import {router, publicProcedure} from "@/trpc";
import {IoType} from "@/io";
import Tokens from "./tokens";
import RegisterUseCase, {RegisterSchema} from "./use-cases/register";
import LoginUseCase, {LoginSchema} from "./use-cases/login";
import AccessUseCase from "./use-cases/access";
import RefreshUseCase from "./use-cases/refresh";

// Trpc
export default router({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({input, ctx}) => RegisterUseCase(ctx.prisma, input)),
  login: publicProcedure
    .input(LoginSchema)
    .mutation(async ({input, ctx}) => LoginUseCase(ctx.prisma, input)),
});

// Express
export function setupAuthRoutes(app: Express) {
  app.post("/refresh", async (req, res) => {
    const result = RefreshUseCase(req.body.refreshToken);
    if (!result) return res.sendStatus(400);
    return res.status(200).json(result);
  });
}

// Socket.io
export function setupAuthIo(io: IoType) {
  type Tokens = {
    accessToken: string;
    refreshToken: string;
  };

  io.use((socket, next) => {
    let tokens: Tokens | undefined = {
      accessToken: socket.handshake.auth.accessToken,
      refreshToken: socket.handshake.auth.refreshToken,
    };

    let userId = AccessUseCase(tokens.accessToken);
    if (!userId) {
      tokens = RefreshUseCase(tokens.refreshToken);
      if (!tokens) return next(new Error("Authentication failed!"));
      socket.emit("newTokens", tokens);
      userId = AccessUseCase(tokens.accessToken);
    }

    socket.data.userId = userId;
    socket.data.refreshToken = tokens.refreshToken;

    return next();
  });
  io.on("connection", (socket) => {
    socket.join(`user-${socket.data.userId}`);

    const interval = timer.setInterval(() => {
      const result = RefreshUseCase(socket.data.refreshToken);
      if (!result) {
        socket.emit("tokensExpired");
        return socket.disconnect(true);
      }
      socket.emit("newTokens", result);
      socket.data.refreshToken = result.refreshToken;
    }, Tokens.getAccessExpirationInMs());

    socket.on("disconnect", () => timer.clearInterval(interval));
  });
}
