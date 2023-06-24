import { createArt, deleteArt, updateArt } from "@lib/server";
import { authProcedure, router } from "@server/trpc";
import { z } from "zod";

export const artRouter = router({
  create: authProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        imageCount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, imageCount } = input;
      const artistId = ctx.artistId;
      const { signedUrls, artId } = await createArt(
        name,
        description,
        artistId,
        imageCount
      );

      return { signedUrls, artId, artistId };
    }),
  update: authProcedure
    .input(
      z.object({
        artId: z.string(),
        name: z.string(),
        description: z.string(),
        imageCount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { artId, name, description, imageCount } = input;
      const artistId = ctx.artistId;
      const { signedUrls } = await updateArt(
        artId,
        name,
        description,
        imageCount
      );

      return { signedUrls, artId, artistId };
    }),
  deleteById: authProcedure.input(z.string()).mutation(async ({ input }) => {
    await deleteArt(input);
  }),
});
