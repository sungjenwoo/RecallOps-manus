import { describe, expect, it } from "vitest";
import {
  allowPublicRequest,
  analyzeIncident,
  integrationStatus,
  redactSecrets,
  seedHindsightBank,
} from "./recallops";

describe("RecallOps incident safety", () => {
  it("reports provider configuration without exposing secret values", () => {
    const status = integrationStatus();
    expect(status.hindsightConfigured).toBe(
      Boolean(process.env.HINDSIGHT_API_URL || process.env.HINDSIGHT_BASE_URL)
    );
    expect(status.hindsightAuthConfigured).toBe(
      Boolean(process.env.HINDSIGHT_API_KEY)
    );
    expect(status.groqConfigured).toBe(
      Boolean(process.env.GROQ_API_KEY?.trim())
    );
    expect(status.specialistCoordinatorEnabled).toBe(
      process.env.RECALLOPS_AGENT_COORDINATOR !== "false"
    );
    expect(status.authRequired).toBe(status.hindsightConfigured);
    expect(status).not.toHaveProperty("bankId");
    expect(status).not.toHaveProperty("apiKey");
  });

  it("labels an unconfigured simulation as a zero-call rules fallback", async () => {
    if (
      integrationStatus().hindsightConfigured ||
      process.env.GROQ_API_KEY ||
      process.env.RECALLOPS_AGENT_COORDINATOR === "false"
    ) {
      return;
    }

    const result = await analyzeIncident({
      service: "checkout-api",
      environment: "fictional",
      summary: "Synthetic timeouts after a release change.",
      recentChange: "Worker pool setting changed.",
      impact: "Fictional demo only.",
      browserMemories: [],
    });

    expect(result.agentRun).toEqual({
      mode: "rules-fallback",
      roles: [],
      modelCalls: 0,
    });
    expect(result.modelSource).toContain("no model key configured");
  });

  it("does not claim a fictional pack was persisted when Hindsight is unconfigured", async () => {
    if (integrationStatus().hindsightConfigured) return;

    await expect(seedHindsightBank()).resolves.toMatchObject({
      saved: false,
      mode: "simulation",
      count: expect.any(Number),
    });
  });

  it("authenticates configured providers using read-only endpoints", async () => {
    const hindsightUrl = (
      process.env.HINDSIGHT_API_URL ||
      process.env.HINDSIGHT_BASE_URL ||
      ""
    ).replace(/\/$/, "");
    const hindsightKey = process.env.HINDSIGHT_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    if (hindsightUrl) {
      const response = await fetch(`${hindsightUrl}/v1/default/banks?limit=1`, {
        headers: hindsightKey
          ? { Authorization: `Bearer ${hindsightKey}` }
          : {},
        signal: AbortSignal.timeout(10_000),
      });
      expect(response.status).toBe(200);
    }
    if (groqKey) {
      const response = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${groqKey}` },
        signal: AbortSignal.timeout(10_000),
      });
      expect(response.status).toBe(200);
    }
  }, 25_000);

  it("redacts common API keys, bearer tokens, and password assignments", () => {
    const fakeKey = ["gs", "k", "-demo-redaction-token-12345"].join("");
    const safe = redactSecrets(
      `${fakeKey} Bearer demo-bearer-token-12345 password=example`
    );
    expect(safe).not.toContain("demo-redaction-token-12345");
    expect(safe).not.toContain("demo-bearer-token-12345");
    expect(safe).not.toContain("example");
    expect(safe).toContain("[REDACTED");
  });

  it("returns explicitly labelled synthetic evidence when Hindsight is not configured", async () => {
    const status = integrationStatus();
    if (status.hindsightConfigured) return;
    const result = await analyzeIncident({
      service: "checkout-api",
      environment: "synthetic production",
      summary: "Checkout responses are timing out after a release.",
      recentChange: "Worker concurrency changed in the synthetic scenario.",
      impact: "Fictional demo data.",
      browserMemories: [],
    });
    expect(result.memoryMode).toBe("simulation");
    expect(result.evidence.some(item => item.kind === "synthetic")).toBe(true);
    expect(result.evidence).toHaveLength(1);
    expect(
      result.plan.hypotheses.some(item => item.title.includes("configuration"))
    ).toBe(true);
    expect(result.memoryNote).toContain("Simulation mode");
    expect(result.plan.caution).toContain("never executes");
    expect(result.baseline.readOnlyChecks.length).toBeGreaterThan(0);
  });

  it("rate-limits a demo address after the configured request budget", () => {
    const address = `test-${Date.now()}-${Math.random()}`;
    for (let index = 0; index < 30; index += 1)
      expect(allowPublicRequest(address)).toBe(true);
    expect(allowPublicRequest(address)).toBe(false);
  });

  it("matches database and identity scenarios to their own demo memories", async () => {
    if (integrationStatus().hindsightConfigured) return;
    const [database, identity] = await Promise.all([
      analyzeIncident({
        service: "orders-api",
        environment: "synthetic",
        summary:
          "Order latency follows replica growth and high Postgres connections.",
        recentChange: "Autoscaler limit increased.",
        impact: "Fictional scenario.",
        browserMemories: [],
      }),
      analyzeIncident({
        service: "identity-gateway",
        environment: "synthetic",
        summary:
          "Authentication requests return 401 after a credential rotation.",
        recentChange: "Secret version rotated.",
        impact: "Fictional scenario.",
        browserMemories: [],
      }),
    ]);
    expect(database.evidence).toHaveLength(1);
    expect(database.evidence[0]?.source).toContain("INC-2810");
    expect(
      database.plan.readOnlyChecks.some(item =>
        item.title.includes("connection demand")
      )
    ).toBe(true);
    expect(identity.evidence).toHaveLength(1);
    expect(identity.evidence[0]?.source).toContain("INC-2774");
    expect(
      identity.plan.readOnlyChecks.some(item =>
        item.title.includes("secret-version")
      )
    ).toBe(true);
  });
});
