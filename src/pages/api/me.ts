import {
  createPutImageUrl,
  getAuthDataBySessionId,
  updateName,
	updatePicture,
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
    const { name, didPictureUpdate } = (await request.json()) as {
      name: string | undefined;
      didPictureUpdate: boolean | undefined;
    };

    let signedUrl;
    if (name) await updateName(authData.artistId, name);
    if (didPictureUpdate) {
			await updatePicture(authData.artistId);
      signedUrl = await createPutImageUrl(authData.artistId);
    }

    return new Response(JSON.stringify({ error: false, signedUrl }));
  } catch (e) {
    return new Response(
      JSON.stringify({ error: true, message: JSON.stringify(e) }),
      { status: 500 }
    );
  }
};
