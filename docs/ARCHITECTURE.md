# RecallOps architecture notes

## Request path

```mermaid
sequenceDiagram
  participant E as Engineer
  participant UI as RecallOps UI
  participant S as RecallOps server
  participant D as Managed MySQL
  participant H as Hindsight private bank
  participant G as Groq (optional)
  E->>UI: Describe a synthetic incident
  UI->>S: Analyze request
  S->>S: Require OAuth user in live mode
  S->>S: Derive opaque bank ID from user identity + stable JWT secret
  S->>D: Consume durable per-user request budget
  S->>D: Record pseudonymous action metadata
  S->>H: Ensure user's isolated bank, then recall
  H-->>S: Ranked memory facts
  S->>G: Incident + retrieved evidence IDs (optional)
  G-->>S: Hypotheses and read-only checks
  S-->>UI: Plan + inspectable evidence + mode
  E->>UI: Verify outcome and confirm
  UI->>S: Human-confirmed postmortem
  S->>D: Rate limit + metadata-only audit event
  S->>H: Retain in the same private bank
  H-->>S: Retained
  S-->>UI: Success + memory mode
```

If `HINDSIGHT_API_URL` is unset, the app selects an explicitly labelled public simulation path: fictional seed examples plus browser-local outcome storage. In live mode, sign-in is mandatory; anonymous requests cannot access, seed, analyze against, or retain into Hindsight. Each account receives a stable opaque bank ID derived with HMAC from its OAuth identity and the server-side `JWT_SECRET`. The ID and raw OAuth identity are not exposed to the browser or stored in the app's audit log.

## Trust boundaries and persistence

- **Browser:** incident form, evidence viewer, human confirmation, and simulation-only local storage. The browser cannot choose a bank ID.
- **RecallOps server:** Manus OAuth context, Hindsight/Groq credentials, HMAC-derived bank and actor identifiers, input redaction, response validation, durable limits, and audit events.
- **Managed MySQL:** stores the existing OAuth user records, a rolling request counter keyed by pseudonymous actor hash, and minimal audit metadata. Live requests are limited to 30 per user per minute and fail closed if durable controls are unavailable.
- **Audit retention:** logs contain only a pseudonymous actor hash, action, fixed target label, and timestamps. They never contain incident text, email, OAuth IDs, API keys, or provider response bodies. Expired audit metadata is purged on the next audit write; retention is 30 days.
- **Hindsight:** one isolated bank per authenticated user. Bank setup and all recall/retain operations are server-side. Provider-side memory retention is controlled by the Hindsight deployment and is separate from the app audit TTL.
- **Groq:** optional generation from the current incident plus retrieved evidence. The model is instructed to produce hypotheses and read-only checks only. Output is validated, unsafe action-like recommendations are dropped, and evidence IDs must match the retrieved evidence set.

Keep `JWT_SECRET` stable. Rotating it changes the HMAC-derived bank ID; perform a deliberate bank migration before rotating the secret if access to existing memories must be preserved.

## Usage and audit dashboard

The protected dashboard reads only the pseudonymous audit and rolling-limit tables. A normal account is scoped to its own HMAC actor hash. Only users with the server-side `admin` role may request workspace scope; those rows use a truncated pseudonymous label and never resolve to names, email addresses, or OAuth IDs. Date-range and action filters apply to event totals, trends, and recent rows. CSV export is generated in the browser from the same already-authorized response.

The dashboard reports accepted live memory operations from audit events separately from the rolling request counter, which includes over-limit attempts. Simulation activity is local and is not represented as live API usage. Recent event rows expose only fixed target labels and timestamps; they expire after 30 days under the existing audit policy.

### Admin usage alerts

Personal-scope responses include quota alerts for the requesting account only: a warning at 24 of 30 requests in the current per-account minute and a critical alert above 30. The backend matches the authenticated actor hash before generating that private alert and never returns peer counters in personal scope. Admin-authorized workspace responses show the same thresholds with pseudonymous labels. An unusual-usage warning requires at least four active accounts and flags an account at `max(10, 3 × median(other active accounts))` requests. Alerts are recalculated from existing current-minute rate-limit rows on each dashboard refresh; no alert record, identity lookup, or external notification is created. The spike rule is a review heuristic, not a security verdict.

## Proposed telemetry/ticketing scope (not connected)

Any first connector should be read-only and limited to a documented allowlist: stable source record ID, service/environment label, severity, event timestamp, short sanitized symptom summary, and a change or runbook reference. Raw logs/traces, request/response bodies, attachments, credentials, personal data, and customer identifiers are out of scope. Source payloads should be transient for the current investigation and not copied to the audit tables. Only a human-confirmed, sanitized outcome may be retained in a user's private Hindsight bank. App audit metadata keeps its existing 30-day expiry; source-provider retention and Hindsight memory expiry are separate controls that must be reviewed for the selected provider before connection. No ticket writes or remediation are in scope.

## Deliberate constraints

1. No production telemetry/ticketing integrations, shell execution, infrastructure write actions, restart, rollback, scale, or automated remediation.
2. A model's recommendation is not treated as a verified incident fact.
3. Only a user-confirmed outcome is eligible for retain.
4. Synthetic demo content is labelled separately from live Hindsight memories.
5. Common secret patterns are redacted before external calls, but redaction is not a guarantee; use synthetic data in the public demo.
6. Browser-local simulation outcomes are not shared across users and never influence live Hindsight analyses.
