import {router} from "@/setup/trpc";
import helloRouter from "@/routers/helloRouter";

const appRouter = router({
  hello: helloRouter,
});

export default appRouter;
