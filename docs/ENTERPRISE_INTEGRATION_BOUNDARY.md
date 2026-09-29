# RecallOps — Enterprise Integration Boundary

## Purpose

RecallOps is intentionally safe in its hackathon form: it uses fictional incident data and does not connect to production telemetry, ticketing, or infrastructure systems.

A production deployment would introduce approved adapters behind a privacy and authorization boundary:

```text
Approved incident source
        ↓
Schema validation and secret redaction
        ↓
RecallOps incident-memory ingestion
        ↓
Private Hindsight bank
        ↓
Evidence-cited, read-only investigation plan
        ↓
Human decision and confirmation
```

## Candidate sources

| Source                               | Possible future input                           | Required review                                  |
| ------------------------------------ | ----------------------------------------------- | ------------------------------------------------ |
| Azure DevOps                         | Work items, incident notes, deployment metadata | Project permissions, tenant boundary, retention  |
| Azure Monitor / Application Insights | Alert summaries and selected metrics            | Data minimization, workspace access, PII review  |
| Microsoft Teams                      | Approved incident-channel summaries             | Channel consent, export policy, redaction        |
| Markdown or JSON postmortems         | Human-authored incident outcomes                | Schema validation and secret scanning            |
| Jira or ServiceNow                   | Incident and change records                     | Connector scope, retention, customer-data review |

## Adapter contract

Every adapter should produce a normalized incident record containing only approved fields:

```ts
type ApprovedIncidentRecord = {
  source:
    | "azure-devops"
    | "azure-monitor"
    | "teams"
    | "postmortem"
    | "jira"
    | "servicenow";
  sourceId: string;
  service: string;
  environment: string;
  observedAt: string;
  symptoms: string;
  recentChange?: string;
  impact?: string;
  confirmedRootCause?: string;
  failedActions?: string;
  successfulResolution?: string;
  provenance: "human-confirmed" | "observed" | "synthetic";
};
```

Before sending text to Hindsight:

1. Validate the schema.
2. Remove credentials, tokens, customer identifiers, and unapproved fields.
3. Attach source and provenance metadata.
4. Require a retention policy and approved Hindsight bank.
5. Preserve the historical-observation caution.

## Security boundaries

- Provider credentials remain server-side.
- A browser cannot select a Hindsight bank ID.
- Each live user or approved team receives an isolated bank.
- No adapter may execute remediation.
- No incident record is retained without an explicit policy and provenance.
- Human-confirmed resolutions are distinct from unverified observations.
- All connector access requires authorization and audit review.

## Hackathon demo boundary

The included Azure-style sample is fictional. It demonstrates the future adapter shape without claiming a live Microsoft integration. The public demo must continue to use synthetic data only.

## Adoption path

1. Start with approved Markdown or JSON postmortems.
2. Measure retrieval relevance, citation validity, failure recall, and safety behavior.
3. Add read-only incident and deployment metadata from one approved source.
4. Expand only after privacy, access-control, retention, and evaluation reviews.
5. Keep remediation and infrastructure writes outside RecallOps until a separate safety program exists.
