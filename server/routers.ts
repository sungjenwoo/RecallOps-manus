import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { allowPublicRequest, analyzeIncident, integrationStatus, retainConfirmedOutcome, seedHindsightBank } from "./recallops";

function enforceDemoRateLimit(address: string | undefined) {
  if (!allowPublicRequest(address)) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Demo request limit reached. Please wait a minute and try again." });
  }
}

const browserMemory = z.object({
  id: z.string().max(80),
  text: z.string().min(1).max(1600),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  recallOps: router({
    status: publicProcedure.query(() => integrationStatus()),
    analyze: publicProcedure
      .input(z.object({
        service: z.string().trim().min(2).max(100),
        environment: z.string().trim().min(2).max(120),
        summary: z.string().trim().min(12).max(1800),
        recentChange: z.string().trim().max(900).default("No recent change supplied."),
        impact: z.string().trim().max(600).default("Impact not yet confirmed."),
        browserMemories: z.array(browserMemory).max(12).default([]),
      }))
      .mutation(({ input, ctx }) => {
        enforceDemoRateLimit(ctx.req.ip);
        return analyzeIncident(input);
      }),
    seedDemo: publicProcedure.mutation(({ ctx }) => {
      enforceDemoRateLimit(ctx.req.ip);
      return seedHindsightBank();
    }),
    saveOutcome: publicProcedure
      .input(z.object({
        incidentId: z.string().trim().min(2).max(80),
        service: z.string().trim().min(2).max(100),
        summary: z.string().trim().min(12).max(1800),
        rootCause: z.string().trim().min(8).max(1000),
        failedActions: z.string().trim().max(900).default(""),
        successfulResolution: z.string().trim().min(8).max(1200),
        followUp: z.string().trim().max(900).default(""),
        confirmed: z.literal(true),
      }))
      .mutation(({ input, ctx }) => {
        enforceDemoRateLimit(ctx.req.ip);
        const { confirmed: _confirmed, ...outcome } = input;
        return retainConfirmedOutcome(outcome);
      }),
  }),
});

export type AppRouter = typeof appRouter;
