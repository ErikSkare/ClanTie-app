// eslint-disable-next-line
require("dotenv").config();
import fastify from "fastify";
import cors from "@fastify/cors";
import {fastifyTRPCPlugin} from "@trpc/server/adapters/fastify";
import appRouter from "@/router";
import {createContext} from "@/context";
import Tokens from "@/router/auth/tokens";

const PORT = 3000;

const server = fastify({
  maxParamLength: 5000,
  logger: true,
});

server.register(cors);

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {router: appRouter, createContext},
});

server.post("/refresh", async (req, res) => {
  const refreshToken = (req.body as {refreshToken: string}).refreshToken;
  const userId = Tokens.getUserId(
    refreshToken,
    process.env.REFRESH_SECRET as string
  );
  if (!userId) return res.status(400);
  return res.status(200).send(Tokens.generate(userId));
});

(async () => {
  try {
    await server.listen({port: PORT, host: "192.168.1.71"});
    console.log(`Server is listening on port ${PORT}!`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
