import { z } from "zod";
import prisma from "../../lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => prisma.workflow.findMany()),

  createWorkflow: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ input }) => prisma.workflow.create({ data: { name: input.name } })),
});
// export type definition of API
export type AppRouter = typeof appRouter;
