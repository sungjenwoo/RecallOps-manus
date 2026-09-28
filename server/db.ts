import { eq, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  recallOpsAuditEvents,
  recallOpsRateLimits,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export const RECALL_OPS_AUDIT_RETENTION_DAYS = 30;

/** Lazily create Drizzle so local tooling can run without a managed database. */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0)
      updateSet.lastSignedIn = new Date();

    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Atomically consume one request from a rolling fixed window. `null` means the
 * durable store is unavailable; live routes must fail closed in that case.
 */
export async function consumeDurableRateLimit(
  subjectHash: string,
  limit = 30,
  windowMs = 60_000
): Promise<boolean | null> {
  const db = await getDb();
  if (!db) return null;
  const now = Date.now();
  const cutoff = now - windowMs;

  await db.execute(sql`
    INSERT INTO recallops_rate_limits (subjectHash, windowStartedAt, requestCount, updatedAt)
    VALUES (${subjectHash}, ${now}, 1, CURRENT_TIMESTAMP)
    ON DUPLICATE KEY UPDATE
      requestCount = IF(windowStartedAt <= ${cutoff}, 1, requestCount + 1),
      windowStartedAt = IF(windowStartedAt <= ${cutoff}, ${now}, windowStartedAt),
      updatedAt = CURRENT_TIMESTAMP
  `);

  const rows = await db
    .select({ requestCount: recallOpsRateLimits.requestCount })
    .from(recallOpsRateLimits)
    .where(eq(recallOpsRateLimits.subjectHash, subjectHash))
    .limit(1);
  return rows.length > 0 && rows[0]!.requestCount <= limit;
}

export type RecallOpsAuditAction =
  | "analysis"
  | "seed-pack"
  | "verified-outcome";

/** Store only pseudonymous action metadata, expiring it after 30 days. */
export async function recordRecallOpsAuditEvent(input: {
  actorHash: string;
  action: RecallOpsAuditAction;
  target: string;
}): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + RECALL_OPS_AUDIT_RETENTION_DAYS * 24 * 60 * 60 * 1000
  );
  await db
    .delete(recallOpsAuditEvents)
    .where(lt(recallOpsAuditEvents.expiresAt, now));
  await db.insert(recallOpsAuditEvents).values({
    actorHash: input.actorHash,
    action: input.action,
    target: input.target,
    expiresAt,
  });
  return true;
}
