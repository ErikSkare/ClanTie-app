import {router} from "@/trpc";
import authRouter from "./auth";
import clanRouter from "./clan";
import userRouter from "./user";

const appRouter = router({
  auth: authRouter,
  clan: clanRouter,
  user: userRouter,
});

export default appRouter;
