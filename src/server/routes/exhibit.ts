import { createExhibit, deleteExhibit, updateExhibit } from "@lib/server";
import { authProcedure, router } from "../trpc";
import { z } from "zod";

export const exhibitRouter = router({
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
