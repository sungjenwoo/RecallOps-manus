# Groq planner references

Verified against official Groq documentation on 2026-09-28.

RecallOps defaults to [`openai/gpt-oss-120b`](https://console.groq.com/docs/model/openai/gpt-oss-120b), whose official model page documents the exact model ID and its Groq Chat Completions example. The server sends JSON Schema output with `strict: true`; Groq's [Structured Outputs guide](https://console.groq.com/docs/structured-outputs) lists GPT-OSS 120B among the strict structured-output models and specifies the `response_format: { type: "json_schema", json_schema: { name, strict, schema } }` request shape.

The returned JSON is still parsed and validated by RecallOps. Evidence references must be from the current retrieved set, and risky action-like language is dropped from model-generated plan items. When the optional key is absent, or the request fails validation, the app uses its clearly identified evidence-guided rules fallback instead of pretending a model generated the answer.
