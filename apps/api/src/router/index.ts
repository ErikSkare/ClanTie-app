import {router} from "@/trpc";
import authRouter from "./auth";

const appRouter = router({
  auth: authRouter,
});

export default appRouter;
