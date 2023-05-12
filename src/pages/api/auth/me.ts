import { getAuthDataBySessionId } from "@lib/server";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ request, cookies }) => {
  const sessionId = cookies.get("session").value;

  try {
    const artist = await getAuthDataBySessionId(sessionId);
    return new Response(JSON.stringify(artist));
  } catch (e) {
    return new Response(JSON.stringify({ isAuthed: false }));
  }
};
