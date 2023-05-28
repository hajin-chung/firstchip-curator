import { createSession } from "@lib/server";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({params, redirect}) => {
  const { artistId } = params;
  if (typeof artistId !== "string") {
    return redirect("/500");
  }

  const { sessionId, sessionExpires } = await createSession(artistId);

  return new Response(null, {
    status: 307,
    headers: {
      "Set-Cookie": `session=${sessionId}; Expires=${sessionExpires.toUTCString()}; Path=/`,
      Location: "/",
    },
  });
};
