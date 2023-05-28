import { authUser } from "@lib/server";
import { createId } from "@paralleldrive/cuid2";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({}) => {
	const { sessionId, sessionExpires } = await authUser({
		name: "test123",
		email: "123",
		sub: createId(),
		picture: "123",
	});

  return new Response(null, {
    status: 307,
    headers: {
      "Set-Cookie": `session=${sessionId}; Expires=${sessionExpires.toUTCString()}; Path=/`,
      Location: "/",
    },
  });
}