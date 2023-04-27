import { z, defineCollection } from "astro:content";

const descriptionCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    images: z.array(z.string()),
  }),
});

export const collections = {
  description: descriptionCollection,
};
