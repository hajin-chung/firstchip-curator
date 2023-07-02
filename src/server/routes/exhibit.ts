import { createExhibit, deleteExhibit, getAllExhibits, updateExhibit } from "@lib/server";
import { authProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { toISOLocal } from "@lib/utils";
import type { ExhibitFilter } from "@lib/type";

export const exhibitRouter = router({
  getAllExhibits: publicProcedure.query(async () => {
    return await getAllExhibits();
  }),
  getExhibitsByFilter: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      // return await getExhibitsByFilter(input as ExhibitFilter);
    }),
  updateExhibit: authProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        location: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      return await updateExhibit(input);
    }),
  createExhibit: authProcedure
    .input(
      z.object({
        title: z.string(),
        location: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      return createExhibit(input);
    }),
  deleteExhibitById: authProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return deleteExhibit(input);
    }),
});
