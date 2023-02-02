import {router, publicProcedure} from "@/trpc/trpc";

const helloRouter = router({
  greeting: publicProcedure.query(() => "Hello Erik!"),
});

export default helloRouter;
