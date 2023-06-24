import { meRouter } from "./routes/me";
import { authProcedure, publicProcedure, router } from "./trpc";

export const appRouter = router({
  ping: publicProcedure.query(async ({ ctx }) => {
    return "pong";
  }),
  private: authProcedure.query(async ({ctx}) => {
    const artistId = ctx.artistId;
    return artistId;
  }),
  me: meRouter,
});

export type AppRouter = typeof appRouter;
