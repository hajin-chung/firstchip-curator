import {
  createPutImageUrl,
  getAuthDataBySessionId,
  updatePicture,
  updateProfile,
} from "@lib/server";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ cookies, request }) => {
  const sessionId = cookies.get("session").value;

  const { isAuthed, artist: authData } = await getAuthDataBySessionId(
    sessionId
  );

  if (!isAuthed || !authData) {
    return new Response(
      JSON.stringify({ error: true, message: "no sessionId" }),
      { status: 500 }
    );
  }

  try {
    const { name, description, didPictureUpdate } = (await request.json()) as {
      name: string;
      description: string;
      didPictureUpdate: boolean | undefined;
    };

    let signedUrl;
    updateProfile(authData.artistId, name, description);
    if (didPictureUpdate) {
      await updatePicture(authData.artistId);
      signedUrl = await createPutImageUrl(authData.artistId);
    }

    return new Response(JSON.stringify({ error: false, signedUrl }), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: true, message: JSON.stringify(e) }),
      { status: 500 }
    );
  }
};
