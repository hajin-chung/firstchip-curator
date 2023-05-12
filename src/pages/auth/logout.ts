import type { APIRoute } from "astro";

export const get: APIRoute = () => {
  return new Response(null, {
    status: 307,
    headers: {
      "Set-Cookie": `session=; Path=/`,
      Location: "/",
    },
  });
};
