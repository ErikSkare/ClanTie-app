import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "@/trpc/router";

const PORT = 3000;

const app = express();

app.use("/trpc", trpcExpress.createExpressMiddleware({router: appRouter}));
app.use(cors());

app.listen(PORT);
