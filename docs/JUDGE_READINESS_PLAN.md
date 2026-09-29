# RecallOps — Judge-Readiness Plan

## Purpose

This document turns the hackathon requirements and current project gap analysis into an execution plan for maximizing judge impact.

> A 100% judge score cannot be guaranteed because innovation, presentation, and real-world impact are subjective. This plan focuses on making the existing product easy to understand, technically credible, and strongly aligned with the rubric.

**Scope:** This plan covers presentation, validation, demo, evaluation, and submission readiness. It does not authorize production integrations or unsafe automated remediation.

---

## 1. Hackathon rubric

| Criterion                | Weight | What judges need to believe                                                                    |
| ------------------------ | -----: | ---------------------------------------------------------------------------------------------- |
| Innovation               |    30% | RecallOps is more than a generic incident chatbot and solves a meaningful operational problem. |
| Use of Hindsight Memory  |    25% | Memory is central, inspectable, persistent, and visibly improves later analysis.               |
| Technical Implementation |    20% | The application is functional, safe, well-architected, and handles failure cases.              |
| User Experience          |    15% | A first-time judge understands the value quickly and can follow the workflow.                  |
| Real-world Impact        |    10% | A real SRE or operations team could adopt the workflow, with a credible path forward.          |

---

## 2. Core positioning

### Recommended one-sentence pitch

> **RecallOps is a failure-aware incident memory assistant that remembers what failed, what worked, and what a human verified—so on-call engineers do not start from zero during the next outage.**

### Three differentiators to repeat consistently

1. **Failure-aware memory** — recalls ineffective fixes as well as successful resolutions.
2. **Evidence-cited reasoning** — every memory-backed hypothesis points to inspectable evidence.
3. **Human-confirmed learning** — the system retains a lesson only after an engineer confirms the outcome.

### What not to call it

Avoid describing RecallOps as only:

- An AI chatbot for DevOps
- A generic incident assistant
- A vector-search demo
- An automatic remediation tool

### What it is

- A focused incident-investigation assistant
- An advisory system for on-call engineers
- A persistent experience layer for incident knowledge
- A safe, human-led learning loop

---

## 3. Current strengths already implemented

The existing project already includes the following strengths:

- React and TypeScript incident-response workspace
- Three fictional incident scenarios
- Official `@vectorize-io/hindsight-client` integration
- Hindsight `createBank`, `recall`, and `retain` operations
- Private per-user Hindsight bank derivation
- Evidence IDs and inspectable memory sources
- With-memory and without-memory comparison
- Human-confirmed outcome capture
- Failed-action and successful-resolution retention
- Simulation mode when Hindsight is unavailable
- Optional Groq structured-output planning
- Deterministic rules fallback
- Evidence-ID validation
- Unsafe action filtering
- Secret redaction before external calls
- Advisory-only, read-only behavior
- Durable request limits
- Pseudonymous audit events
- 30-day audit retention
- Role-scoped usage dashboard
- Tests, migrations, architecture notes, and provider references

The objective is to make these existing strengths visible and credible rather than expanding scope unnecessarily.

---

# 4. Work plan by rubric

## Phase A — Innovation and differentiation

**Goal:** Prevent judges from categorizing the project as another chatbot with a memory feature.

### Tasks

- [ ] Use the recommended one-sentence pitch in the presentation, README introduction, and demo narration.
- [ ] Explain that RecallOps remembers both failed actions and verified resolutions.
- [ ] Show one failed restart from a prior incident and one verified configuration resolution.
- [ ] Explain that memory is evidence to investigate, not proof of the current root cause.
- [ ] Explain why human confirmation is required before a lesson is retained.
- [ ] Explain that the model is not retrained; Hindsight supplies relevant experience at reasoning time.
- [ ] Prepare one architecture diagram showing the incident → recall → investigation → confirmation → retain loop.

### Acceptance criteria

A judge should be able to answer yes to all of these:

- [ ] Is the target user clear?
- [ ] Is the business pain real?
- [ ] Is the failure-aware memory idea easy to repeat?
- [ ] Is the human-confirmed learning loop different from ordinary chat history?
- [ ] Is the reason for using Hindsight clear?

---

## Phase B — Hindsight memory proof

**Goal:** Make the 25% Hindsight criterion undeniable in a live demo and video.

### Required learning-loop sequence

1. Start with a current incident.
2. Show a broad baseline plan without historical memory.
3. Run analysis using Hindsight memory.
4. Open the recalled evidence.
5. Highlight a previous failed action.
6. Highlight the previous verified resolution.
7. Explain that the prior event is a hypothesis, not proof.
8. Enter the current incident outcome.
9. Require and complete human confirmation.
10. Retain the postmortem in Hindsight.
11. Run analysis again.
12. Show the newly retained lesson in later evidence.
13. Explain the difference between live Hindsight and simulation mode.

### Live Hindsight preparation

- [ ] Configure the Hindsight API URL.
- [ ] Configure the Hindsight API key if required.
- [ ] Sign in with a dedicated demo account.
- [ ] Create or verify the private demo bank.
- [ ] Load the clearly labelled synthetic starter pack.
- [ ] Confirm that recall returns evidence.
- [ ] Confirm that a human-confirmed postmortem is retained.
- [ ] Confirm that the retained lesson appears in a later recall.
- [ ] Verify the status badge says private Hindsight memory.
- [ ] Verify no credentials or raw user IDs appear in the browser.

### Simulation backup

- [ ] Verify the app works with Hindsight disabled.
- [ ] Verify the UI clearly says synthetic demo mode.
- [ ] Verify browser-local outcomes can be saved and recalled.
- [ ] Never describe simulation evidence as live Hindsight memory.
- [ ] Prepare a spoken explanation in case the provider is unavailable.

### Acceptance criteria

- [ ] Hindsight recall is visible.
- [ ] Hindsight retain is visible.
- [ ] The later result changes or gains relevant evidence.
- [ ] Evidence IDs can be opened or inspected.
- [ ] The human confirmation step is visible.
- [ ] Live and simulation modes are never confused.

---

## Phase C — Focused demo experience

**Goal:** Demonstrate the full value within 60–90 seconds.

### Primary scenario

Use **Checkout 502s** as the main story:

- Worker concurrency increased from 16 to 48.
- Gateway 502 errors rose.
- Queue depth climbed.
- Previous restarts failed.
- A configuration rollback restored service.

The orders and identity scenarios can remain available as supporting examples but do not need to be shown in the main pitch.

### Recommended 90-second flow

| Time      | Demo action                         | Message                                                                                     |
| --------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| 0:00–0:10 | Introduce the incident              | On-call teams lose time rebuilding old context.                                             |
| 0:10–0:22 | Show the Checkout 502s scenario     | This is labelled synthetic data; symptoms and a recent change are supplied, not the answer. |
| 0:22–0:38 | Analyze with memory                 | Hindsight finds a related postmortem with failed and successful actions.                    |
| 0:38–0:50 | Open evidence and memory comparison | Memory changes prioritization, but remains a hypothesis.                                    |
| 0:50–1:05 | Record outcome                      | Only a human-confirmed postmortem can become future memory.                                 |
| 1:05–1:18 | Analyze again                       | The retained lesson becomes available to later reasoning.                                   |
| 1:18–1:30 | Close on safety                     | RecallOps advises; it never changes production.                                             |

### UX tasks

- [ ] Make the first scenario and first action obvious.
- [ ] Keep synthetic-data labels visible throughout the demo.
- [ ] Make evidence citations easy to open.
- [ ] Make “hypothesis” and “verified outcome” visually distinct.
- [ ] Avoid spending the main demo on the audit dashboard.
- [ ] Keep the flow understandable without explaining the entire codebase.
- [ ] Prepare a short response if a judge asks about the other scenarios.

### Acceptance criteria

- [ ] A first-time viewer understands the problem within 15 seconds.
- [ ] A first-time viewer sees the memory difference within 45 seconds.
- [ ] A first-time viewer understands the learning loop by the end.
- [ ] The main demo fits in 90 seconds.

---

## Phase D — Technical reliability

**Goal:** Ensure the implementation remains credible under judge questions and provider failures.

### Live-path verification

- [ ] Test the deployed application from a clean browser.
- [ ] Confirm sign-in works.
- [ ] Confirm the authenticated user receives a private bank.
- [ ] Confirm synthetic pack seeding works.
- [ ] Confirm Hindsight recall works.
- [ ] Confirm human-confirmed retention works.
- [ ] Confirm later recall sees the retained outcome.
- [ ] Confirm Groq planning works when configured.
- [ ] Confirm deterministic fallback works when Groq is unavailable.
- [ ] Confirm Hindsight failure is labelled as fallback evidence.
- [ ] Confirm rate limits fail safely.
- [ ] Confirm audit access is correctly scoped.
- [ ] Confirm the deployed version matches the GitHub commit.

### Safety verification

- [ ] Confirm no production telemetry or ticketing credentials are shown.
- [ ] Confirm no API keys appear in screenshots or video.
- [ ] Confirm secret redaction is active.
- [ ] Confirm recommendations remain read-only.
- [ ] Confirm unsafe model actions are filtered.
- [ ] Confirm no restart, rollback, delete, write, scale, or shell action is executed.
- [ ] Confirm the product never treats similarity as proof.

### Provider failure rehearsal

Prepare short explanations for:

- Hindsight temporarily unavailable
- Empty Hindsight bank
- Groq unavailable
- Authentication unavailable
- Database unavailable
- Simulation mode used as backup

### Acceptance criteria

- [ ] The live demo works from a fresh browser session.
- [ ] The backup path is ready.
- [ ] Every provider failure has an honest UI state.
- [ ] No unsafe action can be executed by the demo.
- [ ] Technical questions can be answered from the architecture notes.

---

## Phase E — Real-world impact and evaluation

**Goal:** Prove realistic value without inventing unsupported production claims.

### Adoption story

Position the first customer as:

- A small SRE team
- A platform engineering team
- An internal operations team

Potential future data sources:

- Postmortems
- Incident tickets
- Runbooks
- Human-confirmed incident outcomes
- Slack incident channels
- PagerDuty, Jira, ServiceNow, Datadog, or Grafana integrations

Clearly state that real integrations require separate privacy, access-control, and retention review.

### Synthetic evaluation plan

Create a small evaluation set, such as 10 fictional incident scenarios, and compare:

- No-memory analysis
- Memory-assisted analysis

Measure only observable properties:

- Whether the relevant prior pattern was retrieved
- Whether failed actions were recalled
- Whether successful resolutions were recalled
- Whether evidence IDs were valid
- Whether unsafe recommendations were filtered
- Whether the memory-assisted plan contained more relevant read-only checks

Do not claim reduced MTTR, improved accuracy, or customer adoption unless measured with a valid evaluation.

### Tasks

- [ ] Create the synthetic evaluation scenarios.
- [ ] Define the evaluation criteria before running it.
- [ ] Record the results honestly.
- [ ] Add a short evaluation summary to the submission materials.
- [ ] State limitations and avoid production-performance claims.

### Acceptance criteria

- [ ] The real-world customer is clear.
- [ ] The adoption path is believable.
- [ ] Any quantitative statement has supporting evidence.
- [ ] Limitations are stated openly.

---

## Phase F — Formal submission package

**Goal:** Complete every deliverable requested by the hackathon.

### Repository

- [x] GitHub repository exists.
- [x] README explains the project.
- [x] Architecture notes exist.
- [x] Hindsight usage is documented.
- [x] Setup instructions exist.
- [x] Tests and verification commands are documented.
- [ ] Verify the final repository URL.
- [ ] Verify the final repository is public or accessible to judges.
- [ ] Verify the deployed commit matches the submitted repository.

### Live project demo

- [ ] Verify a live demo URL.
- [ ] Test it from a clean browser.
- [ ] Confirm the URL is stable for judging.
- [ ] Confirm the demo account or sign-in process is ready.
- [ ] Add the verified live URL to the submission kit.

### Demo video

- [ ] Record a 75–90 second video.
- [ ] Show the Checkout 502s scenario.
- [ ] Show one recalled evidence item.
- [ ] Show one failed action.
- [ ] Show one verified resolution.
- [ ] Show the human-confirmation checkbox.
- [ ] Show the retain → recall learning loop.
- [ ] Show whether the demo is live or simulation mode.
- [ ] Do not show API keys or private data.
- [ ] Upload the video where required.
- [ ] Verify the video link.

### Article

Use the existing `docs/SUBMISSION_KIT.md` article draft and finalize:

- [ ] Team and project details
- [ ] Problem statement
- [ ] RecallOps approach
- [ ] Why Hindsight is central
- [ ] Safety and limitations
- [ ] Demo or repository link
- [ ] Honest evaluation results if available

### Social-media post

- [ ] Use the existing social draft.
- [ ] Add the verified repository or demo link.
- [ ] Add team/member attribution if required.
- [ ] Use the required event hashtags.
- [ ] Publish or prepare the final post according to the content guide.

### Official content guide

- [ ] Read the current official content-guide requirements.
- [ ] Confirm every team member’s required article contribution.
- [ ] Confirm every team member’s required social post.
- [ ] Confirm every team member’s required video contribution.
- [ ] Store final links and evidence in the submission tracker.

### Acceptance criteria

- [ ] No placeholders remain in the submission documents.
- [ ] Repository link is verified.
- [ ] Live-demo link is verified.
- [ ] Video link is verified.
- [ ] Article is finalized.
- [ ] Social content is finalized.
- [ ] All content-guide requirements are tracked.

---

# 5. Final judge-question preparation

Prepare concise answers to these questions:

### Why Hindsight instead of a normal database?

Hindsight is used as a persistent experience layer that can recall relevant facts and relationships from prior incidents. RecallOps does not treat memory as a transcript cache; it uses it to surface failed actions, successful resolutions, and lessons at investigation time.

### Is the model retrained?

No. The language model is not retrained. The agent improves because newly retained and relevant experience is supplied during later analysis.

### How do you prevent hallucinations?

The system exposes evidence IDs, validates model evidence references, limits recommendations to read-only checks, uses a deterministic fallback, and labels historical similarity as a hypothesis rather than proof.

### Can it change production systems?

No. RecallOps is advisory only. It does not execute shell commands, restart services, roll back releases, scale infrastructure, or write to production.

### What happens if Hindsight is down?

The application reports the failure and uses clearly labelled fallback or simulation evidence. It does not pretend that fallback evidence is live Hindsight memory.

### What data is used in the demo?

Fictional synthetic incident data only. Production telemetry and ticketing integrations are intentionally outside the prototype scope.

### Who would use it?

On-call engineers, SRE teams, platform teams, and operations teams that repeatedly handle similar incidents.

### What is the next product step?

Integrate approved postmortems, incident tickets, runbooks, and operational tools after completing access-control, privacy, retention, and evaluation reviews.

---

# 6. Final rehearsal checklist

## Product story

- [ ] I can explain the problem in one sentence.
- [ ] I can explain the unique differentiator in one sentence.
- [ ] I can explain why Hindsight is necessary.
- [ ] I can explain the human-confirmed learning loop.

## Demo

- [ ] The first incident is preselected.
- [ ] The synthetic label is visible.
- [ ] Hindsight status is known.
- [ ] The demo bank is populated.
- [ ] One evidence citation is ready.
- [ ] One failed fix is ready.
- [ ] One verified resolution is ready.
- [ ] The outcome form is ready.
- [ ] The second analysis visibly uses the retained lesson.
- [ ] The backup simulation path is ready.

## Submission

- [ ] Repository URL verified.
- [ ] Live demo URL verified.
- [ ] Demo video link verified.
- [ ] Article finalized.
- [ ] Social post finalized.
- [ ] Official content-guide requirements complete.
- [ ] No API keys or private data in any artifact.
- [ ] No unsupported performance claims.

---

# 7. Definition of ready

RecallOps is judge-ready when all of the following are true:

1. A judge understands the problem within 15 seconds.
2. The unique failure-aware memory idea is clear.
3. Hindsight recall is shown with inspectable evidence.
4. A human-confirmed outcome is retained.
5. The retained outcome changes a later analysis.
6. The demo works live or falls back honestly to simulation mode.
7. The product’s safety boundaries are visible.
8. A credible real-world adoption path is explained.
9. The repository, live demo, video, article, and social deliverables are complete.
10. No placeholder links or unsupported claims remain.

The highest-value strategy is to polish and prove the existing core workflow rather than adding many unrelated features.
