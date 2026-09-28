# RecallOps AI-Agent Roadmap

**Status:** Implementation started — selected path: single on-demand coordinator with specialist prompt modules
**Purpose:** Add feature-focused AI specialists to RecallOps without weakening its private-memory, evidence, or human-approval boundaries.

## Interpretation

This plan assumes “agents for each feature” means **specialist agents inside the RecallOps product** that help its users investigate and learn from incidents. It does not assume autonomous coding agents that edit this repository. If the intent is coding agents, that should be planned as a separate developer workflow.

## Current foundation

The repository already has useful building blocks:

- React/TypeScript UI with **Incident room**, **Memory bank**, **Playbooks**, **Activity**, and **Usage & audit** sections.
- A server-side Hindsight integration with an opaque, authenticated bank per signed-in user.
- An optional Groq structured-output incident planner, evidence-ID validation, risky-action filtering, and a deterministic fallback.
- Human confirmation before retaining a verified outcome; seed memories use clearly fictional content and stable document IDs.
- Per-user request limits, pseudonymous audit events, in-app quota alerts, and an explicit simulation mode.

The current Sandbox has no Groq, Hindsight, or database runtime configuration. Until a deployment is configured, agent behavior can be tested with fixtures and mocks, but not claimed as live.

## Architecture choices

| Approach                                           | Tradeoffs                                                                                                                                                                                                                                                                                                                | Cost                                                                                 | Setup Complexity |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ---------------- |
| **Parallel on-demand specialists**                 | Separate triage and read-only planning calls can run concurrently after one private-memory recall. May lower elapsed time versus sequential specialist calls, but adds model calls, coordination, and possible disagreement. Parallelism does not guarantee a faster response than today's single planner; benchmark it. | Medium/variable: usage grows with the number of model calls and tokens per incident. | Medium           |
| **One coordinator with specialist prompt modules** | Keep one model request per analysis, but define clear internal roles and typed sections for triage, evidence use, and checks. Lowest-risk way to improve structure; less independent reasoning and less parallel speed-up.                                                                                               | Low incremental cost: largely the existing planner call.                             | Low              |
| **Background agent jobs**                          | Agents can continue after the user leaves and support longer workflows, but need durable job state, retries, result delivery, cancellation, retention rules, and operational monitoring. They are not necessary just to parallelize one incident request.                                                                | Highest/recurring: hosting plus model usage and job-state operations.                | High             |

**Selected by the user:** user-facing product specialists coordinated by one on-demand server path, reusing the existing Groq integration when configured. One analysis may make at most one Groq request. Parallel independent agents, autonomous tools, developer agents, and background jobs are out of scope for this stage.

## Proposed specialist map

| RecallOps area                  | Proposed role                         | Allowed work                                                                                                                                  | Keep out of scope                                                                                                  |
| ------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Incident room**               | Triage analyst                        | Normalize the supplied synthetic/authorized incident description; identify likely service area, uncertainty, and questions for the responder. | No diagnosis stated as fact; no commands or production access.                                                     |
| **Incident room**               | Read-only investigation planner       | Suggest observable checks and hypotheses using only supplied incident fields and cited memories.                                              | No shell, telemetry connector, remediation, restart, rollback, configuration change, or write tool.                |
| **Memory bank**                 | Private-memory scout                  | Ask Hindsight for relevant memories in the authenticated user's bank and return concise excerpts with valid source IDs.                       | No browser-selected bank IDs, cross-user retrieval, or automatic retention.                                        |
| **Playbooks**                   | Playbook composer                     | Organize supported evidence into an ordered checklist, showing which steps are generic and which are grounded in a cited prior incident.      | No execution of the checklist and no unsupported “known fix” claims.                                               |
| **Post-incident learning loop** | Outcome curator                       | Prepare a compact memory candidate from the human-confirmed root cause and resolution.                                                        | No write until the user explicitly confirms; no unverified agent output retained.                                  |
| **Activity**                    | Optional personal timeline summarizer | Summarize the requesting user's own metadata-only activity if users demonstrate a need for it.                                                | No free-text incident details, peer activity, or identities. Defer unless the feature has clear value.             |
| **Usage & audit**               | Keep deterministic initially          | Existing request counters and explicit rules are faster, cheaper, inspectable, and easier to test than an LLM for thresholds.                 | Do not send actor-level audit rows to an LLM. A future explanation feature may use only approved aggregate counts. |

## Recommended system shape (not a route selection)

Use **one server-side coordinator** as the only entry point. Treat specialists as constrained modules called by that coordinator—not independent services with their own credentials, memory banks, or production tools.

1. Authenticate the user, derive the private bank server-side, enforce the existing request budget, and redact inputs.
2. Retrieve relevant Hindsight evidence once for that analysis; keep it scoped to the user's bank.
3. Produce separate typed role sections within the single model response; do not fan out or issue additional model requests.
4. Validate every result against a shared schema. Reject citations not present in the current retrieval set, remove unsafe action-like suggestions, and merge results deterministically where possible.
5. Return concise hypotheses, checks, uncertainty, and evidence citations. If a specialist fails, times out, or returns invalid data, fall back to the existing safe planner/rules path and label the source honestly.
6. Retain nothing from intermediate reasoning. Only a user-confirmed outcome may enter the private Hindsight bank through the existing confirmation flow.

## Staged delivery

### Stage 0 — Confirm intent and establish a baseline

- [x] Confirm the target is user-facing product specialists, not agents that write code or background workers.
- [x] Select one on-demand coordinator and the existing Groq integration; maximum is one model request per analysis.
- [ ] Record live p50/p95 latency and token usage after a Groq-enabled deployment is configured; no provider credentials are present in the current Sandbox.
- [x] Keep the previous PR's private-bank, seed-resume, and admin-alert changes as the foundation.

**Exit gate:** architecture and provider decisions are recorded. Live performance measurement remains a deployment follow-up.

### Stage 1 — Add an agent contract and coordinator

- [x] Add server-only role/input/output types and a strict JSON schema for the combined specialist response.
- [x] Keep authorization, private-bank selection, and input redaction in the existing server route; the coordinator owns the one Groq request, timeout, output validation, and fallback boundary.
- [x] Keep role descriptions free of direct network clients and side effects; only the coordinator calls Groq.
- [x] Add mocked tests for one-call execution, provider/malformed-output fallback, citation filtering, and unsafe action rejection; existing route tests retain user/bank isolation coverage.
- [x] Add `RECALLOPS_AGENT_COORDINATOR=false` as a kill switch to force the deterministic rules fallback without changing simulation labels.

**Exit gate (verified locally):** TypeScript passes; 32 tests pass and 3 environment-dependent tests are skipped. Mocked checks cover one-call execution, timeout/no-retry, citation and unsafe-step filtering, and fallback; existing auth tests cover the protected route boundary.

### Stage 2 — Pilot the Incident room

- [x] Start with bounded **Incident Triage**, **Memory Scout**, **Read-only Planner**, and **Playbook Composer** sections, returned through one model request.
- [x] Reuse the existing private Hindsight recall and Groq configuration; no new provider or external data source is added.
- [x] Cap the flow at one model call and 3,000 generated tokens per analysis, with the existing 30-second timeout and deterministic fallback.
- [x] Show whether the response came from the single-call coordinator or rules fallback; show generated playbook steps only when the coordinator succeeded.
- [ ] Compare latency/token use on all fictional scenarios after a Groq-enabled deployment is configured.

**Exit gate:** no invalid evidence citations or unsafe plan items survive tests; provider failures use the safe fallback. Live latency and token acceptance is a rollout gate, not claimed from this credential-free Sandbox.

### Stage 3 — Extend Memory bank and Playbooks specialists

- [x] Add a cited Memory Scout summary and Playbook Composer sequence to the Incident room coordinator response; surface the sequence in Playbooks without another model call.
- [x] Keep bank resolution server-side; the existing authorization and private-bank integration tests remain the boundary.
- [ ] Consider a separate Outcome Curator draft only after user feedback; the existing human-confirmation-before-retain flow remains unchanged.
- Add a “why this step?” explanation linked to memory/source IDs instead of exposing private internal reasoning.

**Exit gate:** reviewers can trace each recommendation to evidence or see that it is generic; no agent writes without confirmation.

### Stage 4 — Decide whether Activity needs an agent; keep Usage deterministic

- Use feedback and test results to decide whether a per-user activity summary is valuable. Do not add an agent just to make every tab appear agent-powered.
- Keep quota/anomaly thresholds as tested deterministic rules. If natural-language explanation is later requested, provide only minimal aggregate counts and preserve admin-only workspace scope.
- Do not connect telemetry or ticketing as part of this stage. A source, field allowlist, permissions, and retention contract must be approved first.

### Stage 5 — Evaluate and roll out

- Run a golden set built from the fictional seed scenarios plus edge cases: weak evidence, conflicting memories, secret-like input, empty recall, malformed model output, and provider timeout.
- Measure p50/p95 latency, citation correctness, safe-check precision, fallback rate, and model calls/tokens per analysis.
- Use `RECALLOPS_AGENT_COORDINATOR=false` as the rollback switch; compare specialist output with the deterministic rules baseline before considering any broader agent rollout.
- Require zero invalid citations and zero unfiltered prohibited actions in the test set, no cross-account evidence, and no agent write without user confirmation.
- If the expanded single-call output does not improve quality enough to justify its token budget, keep the rules-only fallback enabled by setting the switch to `false`.

### Later, only if needed — Background agents

Consider queued/background agents only for a defined long-running task or external event, not simply to split features. Before implementation, decide the trigger, expected completion time, user cancellation/retry behavior, result notification, job-state fields, data retention, and provider/cost limits. Start with no production write tools and no polling loop unless an approved source requires it.

## Decision recorded

The user selected **one single on-demand coordinator** for user-facing product specialists and approved reusing the existing Groq integration. Each analysis produces separate role outputs from at most one Groq request. `RECALLOPS_AGENT_COORDINATOR=false` forces rules-only behavior.

The current Sandbox has no Groq/Hindsight/database configuration, so local fixture tests verify the coordinator contract and fallback, but cannot verify live provider behavior or latency. Do not provide provider secrets in chat; configure them in the deployment's secure environment.
