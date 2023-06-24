import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createContext(sessionId: string | undefined) {
  return function createContext({
    req,
    resHeaders,
  }: FetchCreateContextFnOptions) {
    return { req, resHeaders, sessionId };
  };
}

export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;
