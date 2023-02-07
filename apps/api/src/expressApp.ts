// eslint-disable-next-line
require("dotenv").config();
import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "@/router";
import {createContext} from "@/context";
import Tokens from "@/router/auth/tokens";
import {prisma} from "./context";

const PORT = 3000;

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({router: appRouter, createContext})
);
app.use(express.json());
app.use(cors());

app.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken as string;

  const user = await Tokens.getUser(
    refreshToken,
    process.env.REFRESH_SECRET as string,
    prisma
  );

  if (!user) return res.sendStatus(400);
  return res.status(200).json(Tokens.generate(user.id));
});

app.listen(PORT);
