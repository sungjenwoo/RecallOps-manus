import { describe, expect, it, vi } from "vitest";
import type { AnalyzeInput, Evidence } from "./contracts";
import {
  runSingleCallCoordinator,
  validateCoordinatorOutput,
} from "./incidentCoordinator";

const input: AnalyzeInput = {
  service: "checkout-api",
  environment: "synthetic production",
  summary: "Checkout responses time out after a release change.",
  recentChange: "Worker concurrency changed.",
  impact: "Fictional demo scenario.",
  browserMemories: [],
};

const evidence: Evidence[] = [
  {
    id: "MEM-1",
    text: "A prior synthetic incident improved after a verified pool adjustment.",
    source: "INC-2810 · synthetic postmortem",
    kind: "synthetic",
  },
];

const sanitizeText = (value: string, maxLength: number) =>
  value.trim().slice(0, maxLength);

function validModelOutput() {
  return {
    confidence: "medium",
    triageSummary: "Timeouts began after a worker-pool change.",
    memoryBrief: {
      summary: "A prior capacity pattern may be relevant, but is not proof.",
      evidenceIds: ["MEM-1"],
    },
    hypotheses: [
      {
        title: "Worker-pool pressure may be contributing",
        rationale: "The supplied symptoms followed a worker-pool change.",
        evidenceIds: ["MEM-1"],
      },
    ],
    readOnlyChecks: [
      {
        title: "Compare release and worker-pool metrics",
        rationale: "Inspect the configuration diff and queue metrics only.",
        evidenceIds: ["MEM-1"],
      },
    ],
    playbookSteps: [
      {
        title: "Review queue depth and worker saturation",
        rationale:
          "Compare the current observations with the supplied pattern.",
        evidenceIds: ["MEM-1"],
      },
    ],
  };
}

function completionResponse(content: string, status = 200) {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("single-call incident coordinator", () => {
  it("runs all specialist roles in exactly one strict-schema model call", async () => {
    const fetcher = vi.fn(
      async (_url: string | URL | Request, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body)) as {
          model: string;
          max_completion_tokens: number;
          response_format: {
            json_schema: { name: string; strict: boolean; schema: unknown };
          };
          messages: Array<{ role: string; content: string }>;
        };
        expect(body.model).toBe("test-model");
        expect(body.max_completion_tokens).toBe(3_000);
        expect(body.response_format.json_schema.name).toBe(
          "recallops_single_call_agents"
        );
        expect(body.response_format.json_schema.strict).toBe(true);
        expect(body.messages[0]?.content).toContain("Memory Scout");
        expect(body.messages[0]?.content).toContain("Playbook Composer");
        return completionResponse(JSON.stringify(validModelOutput()));
      }
    );

    const plan = await runSingleCallCoordinator(input, evidence, {
      apiKey: "test-key",
      model: "test-model",
      sanitizeText,
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(plan?.triageSummary).toContain("worker-pool");
    expect(plan?.memoryBrief.evidenceIds).toEqual(["MEM-1"]);
    expect(plan?.playbookSteps).toHaveLength(1);
  });

  it("filters unknown citations and rejects unsafe check/playbook language", () => {
    const raw = validModelOutput();
    raw.memoryBrief.evidenceIds = ["OTHER-USER-ID"];
    raw.memoryBrief.summary = "Invented cross-account memory.";
    raw.readOnlyChecks.push({
      title: "Roll back the release",
      rationale: "Do this now.",
      evidenceIds: ["MEM-1"],
    });
    raw.playbookSteps.push({
      title: "Rollback the release",
      rationale: "The past pattern proves it is safe.",
      evidenceIds: ["MEM-1"],
    });

    const plan = validateCoordinatorOutput(raw, evidence, sanitizeText);

    expect(plan?.memoryBrief).toEqual({ summary: "", evidenceIds: [] });
    expect(plan?.readOnlyChecks).toHaveLength(1);
    expect(plan?.playbookSteps).toHaveLength(1);
    expect(plan?.caution).toContain("hypotheses only");
  });

  it("removes shell and CLI commands from otherwise read-only-looking checks", () => {
    const raw = validModelOutput();
    raw.readOnlyChecks[0]!.title = "Run kubectl get pods";

    const plan = validateCoordinatorOutput(raw, evidence, sanitizeText);

    expect(plan?.readOnlyChecks).toHaveLength(0);
  });

  it("removes unsafe action language from triage and memory summaries", () => {
    const raw = validModelOutput();
    raw.triageSummary = "Restart the service immediately.";
    raw.memoryBrief.summary = "Rollback the latest deployment now.";

    const plan = validateCoordinatorOutput(raw, evidence, sanitizeText);

    expect(plan?.triageSummary).toBe("");
    expect(plan?.memoryBrief).toEqual({ summary: "", evidenceIds: [] });
  });

  it("rejects parseable JSON that is incomplete, has extra fields, or malformed items", () => {
    expect(validateCoordinatorOutput({}, evidence, sanitizeText)).toBeNull();

    const incomplete: Record<string, unknown> = { ...validModelOutput() };
    delete incomplete.playbookSteps;
    expect(
      validateCoordinatorOutput(incomplete, evidence, sanitizeText)
    ).toBeNull();

    const extraField = {
      ...validModelOutput(),
      internalReasoning: "This field is not part of the output contract.",
    };
    expect(
      validateCoordinatorOutput(extraField, evidence, sanitizeText)
    ).toBeNull();

    const malformedItem: Record<string, unknown> = { ...validModelOutput() };
    const hypotheses = malformedItem.hypotheses as Array<
      Record<string, unknown>
    >;
    delete hypotheses[0]!.rationale;
    expect(
      validateCoordinatorOutput(malformedItem, evidence, sanitizeText)
    ).toBeNull();
  });

  it("does not call a provider when no API key is configured", async () => {
    const fetcher = vi.fn();
    await expect(
      runSingleCallCoordinator(input, evidence, {
        apiKey: "",
        model: "test-model",
        sanitizeText,
        fetcher,
      })
    ).resolves.toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns null on provider errors or malformed output so rules fallback can run", async () => {
    const providerFailure = vi.fn(async () => completionResponse("", 503));
    const malformed = vi.fn(async () => completionResponse("not valid JSON"));
    const schemaIncomplete = vi.fn(async () =>
      completionResponse(JSON.stringify({ confidence: "low" }))
    );
    const common = {
      apiKey: "test-key",
      model: "test-model",
      sanitizeText,
    };

    await expect(
      runSingleCallCoordinator(input, evidence, {
        ...common,
        fetcher: providerFailure,
      })
    ).resolves.toBeNull();
    await expect(
      runSingleCallCoordinator(input, evidence, {
        ...common,
        fetcher: malformed,
      })
    ).resolves.toBeNull();
    await expect(
      runSingleCallCoordinator(input, evidence, {
        ...common,
        fetcher: schemaIncomplete,
      })
    ).resolves.toBeNull();
    expect(providerFailure).toHaveBeenCalledTimes(1);
    expect(malformed).toHaveBeenCalledTimes(1);
    expect(schemaIncomplete).toHaveBeenCalledTimes(1);
  });

  it("aborts a hung provider request at the configured timeout", async () => {
    const fetcher = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal;
          if (!signal) {
            reject(new Error("Expected abort signal"));
            return;
          }
          signal.addEventListener(
            "abort",
            () => reject(new Error("Request timed out")),
            { once: true }
          );
        })
    );

    await expect(
      runSingleCallCoordinator(input, evidence, {
        apiKey: "test-key",
        model: "test-model",
        sanitizeText,
        fetcher,
        timeoutMs: 5,
      })
    ).resolves.toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
