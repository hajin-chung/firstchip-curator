import { createArt, getAuthDataBySessionId } from "@lib/server";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request, cookies }) => {
  if (!request.body) {
    return new Response(
      JSON.stringify({ error: true, message: "body is null" })
    );
  }

  const { isAuthed, artist } = await getAuthDataBySessionId(
    cookies.get("session").value
  );

  if (!isAuthed || !artist) {
    return new Response(
      JSON.stringify({ error: true, message: "body is null" })
    );
  }

  const { name, description, imageCount } = (await request.json()) as {
    name: string;
    description: string;
    imageCount: number;
  };

  const signedUrls = await createArt(
    name,
    description,
    artist.artistId,
    imageCount
  );

  return new Response(JSON.stringify({ error: false, signedUrls }));
};
