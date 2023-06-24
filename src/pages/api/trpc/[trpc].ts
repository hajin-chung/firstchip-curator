import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { APIRoute } from "astro";
import { createContext } from "@server/context";
import { appRouter } from "@server/router";

export const all: APIRoute = ({ request, cookies }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createContext(cookies.get("session").value),
  });
};
