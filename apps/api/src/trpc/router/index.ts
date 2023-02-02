import {router} from "@/trpc/trpc";
import helloRouter from "@/trpc/router/hello";

const appRouter = router({
  hello: helloRouter,
});

export default appRouter;
