import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { resolveAuditUsageScope } from "./routers/auditUsage";

describe("audit usage dashboard authorization", () => {
  it("defaults regular users to their own data", () => {
    expect(resolveAuditUsageScope("user")).toBe("personal");
    expect(resolveAuditUsageScope("user", "personal")).toBe("personal");
  });

  it("denies a regular user the workspace-wide view", () => {
    expect(() => resolveAuditUsageScope("user", "workspace")).toThrowError(
      expect.objectContaining({ code: "FORBIDDEN" })
    );
  });

  it("lets admins choose between pseudonymous workspace and personal views", () => {
    expect(resolveAuditUsageScope("admin")).toBe("workspace");
    expect(resolveAuditUsageScope("admin", "workspace")).toBe("workspace");
    expect(resolveAuditUsageScope("admin", "personal")).toBe("personal");
  });
});
