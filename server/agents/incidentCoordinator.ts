import {
  SINGLE_CALL_PLAN_SCHEMA,
  SINGLE_CALL_SYSTEM_PROMPT,
  type AnalyzeInput,
  type Evidence,
  type IncidentPlan,
  type PlanItem,
} from "./contracts";

export type TextSanitizer = (value: string, maxLength: number) => string;

export type CoordinatorOptions = {
  apiKey: string;
  model: string;
  sanitizeText: TextSanitizer;
  fetcher?: typeof fetch;
  timeoutMs?: number;
};

const GROQ_CHAT_COMPLETIONS_URL =
  "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_COMPLETION_TOKENS = 3_000;
const UNSAFE_ACTION_LANGUAGE =
  /\b(restart|delete|drop|kill|flush|purge|scale|rollback|apply|update|write|terminate|reboot)\b/i;

function parseJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed: unknown = JSON.parse(trimmed.slice(start, end + 1));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function validEvidenceIds(value: unknown, validIds: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .filter(
          (id): id is string => typeof id === "string" && validIds.has(id)
        )
        .slice(0, 4)
    )
  );
}

function safePlanItems(
  value: unknown,
  validIds: Set<string>,
  sanitizeText: TextSanitizer
): PlanItem[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 4).flatMap(row => {
    const item = asRecord(row);
    if (!item) return [];
    const title =
      typeof item.title === "string" ? sanitizeText(item.title, 160) : "";
    const rationale =
      typeof item.rationale === "string"
        ? sanitizeText(item.rationale, 420)
        : "";
    if (
      !title ||
      !rationale ||
      UNSAFE_ACTION_LANGUAGE.test(`${title} ${rationale}`)
    ) {
      return [];
    }
    return [
      {
        title,
        rationale,
        evidenceIds: validEvidenceIds(item.evidenceIds, validIds),
      },
    ];
  });
}

export function validateCoordinatorOutput(
  parsed: Record<string, unknown> | null,
  evidence: Evidence[],
  sanitizeText: TextSanitizer
): IncidentPlan | null {
  if (!parsed) return null;
  const validIds = new Set(evidence.map(item => item.id));
  const rawMemoryBrief = asRecord(parsed.memoryBrief);
  const memoryEvidenceIds = validEvidenceIds(
    rawMemoryBrief?.evidenceIds,
    validIds
  );
  const memorySummary =
    memoryEvidenceIds.length > 0 && typeof rawMemoryBrief?.summary === "string"
      ? sanitizeText(rawMemoryBrief.summary, 360)
      : "";

  return {
    confidence:
      parsed.confidence === "high" || parsed.confidence === "medium"
        ? parsed.confidence
        : "low",
    triageSummary:
      typeof parsed.triageSummary === "string"
        ? sanitizeText(parsed.triageSummary, 360)
        : "",
    memoryBrief: {
      summary: memorySummary,
      evidenceIds: memorySummary ? memoryEvidenceIds : [],
    },
    hypotheses: safePlanItems(parsed.hypotheses, validIds, sanitizeText),
    readOnlyChecks: safePlanItems(
      parsed.readOnlyChecks,
      validIds,
      sanitizeText
    ),
    playbookSteps: safePlanItems(parsed.playbookSteps, validIds, sanitizeText),
    caution:
      "AI-generated ideas are hypotheses only. Verify current telemetry; no remediation is run by this app.",
  };
}

function coordinatorRequestBody(
  input: AnalyzeInput,
  evidence: Evidence[],
  model: string,
  sanitizeText: TextSanitizer
) {
  return {
    model,
    temperature: 0.15,
    max_completion_tokens: MAX_COMPLETION_TOKENS,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "recallops_single_call_agents",
        strict: true,
        schema: SINGLE_CALL_PLAN_SCHEMA,
      },
    },
    messages: [
      { role: "system", content: SINGLE_CALL_SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({
          incident: {
            service: sanitizeText(input.service, 100),
            environment: sanitizeText(input.environment, 120),
            summary: sanitizeText(input.summary, 1800),
            recentChange: sanitizeText(input.recentChange, 900),
            impact: sanitizeText(input.impact, 600),
          },
          evidence: evidence.map(({ id, text }) => ({
            id: sanitizeText(id, 80),
            text: sanitizeText(text, 1800),
          })),
        }),
      },
    ],
  };
}

/** Runs one bounded model request for all specialist roles; failures return null. */
export async function runSingleCallCoordinator(
  input: AnalyzeInput,
  evidence: Evidence[],
  options: CoordinatorOptions
): Promise<IncidentPlan | null> {
  if (!options.apiKey.trim()) return null;
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );
  try {
    const fetcher = options.fetcher ?? globalThis.fetch;
    const response = await fetcher(GROQ_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(
        coordinatorRequestBody(
          input,
          evidence,
          options.model,
          options.sanitizeText
        )
      ),
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    const root = asRecord(payload);
    const choices = root && Array.isArray(root.choices) ? root.choices : [];
    const firstChoice = asRecord(choices[0]);
    const message = asRecord(firstChoice?.message);
    const content = message?.content;
    if (typeof content !== "string") return null;
    return validateCoordinatorOutput(
      parseJsonObject(content),
      evidence,
      options.sanitizeText
    );
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
