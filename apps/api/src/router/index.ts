import {router} from "@/trpc";
import authRouter from "./auth";
import clanRouter from "./clan";

const appRouter = router({
  auth: authRouter,
  clan: clanRouter,
});

export default appRouter;
