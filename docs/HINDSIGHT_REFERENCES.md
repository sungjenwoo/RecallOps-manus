# Hindsight integration references

Checked against the official Vectorize documentation on 2026-09-28.

- [Hindsight API quickstart](https://hindsight.vectorize.io/developer/api/quickstart) — official TypeScript package `@vectorize-io/hindsight-client`; example client `new HindsightClient({ baseUrl })` and `retain`, `recall`, `reflect` methods.
- [Retain guide](https://hindsight.vectorize.io/developer/api/retain) — retain accepts content with context, timestamp, metadata, and document ID. A stable `document_id` makes a retain operation idempotent/upsertable. Hindsight extracts structured memories and consolidates observations after retain.
- [Recall guide](https://hindsight.vectorize.io/developer/api/recall) — recall combines semantic, keyword, graph, and temporal search; results may include fact ID, text, type, context, metadata, tags, entities, and timestamps. The TypeScript client supports a recall budget and max-token limit.
- [Reflect guide](https://hindsight.vectorize.io/developer/api/reflect) — reflect searches memory and synthesizes a disposition-aware response; it can optionally return a structured output.
- [Configuration and authentication](https://hindsight.vectorize.io/developer/configuration) — API-key auth can be enabled on a self-hosted instance; clients send `Authorization: Bearer <key>`. Local/self-hosted setups may run with auth disabled. Do not infer or hardcode a Cloud endpoint; use the URL shown by the user's Hindsight deployment/settings.
- [HTTP API reference](https://hindsight.vectorize.io/api-reference) — endpoint and schema details for the running Hindsight API.

RecallOps uses the official client on the server, with the Hindsight API URL and optional bearer key read only from server environment variables. It retains confirmed postmortems with a human-readable context, a stable document ID, and string metadata identifying demo or postmortem provenance. The application does not claim model retraining: newly retained experience is made available through later recall.
