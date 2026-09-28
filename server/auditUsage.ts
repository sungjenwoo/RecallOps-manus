import { and, count, desc, eq, gte, sql, type SQL } from "drizzle-orm";
import { recallOpsAuditEvents, recallOpsRateLimits } from "../drizzle/schema";
import { getDb } from "./db";

export type AuditUsageRange = "24h" | "7d" | "30d";
export type AuditUsageAction =
  | "all"
  | "analysis"
  | "seed-pack"
  | "verified-outcome";
export type AuditUsageScope = "personal" | "workspace";

const REQUESTS_PER_MINUTE = 30;
const RANGE_CONFIG: Record<
  AuditUsageRange,
  { buckets: number; seconds: number }
> = {
  "24h": { buckets: 24, seconds: 60 * 60 },
  "7d": { buckets: 7, seconds: 24 * 60 * 60 },
  "30d": { buckets: 30, seconds: 24 * 60 * 60 },
};

function auditFilters(input: {
  actorHash: string;
  scope: AuditUsageScope;
  startAt: Date;
  action?: AuditUsageAction;
}): SQL {
  const filters: SQL[] = [gte(recallOpsAuditEvents.createdAt, input.startAt)];
  if (input.scope === "personal") {
    filters.push(eq(recallOpsAuditEvents.actorHash, input.actorHash));
  }
  if (input.action && input.action !== "all") {
    filters.push(eq(recallOpsAuditEvents.action, input.action));
  }
  return and(...filters)!;
}

function safeCount(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Aggregate only the pseudonymous audit metadata already retained by RecallOps.
 * No identity lookup or incident-content query is performed here.
 */
export async function getAuditUsageDashboard(input: {
  actorHash: string;
  scope: AuditUsageScope;
  range: AuditUsageRange;
  action: AuditUsageAction;
}) {
  const db = await getDb();
  if (!db) throw new Error("Audit and usage storage is unavailable.");

  const now = Date.now();
  const { buckets, seconds } = RANGE_CONFIG[input.range];
  const bucketMs = seconds * 1000;
  const lastBucketStart = Math.floor(now / bucketMs) * bucketMs;
  const startAtMs = lastBucketStart - (buckets - 1) * bucketMs;
  const startAt = new Date(startAtMs);
  const totalWhere = auditFilters({
    actorHash: input.actorHash,
    scope: input.scope,
    startAt,
  });
  const filteredWhere = auditFilters({
    actorHash: input.actorHash,
    scope: input.scope,
    startAt,
    action: input.action,
  });

  const totalsRows = await db
    .select({
      totalOperations: count(),
      analyses: sql<number>`COALESCE(SUM(CASE WHEN ${recallOpsAuditEvents.action} = 'analysis' THEN 1 ELSE 0 END), 0)`,
      seedWrites: sql<number>`COALESCE(SUM(CASE WHEN ${recallOpsAuditEvents.action} = 'seed-pack' THEN 1 ELSE 0 END), 0)`,
      verifiedOutcomeWrites: sql<number>`COALESCE(SUM(CASE WHEN ${recallOpsAuditEvents.action} = 'verified-outcome' THEN 1 ELSE 0 END), 0)`,
      activeActors: sql<number>`COUNT(DISTINCT ${recallOpsAuditEvents.actorHash})`,
    })
    .from(recallOpsAuditEvents)
    .where(totalWhere);
  const totals = totalsRows[0];

  const bucketExpr = sql<number>`FLOOR(UNIX_TIMESTAMP(${recallOpsAuditEvents.createdAt}) / ${seconds}) * ${seconds}`;
  const seriesRows = await db
    .select({ bucket: bucketExpr, operations: count() })
    .from(recallOpsAuditEvents)
    .where(filteredWhere)
    .groupBy(sql.raw("1"))
    .orderBy(sql.raw("1"));
  const seriesCounts = new Map(
    seriesRows.map(row => [safeCount(row.bucket), safeCount(row.operations)])
  );
  const series = Array.from({ length: buckets }, (_, index) => {
    const bucketStart = startAtMs + index * bucketMs;
    return {
      bucketStart,
      operations: seriesCounts.get(Math.floor(bucketStart / 1000)) ?? 0,
    };
  });

  const recentRows = await db
    .select({
      id: recallOpsAuditEvents.id,
      actorHash: recallOpsAuditEvents.actorHash,
      action: recallOpsAuditEvents.action,
      target: recallOpsAuditEvents.target,
      createdAt: recallOpsAuditEvents.createdAt,
      expiresAt: recallOpsAuditEvents.expiresAt,
    })
    .from(recallOpsAuditEvents)
    .where(filteredWhere)
    .orderBy(
      desc(recallOpsAuditEvents.createdAt),
      desc(recallOpsAuditEvents.id)
    )
    .limit(50);

  const currentWindowStart = now - 60_000;
  const rateFilters: SQL[] = [
    gte(recallOpsRateLimits.windowStartedAt, currentWindowStart),
  ];
  if (input.scope === "personal") {
    rateFilters.push(eq(recallOpsRateLimits.subjectHash, input.actorHash));
  }
  const rateRows = await db
    .select({
      subjectHash: recallOpsRateLimits.subjectHash,
      requestCount: recallOpsRateLimits.requestCount,
    })
    .from(recallOpsRateLimits)
    .where(and(...rateFilters)!);

  let users: {
    actorLabel: string;
    operations: number;
    attemptsThisMinute: number;
    lastActiveAt: number | null;
  }[] = [];
  if (input.scope === "workspace") {
    const requestCount = count();
    const userRows = await db
      .select({
        actorHash: recallOpsAuditEvents.actorHash,
        operations: requestCount,
        lastActiveAt: sql<Date>`MAX(${recallOpsAuditEvents.createdAt})`,
      })
      .from(recallOpsAuditEvents)
      .where(totalWhere)
      .groupBy(recallOpsAuditEvents.actorHash)
      .orderBy(desc(requestCount))
      .limit(20);
    const userMap = new Map<
      string,
      {
        operations: number;
        attemptsThisMinute: number;
        lastActiveAt: number | null;
      }
    >();
    for (const row of userRows) {
      userMap.set(row.actorHash, {
        operations: safeCount(row.operations),
        attemptsThisMinute: 0,
        lastActiveAt: row.lastActiveAt
          ? new Date(row.lastActiveAt).getTime()
          : null,
      });
    }
    for (const row of rateRows) {
      const current = userMap.get(row.subjectHash) ?? {
        operations: 0,
        attemptsThisMinute: 0,
        lastActiveAt: null,
      };
      current.attemptsThisMinute = safeCount(row.requestCount);
      userMap.set(row.subjectHash, current);
    }
    users = Array.from(userMap.entries())
      .map(([actorHash, value]) => ({
        actorLabel: `user-${actorHash.slice(0, 12)}`,
        ...value,
      }))
      .sort((a, b) => b.operations - a.operations)
      .slice(0, 20);
  }

  const attemptsThisMinute = rateRows.reduce(
    (sum, row) => sum + safeCount(row.requestCount),
    0
  );
  const allowedThisMinute = rateRows.reduce(
    (sum, row) =>
      sum + Math.min(safeCount(row.requestCount), REQUESTS_PER_MINUTE),
    0
  );
  const blockedThisMinute = Math.max(0, attemptsThisMinute - allowedThisMinute);

  return {
    generatedAt: now,
    range: input.range,
    action: input.action,
    scope: input.scope,
    requestLimitPerMinute: REQUESTS_PER_MINUTE,
    summary: {
      totalOperations: safeCount(totals?.totalOperations),
      analyses: safeCount(totals?.analyses),
      seedWrites: safeCount(totals?.seedWrites),
      verifiedOutcomeWrites: safeCount(totals?.verifiedOutcomeWrites),
      activeActors: safeCount(totals?.activeActors),
      activeActorsThisMinute: rateRows.length,
      attemptsThisMinute,
      allowedThisMinute,
      blockedThisMinute,
      remainingThisMinute:
        input.scope === "personal"
          ? Math.max(0, REQUESTS_PER_MINUTE - attemptsThisMinute)
          : null,
    },
    series,
    recentEvents: recentRows.map(row => ({
      id: row.id,
      actorLabel:
        input.scope === "workspace"
          ? `user-${row.actorHash.slice(0, 12)}`
          : "You",
      action: row.action,
      target: row.target,
      createdAt: row.createdAt.getTime(),
      expiresAt: row.expiresAt.getTime(),
    })),
    users,
  };
}
