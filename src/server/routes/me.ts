import { createSignedUrl, updatePicture, updateProfile } from "@lib/server";
import { authProcedure, router } from "../trpc";
import { z } from "zod";

export const meRouter = router({
  updateProfile: authProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        didPictureUpdate: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, didPictureUpdate } = input;
      const artistId = ctx.artistId;

      updateProfile(artistId, name, description);

      if (didPictureUpdate) {
        await updatePicture(artistId);
        const signedUrl = await createSignedUrl("put", artistId);
        return signedUrl;
      }
    }),
});
