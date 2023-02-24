import {router} from "@/trpc";
import authRouter from "./auth";
import clanRouter from "./clan";
import userRouter from "./user";
import notificationRouter from "./notification";
import pictureRouter from "./picture";
import pushRouter from "./push";

const appRouter = router({
  auth: authRouter,
  clan: clanRouter,
  user: userRouter,
  notification: notificationRouter,
  picture: pictureRouter,
  push: pushRouter,
});

export default appRouter;
