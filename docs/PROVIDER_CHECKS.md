# RecallOps provider checks

## Official references

- Hindsight HTTP API: https://hindsight.vectorize.io/api-reference
- Hindsight configuration: https://hindsight.vectorize.io/developer/configuration
- Hindsight memory-bank API: https://hindsight.vectorize.io/developer/api/memory-banks
- Hindsight TypeScript SDK (`createBank`): https://hindsight.vectorize.io/sdks/nodejs
- Groq model `openai/gpt-oss-120b`: https://console.groq.com/docs/model/openai/gpt-oss-120b
- Groq structured outputs: https://console.groq.com/docs/structured-outputs
- Groq API reference: https://console.groq.com/docs/api-reference

## Verification performed (2026-09-28)

- Hindsight: authenticated read-only `GET /v1/default/banks?limit=1` returned HTTP 200. The API reference documents bank listing and the health/readiness endpoints; no API key or response body was logged.
- Groq: authenticated read-only `GET https://api.groq.com/openai/v1/models` returned HTTP 200. The model catalog response was not logged.
- After explicit user approval, three fictional postmortems were retained/upserted under stable demo document IDs in `recallops-hackathon-demo`. One synthetic checkout analysis recalled eight relevant Hindsight memory items and issued one Groq structured-plan request using `openai/gpt-oss-120b`.
- The UI reported live Hindsight recall and Groq as the model source. The result was a read-only, evidence-cited plan. No verified outcome was retained, and no real telemetry, customer data, or production systems were used.
- Provider secret values are stored in WebDev project secrets only; they are not written to source control or printed in test output.

## Per-user bank update

The initial synthetic integration test used `recallops-hackathon-demo` after the user approved that destination. The application has since been changed to require Manus authentication in live mode and derive one opaque Hindsight bank per signed-in user. The app no longer reads or writes the shared demo bank. Its existing synthetic records have not been deleted. The private-bank flow creates or updates a bank on first use using the official SDK's `createBank` operation. A generic sign-in never seeds data; the seed write resumes only when the user explicitly selected **Sign in for your private pack** before OAuth, and uses stable synthetic document IDs.
