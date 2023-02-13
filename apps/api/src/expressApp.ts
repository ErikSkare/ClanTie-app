// eslint-disable-next-line
require("dotenv").config();
import express from "express";
import cors from "cors";
import http from "http";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "@/router";
import {createContext} from "@/context";
import createIo from "@/io";
import {setupAuthIo, setupAuthRoutes} from "./router/auth";
import {setupClanIo} from "./router/clan";
import {setupUserIo} from "./router/user";

const PORT = 3000;
const app = express();
const httpServer = http.createServer(app);
const io = createIo(httpServer);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({router: appRouter, createContext})
);
app.use(express.json());
app.use(cors());

setupAuthRoutes(app);
setupAuthIo(io);
setupClanIo(io);
setupUserIo(io);

httpServer.listen(PORT);

export {io};
