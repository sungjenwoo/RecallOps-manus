import {
  bigint,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/** Core user table backing the Manus OAuth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** One rolling request window per HMAC-pseudonymized subject. */
export const recallOpsRateLimits = mysqlTable("recallops_rate_limits", {
  subjectHash: varchar("subjectHash", { length: 64 }).primaryKey(),
  windowStartedAt: bigint("windowStartedAt", { mode: "number" }).notNull(),
  requestCount: int("requestCount").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Minimal audit metadata only; never store incident text, email, openId, or API secrets. */
export const recallOpsAuditEvents = mysqlTable(
  "recallops_audit_events",
  {
    id: int("id").autoincrement().primaryKey(),
    actorHash: varchar("actorHash", { length: 64 }).notNull(),
    action: varchar("action", { length: 32 }).notNull(),
    target: varchar("target", { length: 80 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
  },
  table => ({
    expiresAtIdx: index("recallops_audit_expires_idx").on(table.expiresAt),
    actorCreatedAtIdx: index("recallops_audit_actor_created_idx").on(
      table.actorHash,
      table.createdAt
    ),
    createdAtIdx: index("recallops_audit_created_idx").on(table.createdAt),
  })
);
