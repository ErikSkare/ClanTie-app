import {router} from "@/trpc";
import authRouter from "./auth";
import userRouter from "./user";
import clanRouter from "./clan";

const appRouter = router({
  auth: authRouter,
  user: userRouter,
  clan: clanRouter,
});

export default appRouter;
