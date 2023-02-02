// eslint-disable-next-line
require("dotenv").config();
import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "@/router";
import {createContext} from "@/context";

const PORT = 3000;

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({router: appRouter, createContext})
);
app.use(cors());

app.listen(PORT);
