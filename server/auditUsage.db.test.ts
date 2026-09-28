import { createHash, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { recallOpsAuditEvents, recallOpsRateLimits } from "../drizzle/schema";
import { getAuditUsageDashboard } from "./auditUsage";
import { getDb } from "./db";

const databaseAvailable = Boolean(process.env.DATABASE_URL);

describe.skipIf(!databaseAvailable)("audit usage dashboard queries", () => {
  it("isolates personal rows, masks workspace actors, and reports live limits", async () => {
    const db = await getDb();
    if (!db)
      throw new Error(
        "DATABASE_URL is present but the database did not initialize."
      );

    const actorHash = createHash("sha256")
      .update(`dashboard-test:${randomUUID()}`)
      .digest("hex");
    const otherHash = createHash("sha256")
      .update(`dashboard-other:${randomUUID()}`)
      .digest("hex");
    const now = Date.now();
    const expiresAt = new Date(now + 29 * 24 * 60 * 60 * 1000);

    try {
      await db.insert(recallOpsAuditEvents).values([
        {
          actorHash,
          action: "analysis",
          target: "incident-analysis",
          createdAt: new Date(now - 2_000),
          expiresAt,
        },
        {
          actorHash,
          action: "verified-outcome",
          target: "human-confirmed-postmortem",
          createdAt: new Date(now - 1_000),
          expiresAt,
        },
        {
          actorHash: otherHash,
          action: "analysis",
          target: "incident-analysis",
          createdAt: new Date(now - 500),
          expiresAt,
        },
      ]);
      await db.insert(recallOpsRateLimits).values({
        subjectHash: actorHash,
        windowStartedAt: now - 5_000,
        requestCount: 31,
      });

      const personal = await getAuditUsageDashboard({
        actorHash,
        scope: "personal",
        range: "24h",
        action: "all",
      });
      expect(personal.summary.totalOperations).toBe(2);
      expect(personal.summary.analyses).toBe(1);
      expect(personal.summary.verifiedOutcomeWrites).toBe(1);
      expect(personal.summary.attemptsThisMinute).toBe(31);
      expect(personal.summary.allowedThisMinute).toBe(30);
      expect(personal.summary.blockedThisMinute).toBe(1);
      expect(personal.summary.remainingThisMinute).toBe(0);
      expect(personal.recentEvents).toHaveLength(2);
      expect(
        personal.recentEvents.every(event => event.actorLabel === "You")
      ).toBe(true);
      expect(JSON.stringify(personal)).not.toContain(actorHash);
      expect(personal.series).toHaveLength(24);

      const filtered = await getAuditUsageDashboard({
        actorHash,
        scope: "personal",
        range: "24h",
        action: "analysis",
      });
      expect(filtered.summary.totalOperations).toBe(2);
      expect(filtered.recentEvents).toHaveLength(1);
      expect(
        filtered.series.reduce((sum, bucket) => sum + bucket.operations, 0)
      ).toBe(1);

      const workspace = await getAuditUsageDashboard({
        actorHash,
        scope: "workspace",
        range: "24h",
        action: "all",
      });
      expect(workspace.summary.totalOperations).toBeGreaterThanOrEqual(3);
      expect(
        workspace.recentEvents.some(
          event => event.actorLabel === `user-${actorHash.slice(0, 12)}`
        )
      ).toBe(true);
      expect(
        workspace.users.some(
          user => user.actorLabel === `user-${actorHash.slice(0, 12)}`
        )
      ).toBe(true);
      expect(
        workspace.recentEvents.every(event => event.actorLabel !== actorHash)
      ).toBe(true);
    } finally {
      await db
        .delete(recallOpsRateLimits)
        .where(eq(recallOpsRateLimits.subjectHash, actorHash));
      await db
        .delete(recallOpsAuditEvents)
        .where(eq(recallOpsAuditEvents.actorHash, actorHash));
      await db
        .delete(recallOpsAuditEvents)
        .where(eq(recallOpsAuditEvents.actorHash, otherHash));
    }
  }, 30_000);
});
