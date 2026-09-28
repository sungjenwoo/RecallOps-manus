# RecallOps project tracker

## Implemented

- [x] Responsive incident room with editable, synthetic checkout, database-latency, and identity scenarios.
- [x] Evidence-grounded hypothesis/checklist generation with source IDs, confidence, a stateless-vs-memory comparison, and explicit uncertainty.
- [x] Server-side Hindsight SDK integration for recall and human-confirmed retain; stable IDs for the optional synthetic seed pack.
- [x] Optional Groq planner using strict JSON Schema output and server-side model credentials; rules-based fallback when unavailable.
- [x] Safe, read-only recommendations; model-output validation; common secret-pattern redaction; public demo request limit.
- [x] Human confirmation before recording a root cause, failed attempts, and verified resolution.
- [x] Clearly distinguished live Hindsight, fallback, simulation, synthetic sample, and browser-local memory states.
- [x] Memory library, playbooks, activity timeline, setup/architecture notes, and draft article/social/video script.
- [x] Unit tests cover redaction, simulation labels, service-relevant retrieval, safety text, and rate limiting.

## Verification completed

- [x] `pnpm check`
- [x] `pnpm test` — 5 tests pass.
- [x] `pnpm build` — production assets generated. Vite reports a non-blocking large-chunk advisory (about 563 KB minified JS; 164 KB gzip).
- [x] Desktop and mobile layout inspected.
- [x] Browser test: checkout analysis cites the matching synthetic postmortem; a human-confirmed local outcome is saved and appears in a subsequent analysis.

## Configure before demonstrating live provider integrations

- [ ] Set `HINDSIGHT_API_URL` and, where enabled, `HINDSIGHT_API_KEY` in the server environment.
- [ ] Optionally set `GROQ_API_KEY`; then verify live recall/retain and Groq structured output with non-sensitive test records.
- [ ] If live Hindsight is configured, load the clearly synthetic pack before recording a live-memory demo.

## Known demo limits / production follow-up

- [ ] Demo metrics and scenario history are fictional; connect a trusted telemetry/incident system only after defining data access and retention.
- [ ] Public demo procedures have IP-based, in-memory rate limiting but no user authentication or tenant isolation. Before production, add authenticated access, per-tenant bank authorization, durable abuse controls, and audit/retention policy.
- [ ] Simulation outcomes live in browser `localStorage`; they are not shared across browsers and are not Hindsight memories.
- [ ] Browser verification covered simulation mode only because provider credentials were not configured in this environment.
- [ ] Consider route/component code splitting to remove the non-blocking Vite bundle-size warning before production rollout.
