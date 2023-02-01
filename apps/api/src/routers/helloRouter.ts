import {router, publicProcedure} from "@/setup/trpc";

const helloRouter = router({
  greeting: publicProcedure.query(() => "Hello Erik!"),
});

export default helloRouter;
