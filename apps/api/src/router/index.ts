import {router} from "@/trpc";
import authRouter from "./auth";
import clanRouter from "./clan";
import userRouter from "./user";
import notificationRouter from "./notification";

const appRouter = router({
  auth: authRouter,
  clan: clanRouter,
  user: userRouter,
  notification: notificationRouter,
});

export default appRouter;
