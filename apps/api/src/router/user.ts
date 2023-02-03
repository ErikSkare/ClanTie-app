import {router, protectedProcedure} from "@/trpc";
import {exclude} from "./utils";

const userRouter = router({
  me: protectedProcedure.query(({ctx}) => {
    return exclude(ctx.session, ["password"]);
  }),
});

export default userRouter;
