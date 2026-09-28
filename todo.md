# RecallOps build tracker

## Completed and verified

- [x] Reviewed the hackathon brief and supplied Hindsight project notes.
- [x] Built a responsive incident-response workspace with fictional scenarios, evidence citations, cautious hypotheses, read-only checks, confidence, and a with/without-memory comparison.
- [x] Implemented server-side Hindsight recall/retain, optional strict-JSON Groq planning, evidence-ID validation, and a deterministic fallback.
- [x] Added human-confirmed outcome capture, secret redaction, simulation-only local memory, and distinct live/simulation labels.
- [x] Added private per-user Hindsight banks, mandatory authentication for live operations, persistent per-user request limits, and pseudonymous audit events with 30-day retention.
- [x] Built an interactive **Usage & audit** dashboard with time/action filters, live API trends, rolling request-limit usage, recent audit records and expiry, CSV export, user-personal view, and pseudonymous admin workspace view.
- [x] Added private per-account in-app quota alerts for signed-in users, plus admin-only workspace threshold and unusual-spike alerts; alerts use existing pseudonymous counters and are not separately retained or externally delivered.
- [x] Defined a proposed read-only telemetry/ticketing allowlist and retention boundary before any operational connector is enabled.
- [x] Added a no-login synthetic preview at `/?section=usage&sample=1`; preview is generated in the browser, never queries/writes live audit data, and is clearly marked fictional.
- [x] Verified the synthetic action filter shows only the matching event rows while period-wide KPIs remain labeled; verified responsive desktop and phone layouts.
- [x] Applied the additive MySQL indexes for audit-time and actor queries; database-backed request-limit and retention tests passed.
- [x] Updated README, architecture notes, provider references, and the hackathon submission/demo script.
- [x] Ran `pnpm check`, `pnpm test` (41 passing, 3 environment-dependent skipped), and `pnpm build`; no oversized-chunk warning. Vite still warns that the optional analytics endpoint/site-ID placeholders are unset in this sandbox.
- [x] Verified authenticated read-only Hindsight/Groq provider checks and an earlier fictional-data memory/planner flow without logging secret values or response bodies.
- [x] Added a one-use, 10-minute session-only seed intent so the explicit private-pack CTA resumes after OAuth, writes to the signed-in user's isolated bank, and opens Usage & audit on success.
- [x] Added tests for one-shot/expired OAuth intent, blocked storage, and the rule that simulation mode cannot report a live seed write.
- [x] Left user banks unchanged in this code-only pass: the active Sandbox has no Hindsight, OAuth, or database runtime configuration, so no live login or provider write was attempted.
- [x] Added four typed specialist roles under one on-demand coordinator, with one Groq call maximum, a 3,000-token response cap, a 30-second timeout, citation/action validation, rules fallback, and an environment kill switch.
- [x] Surfaced coordinator-versus-fallback status, triage and cited memory summaries, and a same-analysis playbook sequence without adding persistence or autonomous actions.
- [x] Added mock coverage for one-call/schema behavior, timeout/no retry, unknown citations, unsafe plan items, missing credentials, malformed responses, and provider failure.
- [x] Hardened runtime schema checks so parseable incomplete JSON, malformed items, and extra model fields safely fall back; added regression coverage.
- [x] Rejects unsafe action language and shell/CLI command recommendations from summary and plan text.
- [x] Added accessible “Why this step?” rationale disclosures with validated evidence IDs; generic checks are explicitly labelled as uncited.
- [x] Recorded the decision to keep Activity un-agentized and Usage thresholds deterministic until a validated user need exists.
- [x] Added a seven-case synthetic golden set and a guarded live-evaluation CLI for latency, token use, fallback, citation, and safety metrics; tests use a mocked provider only.
- [x] Verified the evaluation command defaults to a no-network dry run and refuses live execution without a Groq key.
- [x] Pushed source, docs, tests, migrations, and tracker to `tanveerpasha6381-hub/RecallOps-manus` on `main`.

## Scope note

No telemetry or ticketing provider is connected, and the app makes no production changes. Operational integrations require a separate data-access, privacy, and retention review. The sign-in-to-seed flow is implemented but could not be exercised live in this workspace: there is no active hosted WebDev project or configured Hindsight/OAuth/database/Groq environment here. The synthetic evaluation was not sent to Groq; live latency/token measurements and human quality review remain deployment gates. After secure Groq configuration, run `pnpm eval:agents -- --confirm-live`; a configured Hindsight/OAuth/database deployment is separately required for live private-memory analytics.
