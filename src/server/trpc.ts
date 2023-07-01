import { TRPCError, initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { getAuthDataBySessionId } from "@lib/server";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(async ({ ctx, next }) => {
  const { isAuthed, artist } = await getAuthDataBySessionId(ctx.sessionId);
  if (isAuthed === false || artist === undefined) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "not authorized",
    });
  }

  return next({ ctx: { ...ctx, artistId: artist.artistId } });
});
export const middleware = t.middleware;
