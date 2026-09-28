import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getAuditUsageDashboard } from "../auditUsage";
import { deriveActorHash } from "../recallops";
import { protectedProcedure, router } from "../_core/trpc";

const dashboardInput = z.object({
  range: z.enum(["24h", "7d", "30d"]).default("7d"),
  action: z
    .enum(["all", "analysis", "seed-pack", "verified-outcome"])
    .default("all"),
  scope: z.enum(["personal", "workspace"]).optional(),
});

export function resolveAuditUsageScope(
  role: "user" | "admin",
  requestedScope?: "personal" | "workspace"
): "personal" | "workspace" {
  if (requestedScope === "workspace" && role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Workspace-wide audit analytics are available to admins only.",
    });
  }
  return requestedScope ?? (role === "admin" ? "workspace" : "personal");
}

export const auditUsageRouter = router({
  dashboard: protectedProcedure
    .input(dashboardInput)
    .query(async ({ ctx, input }) => {
      const scope = resolveAuditUsageScope(ctx.user.role, input.scope);
      try {
        return await getAuditUsageDashboard({
          actorHash: deriveActorHash(ctx.user.openId),
          scope,
          range: input.range,
          action: input.action,
        });
      } catch {
        console.error("[AuditUsage] Dashboard query failed");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Audit and usage data is temporarily unavailable.",
        });
      }
    }),
});
