import { createArt, updateArt, getAuthDataBySessionId, deleteArt } from "@lib/server";
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

  const { signedUrls, artId } = await createArt(
    name,
    description,
    artist.artistId,
    imageCount
  );

  return new Response(
    JSON.stringify({
      error: false,
      signedUrls,
      artId,
      artistId: artist.artistId,
    })
  );
};

export const put: APIRoute = async ({ request, cookies }) => {
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

  const { signedUrls, artId } = await updateArt(
    name,
    description,
    artist.artistId,
    imageCount
  );

  return new Response(
    JSON.stringify({
      error: false,
      signedUrls,
      artId,
      artistId: artist.artistId,
    })
  );
};

export const del: APIRoute = async ({ request, cookies }) => {
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

  const { artId } = (await request.json()) as {
    artId: string;
  };

  const res = await deleteArt(artId);

  return new Response(
    JSON.stringify({
      error: false,
    })
  );
};
