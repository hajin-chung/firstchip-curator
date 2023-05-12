import { createGetImageUrl } from "@lib/server";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (id === null) {
    return new Response();
  }

  const signedUrl = await createGetImageUrl(id);

  return new Response(null, {
    status: 307,
    headers: {
      Location: signedUrl,
    },
  });
};
