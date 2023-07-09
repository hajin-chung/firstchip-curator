import {
  createArt,
  deleteArt,
  getArtsByArtistId,
  updateArt,
} from "@lib/server";
import { artStatusValues } from "@lib/type";
import { authProcedure, publicProcedure, router } from "@server/trpc";
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
        price: z.number().nullable(),
        status: z.enum(artStatusValues),
        imageCount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { artId, name, description, imageCount, price, status } = input;
      const artistId = ctx.artistId;
      const { signedUrls } = await updateArt(
        artId,
        name,
        description,
        price,
        status,
        imageCount
      );

      return { signedUrls, artId, artistId };
    }),
  deleteById: authProcedure.input(z.string()).mutation(async ({ input }) => {
    await deleteArt(input);
  }),
  getArtsByArtistId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => getArtsByArtistId(input)),
});
