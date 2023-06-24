import { authProcedure, publicProcedure, router } from "./trpc";

export const appRouter = router({
  ping: publicProcedure.query(async ({ ctx }) => {
    // await new Promise((resolve) =>
    //   setTimeout(() => {
    //     resolve(null);
    //   }, 1000)
    // );
    return "pong";
  }),
  private: authProcedure.query(async ({ctx}) => {
    const artistId = ctx.artistId;
    return artistId;
  })
});

export type AppRouter = typeof appRouter;
