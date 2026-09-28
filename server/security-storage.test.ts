import { createHash, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { recallOpsAuditEvents, recallOpsRateLimits } from "../drizzle/schema";
import {
  consumeDurableRateLimit,
  getDb,
  recordRecallOpsAuditEvent,
  RECALL_OPS_AUDIT_RETENTION_DAYS,
} from "./db";

const databaseAvailable = Boolean(process.env.DATABASE_URL);

describe.skipIf(!databaseAvailable)(
  "RecallOps durable security storage",
  () => {
    it("persists request counts, enforces the limit, and resets the expired window", async () => {
      const db = await getDb();
      if (!db)
        throw new Error(
          "DATABASE_URL is present but the database did not initialize."
        );
      const subjectHash = createHash("sha256")
        .update(`rate-test:${randomUUID()}`)
        .digest("hex");

      try {
        expect(await consumeDurableRateLimit(subjectHash, 2, 60_000)).toBe(
          true
        );
        expect(await consumeDurableRateLimit(subjectHash, 2, 60_000)).toBe(
          true
        );
        expect(await consumeDurableRateLimit(subjectHash, 2, 60_000)).toBe(
          false
        );

        await db
          .update(recallOpsRateLimits)
          .set({ windowStartedAt: Date.now() - 61_000, requestCount: 99 })
          .where(eq(recallOpsRateLimits.subjectHash, subjectHash));

        expect(await consumeDurableRateLimit(subjectHash, 2, 60_000)).toBe(
          true
        );
      } finally {
        await db
          .delete(recallOpsRateLimits)
          .where(eq(recallOpsRateLimits.subjectHash, subjectHash));
      }
    }, 20_000);

    it("stores only pseudonymous audit metadata and applies the 30-day expiry", async () => {
      const db = await getDb();
      if (!db)
        throw new Error(
          "DATABASE_URL is present but the database did not initialize."
        );
      const actorHash = createHash("sha256")
        .update(`audit-test:${randomUUID()}`)
        .digest("hex");

      try {
        await expect(
          recordRecallOpsAuditEvent({
            actorHash,
            action: "analysis",
            target: "incident-analysis",
          })
        ).resolves.toBe(true);

        const rows = await db
          .select()
          .from(recallOpsAuditEvents)
          .where(eq(recallOpsAuditEvents.actorHash, actorHash))
          .limit(1);
        expect(rows).toHaveLength(1);
        expect(rows[0]?.action).toBe("analysis");
        expect(rows[0]?.target).toBe("incident-analysis");
        expect(rows[0]?.expiresAt.getTime()).toBeGreaterThan(
          Date.now() +
            (RECALL_OPS_AUDIT_RETENTION_DAYS - 1) * 24 * 60 * 60 * 1000
        );
        expect(Object.keys(rows[0] ?? {}).sort()).toEqual(
          [
            "action",
            "actorHash",
            "createdAt",
            "expiresAt",
            "id",
            "target",
          ].sort()
        );
      } finally {
        await db
          .delete(recallOpsAuditEvents)
          .where(eq(recallOpsAuditEvents.actorHash, actorHash));
      }
    }, 20_000);
  }
);
