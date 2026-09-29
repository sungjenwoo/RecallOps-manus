# RecallOps — Evaluation Plan

## Purpose

This evaluation measures observable memory and safety behavior without claiming production accuracy, reduced MTTR, or customer adoption.

## Comparison

Compare the same synthetic incident scenarios under two conditions:

1. **Baseline:** no historical incident evidence.
2. **Memory-assisted:** relevant synthetic Hindsight or browser-local memories supplied to analysis.

## Suggested dataset

The repository includes a repeatable evaluator with paraphrased, distractor, and no-match cases. Run it with:

```bash
pnpm evaluate
```

The evaluator currently runs 10 fictional cases and checks retrieval, failed-action recall, resolution recall, citation validity, safety filtering, no-match caution, and simulation-mode honesty. Expand this dataset toward 30 cases before the final submission.

For a fuller evaluation, use at least 30 fictional scenarios. The current three scenario families are:

- Checkout 502s after worker-pool change
- Orders API latency from database pool exhaustion
- Identity gateway authentication failures after secret rotation

Add scenario variants that change symptoms, recent changes, and irrelevant details while preserving the expected historical pattern.

## Implemented scenario coverage

The application includes a paraphrased Checkout 502s variant and a Catalog Search no-match scenario. These demonstrate contextual evidence retrieval while remaining cautious when no relevant memory exists.

## Metrics

| Metric             | Definition                                                             |
| ------------------ | ---------------------------------------------------------------------- |
| Relevant retrieval | Whether the expected prior incident pattern appears in evidence.       |
| Failure recall     | Whether a previously ineffective action is surfaced.                   |
| Resolution recall  | Whether a verified resolution is surfaced.                             |
| Citation validity  | Whether every cited evidence ID exists in the retrieved set.           |
| Safety filtering   | Whether unsafe action-like recommendations are removed.                |
| Read-only coverage | Whether the plan includes appropriate observational checks.            |
| Mode honesty       | Whether live, fallback, and simulation results are labelled correctly. |

## Recording template

| Scenario       | Condition       | Relevant evidence | Failed action recalled | Resolution recalled | Valid citations | Unsafe actions removed | Notes |
| -------------- | --------------- | ----------------: | ---------------------: | ------------------: | --------------: | ---------------------: | ----- |
| Checkout 502s  | Baseline        |                   |                        |                     |                 |                        |       |
| Checkout 502s  | Memory-assisted |                   |                        |                     |                 |                        |       |
| Orders latency | Baseline        |                   |                        |                     |                 |                        |       |
| Orders latency | Memory-assisted |                   |                        |                     |                 |                        |       |
| Identity 401s  | Baseline        |                   |                        |                     |                 |                        |       |
| Identity 401s  | Memory-assisted |                   |                        |                     |                 |                        |       |

## Reporting rules

- Report counts and examples, not unsupported business outcomes.
- Do not claim improved accuracy unless a labelled answer key and repeatable scoring method exist.
- Do not claim reduced MTTR unless tested with real or representative incident workflows.
- State that synthetic results demonstrate workflow behavior, not production performance.
- Preserve the distinction between evidence and proof.

## Judge-facing summary template

> In our synthetic evaluation, memory-assisted analysis was checked for retrieval relevance, recall of failed and successful actions, citation validity, and safety filtering. The evaluation demonstrates that RecallOps can make prior experience inspectable and reusable; it is not a claim about production accuracy or incident-time reduction.
