import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@server/router";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",

      // // You can pass any HTTP headers you wish here
      // async headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   };
      // },
    }),
  ],
});
