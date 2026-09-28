export const SPECIALIST_ROLES = [
  "incident-triage",
  "memory-scout",
  "read-only-planner",
  "playbook-composer",
] as const;

export type SpecialistRole = (typeof SPECIALIST_ROLES)[number];
export type CoordinatorMode = "single-call" | "rules-fallback";

export const SPECIALIST_ROLE_LABELS: Record<SpecialistRole, string> = {
  "incident-triage": "Incident Triage",
  "memory-scout": "Memory Scout",
  "read-only-planner": "Read-only Planner",
  "playbook-composer": "Playbook Composer",
};

export type AgentRun = {
  mode: CoordinatorMode;
  roles: SpecialistRole[];
  modelCalls: 0 | 1;
};

export type Evidence = {
  id: string;
  text: string;
  source: string;
  kind: "hindsight" | "synthetic" | "browser-memory";
};

export type PlanItem = {
  title: string;
  rationale: string;
  evidenceIds: string[];
};

export type IncidentPlan = {
  confidence: "low" | "medium" | "high";
  triageSummary: string;
  memoryBrief: {
    summary: string;
    evidenceIds: string[];
  };
  hypotheses: PlanItem[];
  readOnlyChecks: PlanItem[];
  playbookSteps: PlanItem[];
  caution: string;
};

export type AnalyzeInput = {
  service: string;
  environment: string;
  summary: string;
  recentChange: string;
  impact: string;
  browserMemories: Array<{ id: string; text: string }>;
};

const planItemSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    rationale: { type: "string" },
    evidenceIds: { type: "array", items: { type: "string" } },
  },
  required: ["title", "rationale", "evidenceIds"],
  additionalProperties: false,
} as const;

export const SINGLE_CALL_PLAN_SCHEMA = {
  type: "object",
  properties: {
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    triageSummary: { type: "string" },
    memoryBrief: {
      type: "object",
      properties: {
        summary: { type: "string" },
        evidenceIds: { type: "array", items: { type: "string" } },
      },
      required: ["summary", "evidenceIds"],
      additionalProperties: false,
    },
    hypotheses: { type: "array", items: planItemSchema },
    readOnlyChecks: { type: "array", items: planItemSchema },
    playbookSteps: { type: "array", items: planItemSchema },
  },
  required: [
    "confidence",
    "triageSummary",
    "memoryBrief",
    "hypotheses",
    "readOnlyChecks",
    "playbookSteps",
  ],
  additionalProperties: false,
} as const;

export const SINGLE_CALL_SYSTEM_PROMPT = `You are the single-call RecallOps coordinator. In this one response, complete four bounded specialist roles and return only the requested structured JSON. Do not expose chain-of-thought or private internal reasoning.

Specialist roles:
1. Incident Triage: summarize only the incident context supplied by the user; do not claim a root cause as fact.
2. Memory Scout: compare only the supplied memory evidence. Cite only supplied evidence IDs. If no supplied memory is relevant, return an empty summary and empty evidenceIds.
3. Read-only Planner: provide hypotheses and observational checks only. Do not give shell commands or instructions to restart, roll back, write, delete, scale, apply, update, or otherwise change systems.
4. Playbook Composer: organize a short ordered sequence of observational checks. Treat historical patterns as clues, not procedures or proof. Never include remediation steps.

Every evidenceIds value must be an ID from the supplied evidence list. If evidence is weak, say so through low confidence and conservative text. Do not invent telemetry, tools, source records, or actions. The server will independently validate every citation and reject unsafe plan items.`;
