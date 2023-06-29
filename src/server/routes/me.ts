import { createSignedUrl, updatePicture, updateProfile } from "@lib/server";
import { authProcedure, router } from "../trpc";
import { z } from "zod";

export const meRouter = router({
  updateProfile: authProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        history: z.string(),
        didPictureUpdate: z.boolean(),
        didHeaderPictureUpdate: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        description,
        history,
        didPictureUpdate,
        didHeaderPictureUpdate,
      } = input;
      const artistId = ctx.artistId;

      updateProfile(artistId, name, description, history);

      let pictureUploadUrl: string | undefined;
      let headerUploadUrl: string | undefined;
      if (didPictureUpdate) {
        await updatePicture(artistId);
        pictureUploadUrl = await createSignedUrl("put", artistId);
      }
      if (didHeaderPictureUpdate) {
        headerUploadUrl = await createSignedUrl("put", `header-${artistId}`);
      }

      return { pictureUploadUrl, headerUploadUrl };
    }),
});
