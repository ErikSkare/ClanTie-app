// eslint-disable-next-line
require("dotenv").config();
import express from "express";
import cors from "cors";
import http from "http";
import socketIo from "socket.io";
import timer from "long-timeout";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "@/router";
import {createContext} from "@/context";
import Tokens from "@/router/auth/tokens";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
} from "./events";

const PORT = 3000;

// Http
const app = express();
const httpServer = http.createServer(app);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({router: appRouter, createContext})
);
app.use(express.json());
app.use(cors());

app.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken as string;

  const userId = Tokens.getUserId(
    refreshToken,
    process.env.REFRESH_SECRET as string
  );

  if (!userId) return res.sendStatus(400);
  return res.status(200).json(Tokens.generate(userId));
});

// Socket Io
interface SocketData {
  userId: number;
  refreshToken: string;
}

const io = new socketIo.Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer);

io.use((socket, next) => {
  if (!socket.handshake.auth.accessToken || !socket.handshake.auth.refreshToken)
    return next(new Error("Authentication failed!"));
  const userId = Tokens.getUserId(
    socket.handshake.auth.accessToken as string,
    process.env.ACCESS_SECRET as string
  );

  if (!userId) return next(new Error("Authentication failed!"));
  socket.data.userId = userId;
  socket.data.refreshToken = socket.handshake.auth.refreshToken;

  return next();
}).on("connection", (socket) => {
  // eslint-disable-next-line
  socket.join(`user-${socket.data.userId}`);

  const interval = timer.setInterval(() => {
    const refreshToken = socket.data.refreshToken;
    const userId = Tokens.getUserId(
      refreshToken,
      process.env.REFRESH_SECRET as string
    );

    if (!userId) return socket.disconnect(true);
    const newTokens = Tokens.generate(userId);
    socket.emit("newTokens", newTokens);
    socket.data.refreshToken = newTokens.refreshToken;
  }, Tokens.getAccessExpirationInMs());

  socket.on("disconnect", () => timer.clearInterval(interval));
});

// -----
httpServer.listen(PORT);

export {io};
