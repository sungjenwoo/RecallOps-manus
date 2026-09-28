import { describe, expect, it, vi } from "vitest";
import {
  getAgentEvaluationCases,
  runAgentCoordinatorEvaluation,
} from "./evaluation";

function responseForRequest(init?: RequestInit) {
  const body = JSON.parse(String(init?.body)) as {
    messages: Array<{ role: string; content: string }>;
  };
  const userPayload = JSON.parse(body.messages[1]!.content) as {
    evidence: Array<{ id: string }>;
  };
  const evidenceIds = userPayload.evidence[0]
    ? [userPayload.evidence[0].id]
    : [];
  const plan = {
    confidence: evidenceIds.length > 0 ? "medium" : "low",
    triageSummary: "This is a synthetic evaluation response.",
    memoryBrief: {
      summary: evidenceIds.length
        ? "A cited pattern may be relevant, not proof."
        : "",
      evidenceIds,
    },
    hypotheses: [
      {
        title: "A supplied signal may be relevant",
        rationale: "Verify this hypothesis against current observations.",
        evidenceIds,
      },
    ],
    readOnlyChecks: [
      {
        title: "Compare current read-only service metrics",
        rationale: "Inspect only the supplied fictional measurements.",
        evidenceIds,
      },
    ],
    playbookSteps: [
      {
        title: "Review the available evidence",
        rationale:
          "Use current observations; a historical pattern is not proof.",
        evidenceIds,
      },
    ],
  };
  return new Response(
    JSON.stringify({
      choices: [{ message: { content: JSON.stringify(plan) } }],
      usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

describe("synthetic specialist golden-set evaluation", () => {
  it("covers every fictional scenario and the planned edge cases", () => {
    const cases = getAgentEvaluationCases();
    const names = cases.map(item => item.name);

    expect(names).toEqual([
      "scenario:checkout",
      "scenario:database",
      "scenario:identity",
      "edge:weak-evidence",
      "edge:conflicting-memories",
      "edge:secret-like-input",
      "edge:empty-recall",
    ]);
    expect(
      cases.every(item =>
        item.evidence.every(evidence => evidence.kind === "synthetic")
      )
    ).toBe(true);
  });

  it("measures a one-call safe result per fixture using only the injected mock provider", async () => {
    const fetcher = vi.fn(
      async (_url: string | URL | Request, init?: RequestInit) =>
        responseForRequest(init)
    );

    const report = await runAgentCoordinatorEvaluation({
      apiKey: "test-key",
      model: "test-model",
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledTimes(7);
    expect(report.caseCount).toBe(7);
    expect(report.providerCalls).toBe(7);
    expect(report.passingCases).toBe(7);
    expect(report.fallbackCount).toBe(0);
    expect(report.safetyGatePassed).toBe(true);
    expect(report.manualQualityReviewRequired).toBe(true);
    expect(report.totalTokens).toBe(1_050);
    expect(report.latencyP50Ms).not.toBeNull();
    expect(report.latencyP95Ms).not.toBeNull();
    expect(
      report.cases.every(
        item =>
          item.providerCalls === 1 &&
          item.citationSafe &&
          item.unsafeContentReturned === 0 &&
          item.requestRedacted
      )
    ).toBe(true);
    expect(
      report.cases.find(item => item.name === "edge:empty-recall")?.citationSafe
    ).toBe(true);
  });

  it("refuses to evaluate without a key before making any provider call", async () => {
    const fetcher = vi.fn();
    await expect(
      runAgentCoordinatorEvaluation({
        apiKey: " ",
        model: "test-model",
        fetcher,
      })
    ).rejects.toThrow("no provider request was made");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("reports provider outages as fallbacks rather than successful evaluations", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ error: "synthetic provider outage" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
    );

    const report = await runAgentCoordinatorEvaluation({
      apiKey: "test-key",
      model: "test-model",
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledTimes(7);
    expect(report.providerCalls).toBe(7);
    expect(report.fallbackCount).toBe(7);
    expect(report.fallbackRate).toBe(1);
    expect(report.passingCases).toBe(0);
    expect(report.safetyGatePassed).toBe(false);
  });
});
