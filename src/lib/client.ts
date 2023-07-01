import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@server/router";
import imageCompression from "browser-image-compression";
import superjson from "superjson";

export const client = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

export const compressImage = async (image: File) => {
  return imageCompression(image, { maxSizeMB: 1 });
};
