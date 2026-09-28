import { describe, expect, it } from "vitest";
import {
  buildPersonalUsageAlerts,
  buildWorkspaceUsageAlerts,
} from "./auditUsage";

const actor = (prefix: string) => `${prefix.repeat(12)}${"a".repeat(52)}`;

describe("admin usage alerts", () => {
  it("flags request-limit exceedance and masks the full actor hash", () => {
    const alerts = buildWorkspaceUsageAlerts({
      scope: "workspace",
      rateRows: [{ subjectHash: actor("x"), requestCount: 31 }],
    });

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      severity: "critical",
      kind: "request-limit",
      actorLabel: `user-${"x".repeat(12)}`,
      requestCount: 31,
      threshold: 30,
      title: "Request limit exceeded",
    });
    expect(JSON.stringify(alerts)).not.toContain(actor("x"));
  });

  it("warns at 80 percent of the per-account request limit", () => {
    const alerts = buildWorkspaceUsageAlerts({
      scope: "workspace",
      rateRows: [{ subjectHash: actor("b"), requestCount: 24 }],
    });

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      severity: "warning",
      kind: "request-limit",
      requestCount: 24,
      threshold: 24,
      title: "Approaching request limit",
    });
  });

  it("flags an outlier only with at least three active peers and ten requests", () => {
    const alerts = buildWorkspaceUsageAlerts({
      scope: "workspace",
      rateRows: [
        { subjectHash: actor("c"), requestCount: 18 },
        { subjectHash: actor("d"), requestCount: 4 },
        { subjectHash: actor("e"), requestCount: 3 },
        { subjectHash: actor("f"), requestCount: 2 },
      ],
    });

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      severity: "warning",
      kind: "unusual-usage",
      actorLabel: `user-${"c".repeat(12)}`,
      requestCount: 18,
      threshold: 10,
      title: "Unusual request-volume spike",
    });
  });

  it("does not emit workspace alerts for personal scope or small peer groups", () => {
    const rows = [
      { subjectHash: actor("g"), requestCount: 18 },
      { subjectHash: actor("h"), requestCount: 2 },
      { subjectHash: actor("i"), requestCount: 1 },
    ];

    expect(
      buildWorkspaceUsageAlerts({ scope: "personal", rateRows: rows })
    ).toEqual([]);
    expect(
      buildWorkspaceUsageAlerts({ scope: "workspace", rateRows: rows })
    ).toEqual([]);
  });
});

describe("personal usage alerts", () => {
  it("shows the account holder's threshold alert without returning peer data", () => {
    const ownActor = actor("j");
    const otherActor = actor("k");
    const alerts = buildPersonalUsageAlerts({
      actorHash: ownActor,
      rateRows: [
        { subjectHash: ownActor, requestCount: 24 },
        { subjectHash: otherActor, requestCount: 31 },
      ],
    });

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      severity: "warning",
      kind: "request-limit",
      actorLabel: "You",
      requestCount: 24,
      threshold: 24,
      title: "Your request limit is approaching",
    });
    expect(JSON.stringify(alerts)).not.toContain(ownActor);
    expect(JSON.stringify(alerts)).not.toContain(otherActor);
  });

  it("shows a critical alert after the per-account limit is exceeded", () => {
    const ownActor = actor("m");
    const alerts = buildPersonalUsageAlerts({
      actorHash: ownActor,
      rateRows: [{ subjectHash: ownActor, requestCount: 31 }],
    });

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      severity: "critical",
      actorLabel: "You",
      requestCount: 31,
      threshold: 30,
      title: "Your request limit was exceeded",
    });
  });

  it("does not alert below threshold or when only another account has counters", () => {
    const ownActor = actor("n");
    const otherActor = actor("o");
    expect(
      buildPersonalUsageAlerts({
        actorHash: ownActor,
        rateRows: [{ subjectHash: ownActor, requestCount: 23 }],
      })
    ).toEqual([]);
    expect(
      buildPersonalUsageAlerts({
        actorHash: ownActor,
        rateRows: [{ subjectHash: otherActor, requestCount: 31 }],
      })
    ).toEqual([]);
  });
});
