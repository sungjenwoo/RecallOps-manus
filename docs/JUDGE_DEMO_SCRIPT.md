# RecallOps — Judge Demo Script

## Core pitch

> RecallOps is a failure-aware incident memory assistant that remembers what failed, what worked, and what a human verified—so on-call engineers do not start from zero during the next outage.

## Primary scenario

Use the **Checkout 502s** synthetic scenario. It demonstrates a worker-concurrency change, rising errors, queue saturation, a failed restart pattern, and a verified configuration resolution.

## 75–90 second live flow

| Time      | Action                                  | Narration                                                                                                                                                               |
| --------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:10 | Show the Incident room                  | "When an incident starts, responders often rebuild context from old tickets. RecallOps gives that experience a memory."                                                 |
| 0:10–0:22 | Select **Checkout 502s**                | "This is fictional telemetry: checkout 502s rose after worker concurrency changed from 16 to 48. We provide the symptoms and recent change, not the answer."            |
| 0:22–0:38 | Click **Analyze with incident memory**  | "Hindsight recalls a related postmortem. It shows that three restarts failed and that a verified configuration rollback restored service."                              |
| 0:38–0:50 | Open the memory delta and evidence card | "Without memory, we start with broad release and metric checks. With memory, we prioritize comparing configuration and queue signals. This is a hypothesis, not proof." |
| 0:50–1:05 | Open **Record verified outcome**        | "Only a human-confirmed outcome can become future memory. We record the root cause, what failed, what worked, and the follow-up lesson."                                |
| 1:05–1:18 | Save and click **Run again to verify**  | "The confirmed lesson is now retained in Hindsight for this private account, or locally labelled in simulation mode. The next analysis can use it."                     |
| 1:18–1:30 | Point to the safety message             | "RecallOps is advisory only. It never restarts services, rolls back releases, runs commands, or changes production."                                                    |

## What must be visible

- Synthetic telemetry label
- Hindsight or simulation status badge
- One evidence ID
- One failed action
- One verified resolution
- Memory/no-memory comparison
- Human confirmation checkbox
- Retain-to-recall status
- Read-only safety language

## Live-mode preparation

1. Sign in with the dedicated demo account.
2. Open **Memory bank**.
3. Click **Load synthetic pack into my bank**.
4. Return to **Incident room**.
5. Run the Checkout 502s scenario.
6. Confirm the result says **Hindsight recall**.
7. Record a fictional, human-confirmed outcome.
8. Click **Run again to verify**.
9. Confirm the later evidence includes the retained lesson.

## Simulation backup narration

If Hindsight is unavailable, say:

> "This is the explicitly labelled simulation path. The same learning workflow is demonstrated with fictional starter memories and browser-local confirmed outcomes. It proves the product interaction without claiming a live provider write."

## Judge questions

### Why is Hindsight central?

Hindsight is the persistent experience layer. RecallOps uses it to retrieve prior incident facts and retain human-confirmed postmortems. The model is not retrained; relevant experience is supplied at reasoning time.

### Why remember failures?

A previous failed restart or ineffective workaround is operationally valuable because it prevents responders from repeating a known mistake under pressure.

### Is the recommendation automatic?

No. Recommendations are hypotheses and read-only checks. The current system never performs remediation or writes to production.

### What would be the next product step?

Connect approved postmortems, incident tickets, runbooks, and operational tools after privacy, access-control, retention, and evaluation reviews.
