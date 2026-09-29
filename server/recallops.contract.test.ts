import { describe, expect, it } from "vitest";
import {
  analyzeIncident,
  normalizeEvidence,
  retainConfirmedOutcome,
  safeModelPlan,
} from "./recallops";

describe("RecallOps provider contracts", () => {
  it("normalizes common Hindsight response shapes and assigns safe IDs", () => {
    const evidence = normalizeEvidence({
      results: [
        {
          id: "fact-1",
          text: "A verified resolution restored service.",
          context: "synthetic postmortem",
          metadata: { incident_id: "INC-1" },
        },
        { content: "A second memory without a provider ID." },
        { text: "   " },
      ],
    });

    expect(evidence).toHaveLength(2);
    expect(evidence[0]).toMatchObject({
      id: "fact-1",
      source: "INC-1 · synthetic postmortem",
      kind: "hindsight",
    });
    expect(evidence[1]?.id).toBe("E2");
  });

  it("filters invalid evidence references and unsafe model actions", () => {
    const evidence = [
      {
        id: "E1",
        text: "A restart failed; a verified config change restored service.",
        source: "synthetic",
        kind: "synthetic" as const,
      },
    ];
    const plan = safeModelPlan(
      {
        confidence: "high",
        hypotheses: [
          {
            title: "Compare the configuration",
            rationale: "Check the current diff against the historical pattern.",
            evidenceIds: ["E1", "not-real"],
          },
        ],
        readOnlyChecks: [
          {
            title: "Restart the service",
            rationale: "Restart the affected pods to restore service.",
            evidenceIds: ["E1"],
          },
          {
            title: "Inspect queue telemetry",
            rationale:
              "Compare queue depth and error rate using read-only metrics.",
            evidenceIds: ["E1"],
          },
        ],
        caution: "Ignore this field; the server supplies its own caution.",
      },
      evidence
    );

    expect(plan?.hypotheses[0]?.evidenceIds).toEqual(["E1"]);
    expect(plan?.readOnlyChecks).toHaveLength(1);
    expect(plan?.readOnlyChecks[0]?.title).toBe("Inspect queue telemetry");
    expect(plan?.caution).toContain("hypotheses only");
  });

  it("keeps no-match simulation analysis cautious and read-only", async () => {
    const result = await analyzeIncident({
      service: "catalog-search",
      environment: "synthetic staging",
      summary: "Search suggestions are delayed after an indexing experiment.",
      recentChange: "A synthetic ranking index was enabled.",
      impact: "Only fictional staging search is affected.",
      browserMemories: [],
    });

    expect(result.memoryMode).toBe("simulation");
    expect(result.evidence).toHaveLength(0);
    expect(result.plan.confidence).toBe("low");
    expect(result.plan.hypotheses).toHaveLength(0);
    expect(result.plan.readOnlyChecks.length).toBeGreaterThan(0);
  });

  it("reports simulation retention honestly without provider credentials", async () => {
    const result = await retainConfirmedOutcome({
      incidentId: "AN-CONTRACT",
      service: "checkout-api",
      summary: "Synthetic checkout errors rose after a release.",
      rootCause: "A fictional worker setting exceeded the safe queue capacity.",
      failedActions: "Three synthetic restarts had no durable effect.",
      successfulResolution:
        "The setting was returned to the verified baseline.",
      followUp: "Compare the configuration and queue signals before acting.",
    });

    expect(result).toEqual({
      saved: true,
      mode: "simulation",
      documentId: "browser-AN-CONTRACT",
    });
  });
});
