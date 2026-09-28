# RecallOps — Hackathon Submission Kit

These drafts are based on the current project implementation. Personalize names, team details, screenshots, and any event-specific requirements before publication. Do not claim accuracy gains, incident-time reductions, or customer adoption unless you measure them.

## Article draft

### RecallOps: Give incident response a memory

When production breaks, responders need more than another generic checklist. They need to know what their team has already learned: which symptoms preceded a similar incident, which fixes failed, what actually restored service, and what remains uncertain.

RecallOps is an AI incident-response assistant for on-call engineers, IT operations, and reliability teams. It connects a current incident description—service, symptoms, environment, recent change, and impact—to the team's persistent incident experience. Instead of starting from zero, a responder can inspect relevant historical evidence and use it to shape a cautious investigation plan.

The workflow is intentionally human-led. An engineer describes the incident. RecallOps asks Hindsight to retrieve relevant memories, then labels each source so a recommendation can be inspected. A planner can use that evidence to suggest hypotheses and read-only checks. Similarity is never treated as proof: a prior outage can suggest what to check, but the current system still has to provide confirming evidence. RecallOps does not restart services, roll back releases, run shell commands, or write to production.

The key design choice is Hindsight's role. Memory is not a transcript drawer beside a chatbot. After an incident, a human can confirm the root cause, record what did not work, describe the successful resolution, and capture a follow-up lesson. RecallOps retains that postmortem in the configured Hindsight bank. On a later incident, Hindsight can retrieve the new experience alongside earlier incidents. The agent's model is not retrained; its recommendations can change because new, relevant experience is available at decision time.

For the hackathon demo, RecallOps includes clearly labelled fictional incident scenarios: checkout errors after a worker-pool change, database connection pressure during autoscaling, and authentication failures after credential rotation. The before/after comparison illustrates the value of memory without presenting synthetic data as measured results. When no Hindsight credentials are configured, simulation mode remains interactive and stores confirmed lessons only in the current browser. The interface makes this limitation explicit rather than claiming a live memory write.

RecallOps is a prototype, not an incident-management replacement. The demo includes authenticated per-user memory banks, durable request limits, pseudonymous audit retention, and a role-scoped usage dashboard. A broader deployment would still require integration with an organization's trusted incident sources, evaluation against its own postmortems, and review of its data-access and retention policies. Its goal is narrower: help an engineer arrive at a better-informed next question, while keeping the final decision with the person responsible for the system.

### What Hindsight contributes

- Persistent retain/recall operations through the official TypeScript SDK.
- Retrieval that returns inspectable memory facts rather than an unexplained answer.
- A feedback loop where a human-confirmed resolution becomes experience for a future incident.
- A visible distinction between live Hindsight memory and synthetic/local simulation.

## Social post draft

We built **RecallOps** for the Microsoft Hack with Hyderabad hackathon: an incident-response assistant that helps on-call engineers avoid starting from zero.

It recalls what happened before—including fixes that failed—shows the evidence behind each hypothesis, and lets an engineer retain a verified postmortem for the next incident. The model is not retrained; the agent improves because relevant experience is available through Hindsight at decision time.

Human-led by design: no automatic restarts, rollbacks, or production writes. Synthetic incidents are labelled, and recommendations stay hypotheses until verified.

Project: [add repository or live demo link]

#HackwithHyderabad #AI #AIAgents #SRE #IncidentResponse #Hindsight

## 75–90 second demo-video script

**0:00–0:10 — The pain**

"When an incident starts, teams often reread old tickets under pressure. A generic chatbot has no memory of which fixes already failed. RecallOps is built to make that experience cumulative."

**0:10–0:23 — Describe the incident**

Show the Checkout 502s scenario. Point out that the incident is marked synthetic. Highlight the 502 spike and the recent change from 16 to 48 workers.

"This is fictional demo telemetry. We provide symptoms and a recent change—not the answer."

**0:23–0:40 — Recall with evidence**

Click **Analyze with incident memory**. Open `[E1]`.

"Hindsight found a related postmortem. The earlier restart attempts failed; the verified resolution was a configuration rollback. RecallOps cites the memory so a responder can inspect the source."

**0:40–0:53 — Show the difference**

Open the memory-delta panel.

"Without memory, we'd start with broad release and metrics checks. With memory, we can prioritize comparing the configuration and queue signals. That is a hypothesis—not proof that today's cause is the same."

**0:53–1:08 — Human confirmation**

Open **Record verified outcome** and enter a fictional root cause, failed action, and successful resolution. Tick the confirmation checkbox and save.

"The system will not retain an outcome until an engineer confirms it. It records what failed as well as what worked."

**1:08–1:21 — Learning loop and transparency**

Run analysis again and show the new evidence, then open **Usage & audit**. If you are not signed in as a demo admin, select **View synthetic preview**.

"In live mode, a confirmed lesson is retained in this account's private Hindsight bank. In simulation, it stays in this browser. The audit view is private and role-scoped; this sample preview is generated locally, not real request history. Live audit metadata expires after 30 days. The language model is not retrained—the relevant memory is supplied at reasoning time."

**1:21–1:30 — Safety and close**

"RecallOps is advisory only. It makes no production changes. Its job is to help engineers ask better questions, using the experience their team already earned."

## Recording checklist

- Use the synthetic demo scenarios; do not show API keys or private production logs.
- Show the `Hindsight connected` badge if the live integration is configured. If not, explicitly say "simulation mode".
- Verify the demo bank contains the synthetic pack before recording a live-memory claim.
- Show one evidence citation, one failed fix, one verified resolution, and the outcome-confirmation checkbox.
- In **Usage & audit**, show pseudonymous workspace scope only while signed in as an admin; do not expose personal identifiers.
- If using **View synthetic preview**, explicitly call the chart and sample accounts fictional; they are never queried from or written to the live audit tables.
- Do not claim reduced MTTR or improved accuracy without a separate evaluation.
- Capture the repo link and live demo URL only after they have been verified.
