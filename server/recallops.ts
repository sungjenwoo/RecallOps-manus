import { HindsightClient } from "@vectorize-io/hindsight-client";
import { DEMO_INCIDENTS } from "../shared/incidentSeeds";
import { createHmac } from "node:crypto";
import { runSingleCallCoordinator } from "./agents/incidentCoordinator";
import {
  SPECIALIST_ROLES,
  type AnalyzeInput,
  type Evidence,
  type IncidentPlan,
  type PlanItem,
} from "./agents/contracts";
import { ENV } from "./_core/env";

export type {
  AnalyzeInput,
  Evidence,
  IncidentPlan,
  PlanItem,
} from "./agents/contracts";

const HINDSIGHT_URL = (
  process.env.HINDSIGHT_API_URL ||
  process.env.HINDSIGHT_BASE_URL ||
  ""
).replace(/\/$/, "");
const HINDSIGHT_KEY = process.env.HINDSIGHT_API_KEY || "";
const GROQ_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const SPECIALIST_COORDINATOR_ENABLED =
  process.env.RECALLOPS_AGENT_COORDINATOR !== "false";

export function integrationStatus() {
  return {
    hindsightConfigured: Boolean(HINDSIGHT_URL),
    hindsightAuthConfigured: Boolean(HINDSIGHT_KEY),
    groqConfigured: Boolean(GROQ_KEY.trim()),
    specialistCoordinatorEnabled: SPECIALIST_COORDINATOR_ENABLED,
    authRequired: Boolean(HINDSIGHT_URL),
    mode: HINDSIGHT_URL ? ("live" as const) : ("simulation" as const),
  };
}

/** A stable opaque Hindsight bank ID for one authenticated Manus user. */
export function derivePrivateBankId(openId: string, secret = ENV.cookieSecret) {
  if (!openId || !secret)
    throw new Error(
      "A user ID and stable server secret are required for private memory."
    );
  const digest = createHmac("sha256", secret)
    .update(openId)
    .digest("hex")
    .slice(0, 32);
  return `recallops-user-${digest}`;
}

/** Pseudonym for rate-limit and audit tables; never persist the raw OAuth ID. */
export function deriveActorHash(openId: string, secret = ENV.cookieSecret) {
  if (!openId || !secret)
    throw new Error(
      "A user ID and stable server secret are required for private memory."
    );
  return createHmac("sha256", secret).update(`actor:${openId}`).digest("hex");
}

function hindsightClient() {
  if (!HINDSIGHT_URL) return null;
  return new HindsightClient({
    baseUrl: HINDSIGHT_URL,
    ...(HINDSIGHT_KEY ? { apiKey: HINDSIGHT_KEY } : {}),
  });
}

const initializedBanks = new Map<string, Promise<void>>();

async function ensurePrivateBank(client: HindsightClient, bankId: string) {
  let initialized = initializedBanks.get(bankId);
  if (!initialized) {
    initialized = client
      .createBank(bankId, {
        name: "RecallOps private memory",
        mission:
          "Store incident learning for this single signed-in user only. Keep failed fixes and human-verified resolutions connected to evidence; never treat similarity as proof.",
      })
      .then(() => undefined)
      .catch((error: unknown) => {
        initializedBanks.delete(bankId);
        throw error;
      });
    initializedBanks.set(bankId, initialized);
  }
  await initialized;
}

/** Redact common credential patterns before any user text leaves this server. */
export function redactSecrets(value: string) {
  return value
    .replace(
      /\b(?:sk|gsk|ghp|gho|github_pat)[-_][A-Za-z0-9._-]{12,}\b/gi,
      "[REDACTED_SECRET]"
    )
    .replace(/\bAKIA[0-9A-Z]{16}\b/g, "[REDACTED_AWS_KEY]")
    .replace(/\b(Bearer\s+)[A-Za-z0-9._~+/-]{12,}/gi, "$1[REDACTED_TOKEN]")
    .replace(
      /\b(password|passwd|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*[^\s,;]+/gi,
      "$1=[REDACTED]"
    );
}

function cleanText(value: string, maxLength = 2400) {
  return redactSecrets(value.trim()).slice(0, maxLength);
}

function makeSeedEvidence(): Evidence[] {
  return DEMO_INCIDENTS.map((incident, index) => ({
    id: `E${index + 1}`,
    text: `${incident.id} (${incident.occurred}) — ${incident.title}. Trigger: ${incident.trigger} Failed: ${incident.failedAction} Resolution: ${incident.resolution} Lesson: ${incident.lesson}`,
    source: `${incident.id} · synthetic postmortem`,
    kind: "synthetic",
  }));
}

function relevantDemoEvidence(input: AnalyzeInput, evidence: Evidence[]) {
  const service = input.service.toLowerCase().replace(/[^a-z0-9]/g, "");
  const exact = evidence.filter(item => {
    const incident = DEMO_INCIDENTS.find(candidate =>
      item.text.startsWith(candidate.id)
    );
    return incident
      ? service === incident.service.toLowerCase().replace(/[^a-z0-9]/g, "")
      : false;
  });
  if (exact.length) return exact.slice(0, 3);

  const stopWords = new Set([
    "after",
    "before",
    "with",
    "from",
    "that",
    "this",
    "into",
    "when",
    "were",
    "have",
    "what",
    "some",
    "only",
    "raised",
    "latest",
    "within",
    "production",
    "service",
  ]);
  const queryTerms = new Set(
    `${input.service} ${input.summary} ${input.recentChange}`
      .toLowerCase()
      .match(/[a-z0-9_-]{4,}/g)
      ?.filter(term => !stopWords.has(term)) ?? []
  );
  const ranked = evidence
    .map(item => {
      const words = item.text.toLowerCase().match(/[a-z0-9_-]{4,}/g) ?? [];
      const score = words.reduce(
        (total, word) => total + (queryTerms.has(word) ? 1 : 0),
        0
      );
      return { item, score };
    })
    .filter(entry => entry.score >= 2)
    .sort((left, right) => right.score - left.score);
  return ranked.slice(0, 3).map(entry => entry.item);
}

function normalizeEvidence(
  input: unknown,
  kind: Evidence["kind"] = "hindsight"
): Evidence[] {
  const response = input as
    | { results?: unknown[]; memories?: unknown[] }
    | unknown[];
  const rows = Array.isArray(response)
    ? response
    : Array.isArray(response?.results)
      ? response.results
      : Array.isArray(response?.memories)
        ? response.memories
        : [];

  return rows.slice(0, 8).flatMap((row, index) => {
    if (!row || typeof row !== "object") return [];
    const item = row as Record<string, unknown>;
    const text =
      typeof item.text === "string"
        ? item.text
        : typeof item.content === "string"
          ? item.content
          : "";
    if (!text.trim()) return [];
    const id =
      typeof item.id === "string" && item.id ? item.id : `E${index + 1}`;
    const context =
      typeof item.context === "string" ? item.context : "incident memory";
    const metadata =
      item.metadata && typeof item.metadata === "object"
        ? (item.metadata as Record<string, unknown>)
        : {};
    const incidentId =
      typeof metadata.incident_id === "string"
        ? metadata.incident_id
        : "Hindsight memory";
    return [
      {
        id,
        text: cleanText(text, 1800),
        source: `${incidentId} · ${context}`,
        kind,
      },
    ];
  });
}

function asBrowserEvidence(
  memories: AnalyzeInput["browserMemories"]
): Evidence[] {
  return memories.slice(0, 12).flatMap((memory, index) => {
    const text = cleanText(memory.text, 1600);
    if (!text) return [];
    return [
      {
        id: memory.id || `LOCAL-${index + 1}`,
        text,
        source: "Human-confirmed outcome · this browser",
        kind: "browser-memory",
      },
    ];
  });
}

function deterministicPlan(evidence: Evidence[]): IncidentPlan {
  const hypotheses: PlanItem[] = [];
  const checks: PlanItem[] = [
    {
      title: "Compare the current release/config diff",
      rationale:
        "Confirm which values changed and whether the alert began after that change; do not infer causality from timing alone.",
      evidenceIds: [],
    },
    {
      title: "Inspect read-only service and dependency metrics",
      rationale:
        "Compare queue depth, connection saturation, error rate, and healthy-pod distribution before choosing a remediation.",
      evidenceIds: [],
    },
  ];

  evidence.forEach(item => {
    const text = item.text.toLowerCase();
    const refs = [item.id];
    if (
      /restart|reboot/.test(text) &&
      /failed|did not|no effect|briefly|ineffective/.test(text)
    ) {
      hypotheses.push({
        title: "A restart may not address the underlying pressure",
        rationale:
          "A prior incident in memory reports that restarts did not produce a durable recovery. Treat this as a caution, not a diagnosis of the current event.",
        evidenceIds: refs,
      });
    }
    if (
      /rollback|config|concurrency|pool size|connection/.test(text) &&
      /resolved|recovered|reduced|restored|returned to baseline|rolled.{0,40}back/.test(
        text
      )
    ) {
      hypotheses.push({
        title: "A configuration change is worth checking first",
        rationale:
          "A related postmortem links recovery to a verified configuration adjustment. Compare the current diff and live telemetry before considering any change.",
        evidenceIds: refs,
      });
    }
    if (/secret|credential|rotation/.test(text)) {
      checks.push({
        title: "Verify secret-version metadata without revealing values",
        rationale:
          "Prior memory describes stale mounted versions after rotation; compare version identifiers and pod age only.",
        evidenceIds: refs,
      });
    }
    if (/postgres|database|connection pool/.test(text)) {
      checks.push({
        title: "Estimate total dependency connection demand",
        rationale:
          "Compare replicas × per-instance pool size with the database's observed active-connection limit.",
        evidenceIds: refs,
      });
    }
  });

  const uniqueHypotheses = hypotheses
    .filter(
      (item, index, items) =>
        items.findIndex(candidate => candidate.title === item.title) === index
    )
    .slice(0, 3);
  return {
    confidence: evidence.length > 0 ? "medium" : "low",
    triageSummary: "",
    memoryBrief: { summary: "", evidenceIds: [] },
    hypotheses: uniqueHypotheses,
    readOnlyChecks: checks
      .filter(
        (item, index, items) =>
          items.findIndex(candidate => candidate.title === item.title) === index
      )
      .slice(0, 4),
    playbookSteps: checks
      .filter(
        (item, index, items) =>
          items.findIndex(candidate => candidate.title === item.title) === index
      )
      .slice(0, 4),
    caution:
      "Historical similarity is evidence to investigate—not proof of the current root cause. RecallOps never executes a remediation.",
  };
}

export async function analyzeIncident(input: AnalyzeInput, bankId?: string) {
  const safeInput = {
    ...input,
    service: cleanText(input.service, 100),
    environment: cleanText(input.environment, 120),
    summary: cleanText(input.summary, 1800),
    recentChange: cleanText(input.recentChange, 900),
    impact: cleanText(input.impact, 600),
  };
  // Browser-supplied lessons are simulation-only; live analyses must use server-side Hindsight recall.
  const clientMemories = HINDSIGHT_URL
    ? []
    : asBrowserEvidence(input.browserMemories);
  let evidence: Evidence[] = [];
  let memoryMode: "hindsight" | "simulation" | "fallback" = HINDSIGHT_URL
    ? "hindsight"
    : "simulation";
  let memoryNote = "";

  if (HINDSIGHT_URL) {
    try {
      const client = hindsightClient();
      if (!client || !bankId)
        throw new Error(
          "An authenticated private bank is required for live recall."
        );
      await ensurePrivateBank(client, bankId);
      const response = await client.recall(
        bankId,
        `${safeInput.service}: ${safeInput.summary} Recent change: ${safeInput.recentChange}`,
        { budget: "mid", maxTokens: 2200 }
      );
      evidence = normalizeEvidence(response);
      if (evidence.length === 0)
        memoryNote =
          "Hindsight is connected, but no matching bank memories were returned. Load the clearly synthetic demo pack or save a confirmed outcome to begin the learning loop.";
    } catch (error) {
      console.error(
        "[RecallOps] Hindsight recall failed:",
        error instanceof Error ? error.message : "unknown error"
      );
      memoryMode = "fallback";
      memoryNote =
        "Hindsight could not be reached for this analysis. Synthetic examples are shown as fallback evidence; this result is not a live memory recall.";
      evidence = relevantDemoEvidence(safeInput, makeSeedEvidence());
    }
  } else {
    evidence = relevantDemoEvidence(safeInput, makeSeedEvidence());
    memoryNote =
      "Simulation mode: the examples below are fictional. Configure Hindsight to store and retrieve persistent team memory.";
  }

  const serviceTokens = new Set(
    safeInput.service
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(part => part.length > 2)
  );
  const relevantBrowserMemories = clientMemories.filter(item => {
    const text = item.text.toLowerCase();
    return (
      serviceTokens.size === 0 ||
      Array.from(serviceTokens).some(token => text.includes(token))
    );
  });
  evidence = [...evidence, ...relevantBrowserMemories].slice(0, 10);
  const modelPlan = SPECIALIST_COORDINATOR_ENABLED
    ? await runSingleCallCoordinator(safeInput, evidence, {
        apiKey: GROQ_KEY,
        model: GROQ_MODEL,
        sanitizeText: cleanText,
      })
    : null;
  const modelCalls: 0 | 1 =
    SPECIALIST_COORDINATOR_ENABLED && GROQ_KEY.trim() ? 1 : 0;
  const plan = modelPlan || deterministicPlan(evidence);
  const baseline = deterministicPlan([]);
  return {
    id: `AN-${Date.now().toString(36).toUpperCase()}`,
    createdAt: Date.now(),
    service: safeInput.service,
    environment: safeInput.environment,
    summary: safeInput.summary,
    recentChange: safeInput.recentChange,
    evidence,
    plan,
    baseline,
    agentRun: modelPlan
      ? {
          mode: "single-call" as const,
          roles: [...SPECIALIST_ROLES],
          modelCalls: 1,
        }
      : { mode: "rules-fallback" as const, roles: [], modelCalls },
    memoryMode,
    modelSource: modelPlan
      ? `Groq · ${GROQ_MODEL} · single-call coordinator`
      : SPECIALIST_COORDINATOR_ENABLED
        ? GROQ_KEY.trim()
          ? "Evidence-guided rules · one Groq call failed or was rejected"
          : "Evidence-guided rules · no model key configured"
        : "Evidence-guided rules · specialist coordinator disabled",
    memoryNote,
    redactionApplied: [
      input.service,
      input.environment,
      input.summary,
      input.recentChange,
      input.impact,
    ].some(value => redactSecrets(value) !== value),
  };
}

export async function retainConfirmedOutcome(
  input: {
    incidentId: string;
    service: string;
    summary: string;
    rootCause: string;
    failedActions: string;
    successfulResolution: string;
    followUp: string;
  },
  bankId?: string
) {
  const client = hindsightClient();
  if (!client)
    return {
      saved: true,
      mode: "simulation" as const,
      documentId: `browser-${input.incidentId}`,
    };
  if (!bankId)
    throw new Error(
      "An authenticated private bank is required for live retention."
    );
  await ensurePrivateBank(client, bankId);

  const content = [
    `Human-confirmed incident postmortem ${input.incidentId} for ${cleanText(input.service, 100)}.`,
    `Incident symptoms: ${cleanText(input.summary, 1800)}`,
    `Confirmed root cause: ${cleanText(input.rootCause, 1000)}`,
    `Actions that failed or were ineffective: ${cleanText(input.failedActions, 900) || "None reported."}`,
    `Successful resolution (confirmed by the engineer): ${cleanText(input.successfulResolution, 1200)}`,
    `Follow-up lesson: ${cleanText(input.followUp, 900) || "No additional follow-up recorded."}`,
    "This is a historical observation. It does not prove the cause of a future incident; verify current evidence before acting.",
  ].join("\n");
  const documentId = `recallops-postmortem-${input.incidentId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80)}`;
  await client.retain(bankId, content, {
    context: "human-confirmed synthetic incident postmortem",
    documentId,
    metadata: {
      source: "recallops",
      incident_id: input.incidentId,
      confirmation: "human-confirmed",
    },
  });
  return { saved: true, mode: "hindsight" as const, documentId };
}

export async function seedHindsightBank(bankId?: string) {
  const client = hindsightClient();
  if (!client)
    return {
      saved: false,
      mode: "simulation" as const,
      count: DEMO_INCIDENTS.length,
    };
  if (!bankId)
    throw new Error(
      "An authenticated private bank is required for live seeding."
    );
  await ensurePrivateBank(client, bankId);
  for (const incident of DEMO_INCIDENTS) {
    const content = [
      `Synthetic incident ${incident.id} (${incident.occurred}) for ${incident.service}: ${incident.title}.`,
      `Trigger and observed facts: ${incident.trigger}`,
      `Failed or ineffective action: ${incident.failedAction}`,
      `Confirmed resolution in this fictional training scenario: ${incident.resolution}`,
      `Lesson for future investigations: ${incident.lesson}`,
      "Synthetic training data only. A related incident is not proof of the same root cause.",
    ].join("\n");
    await client.retain(bankId, content, {
      context: "synthetic training postmortem",
      documentId: `recallops-demo-${incident.id.toLowerCase()}`,
      metadata: {
        source: "recallops-demo-pack",
        incident_id: incident.id,
        environment: "synthetic",
      },
    });
  }
  return {
    saved: true,
    mode: "hindsight" as const,
    count: DEMO_INCIDENTS.length,
  };
}

const requestBuckets = new Map<string, { count: number; resetAt: number }>();
export function allowPublicRequest(address: string | undefined) {
  const key = address || "unknown";
  const now = Date.now();
  if (requestBuckets.size > 5000) {
    requestBuckets.forEach((bucket, bucketKey) => {
      if (bucket.resetAt <= now) requestBuckets.delete(bucketKey);
    });
  }
  const current = requestBuckets.get(key);
  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 30) return false;
  current.count += 1;
  return true;
}
