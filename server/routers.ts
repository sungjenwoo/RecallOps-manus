import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { auditUsageRouter } from "./routers/auditUsage";
import { consumeDurableRateLimit, recordRecallOpsAuditEvent } from "./db";
import {
  allowPublicRequest,
  analyzeIncident,
  deriveActorHash,
  derivePrivateBankId,
  integrationStatus,
  retainConfirmedOutcome,
  seedHindsightBank,
} from "./recallops";

const DEMO_REQUEST_LIMIT = 30;

function enforceSimulationRateLimit(address: string | undefined) {
  if (!allowPublicRequest(address)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message:
        "Demo request limit reached. Please wait a minute and try again.",
    });
  }
}

type LiveUser = Pick<NonNullable<TrpcContext["user"]>, "openId">;

/** Shared guard for live routes; exported so both auth modes are regression-tested. */
export function resolveLiveMemoryAccess(
  user: LiveUser | null,
  liveConfigured: boolean,
  bankSecret?: string
) {
  if (!liveConfigured) return null;
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Sign in to access your private Hindsight memory bank.",
    });
  }
  return {
    bankId: derivePrivateBankId(user.openId, bankSecret),
    actorHash: deriveActorHash(user.openId, bankSecret),
  };
}

async function enforceRequestLimit(
  address: string | undefined,
  access: ReturnType<typeof resolveLiveMemoryAccess>
) {
  if (!access) {
    enforceSimulationRateLimit(address);
    return;
  }
  const allowed = await consumeDurableRateLimit(
    access.actorHash,
    DEMO_REQUEST_LIMIT
  );
  if (allowed === null) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Live memory is paused because durable abuse controls are unavailable. No provider request was sent.",
    });
  }
  if (!allowed) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message:
        "Live request limit reached. Please wait a minute and try again.",
    });
  }
}

async function recordLiveAction(
  access: NonNullable<ReturnType<typeof resolveLiveMemoryAccess>>,
  action: "analysis" | "seed-pack" | "verified-outcome",
  target: string
) {
  const stored = await recordRecallOpsAuditEvent({
    actorHash: access.actorHash,
    action,
    target,
  });
  if (!stored) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Live memory is paused because audit storage is unavailable. No provider request was sent.",
    });
  }
}

const browserMemory = z.object({
  id: z.string().max(80),
  text: z.string().min(1).max(1600),
});

export const appRouter = router({
  system: systemRouter,
  auditUsage: auditUsageRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  recallOps: router({
    status: publicProcedure.query(() => integrationStatus()),
    analyze: publicProcedure
      .input(
        z.object({
          service: z.string().trim().min(2).max(100),
          environment: z.string().trim().min(2).max(120),
          summary: z.string().trim().min(12).max(1800),
          recentChange: z
            .string()
            .trim()
            .max(900)
            .default("No recent change supplied."),
          impact: z
            .string()
            .trim()
            .max(600)
            .default("Impact not yet confirmed."),
          browserMemories: z.array(browserMemory).max(12).default([]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const access = resolveLiveMemoryAccess(
          ctx.user,
          integrationStatus().hindsightConfigured
        );
        await enforceRequestLimit(ctx.req.ip, access);
        if (access)
          await recordLiveAction(access, "analysis", "incident-analysis");
        return analyzeIncident(input, access?.bankId);
      }),
    seedDemo: publicProcedure.mutation(async ({ ctx }) => {
      const access = resolveLiveMemoryAccess(
        ctx.user,
        integrationStatus().hindsightConfigured
      );
      await enforceRequestLimit(ctx.req.ip, access);
      if (access)
        await recordLiveAction(access, "seed-pack", "synthetic-demo-pack");
      return seedHindsightBank(access?.bankId);
    }),
    saveOutcome: publicProcedure
      .input(
        z.object({
          incidentId: z.string().trim().min(2).max(80),
          service: z.string().trim().min(2).max(100),
          summary: z.string().trim().min(12).max(1800),
          rootCause: z.string().trim().min(8).max(1000),
          failedActions: z.string().trim().max(900).default(""),
          successfulResolution: z.string().trim().min(8).max(1200),
          followUp: z.string().trim().max(900).default(""),
          confirmed: z.literal(true),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const access = resolveLiveMemoryAccess(
          ctx.user,
          integrationStatus().hindsightConfigured
        );
        await enforceRequestLimit(ctx.req.ip, access);
        if (access)
          await recordLiveAction(
            access,
            "verified-outcome",
            "human-confirmed-postmortem"
          );
        const { confirmed: _confirmed, ...outcome } = input;
        return retainConfirmedOutcome(outcome, access?.bankId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
