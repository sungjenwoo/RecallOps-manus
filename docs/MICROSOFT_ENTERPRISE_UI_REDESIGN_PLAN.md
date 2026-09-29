# RecallOps — Microsoft Enterprise UI Redesign Plan

## Purpose

This plan defines how to redesign RecallOps into a polished, enterprise-grade web application with a Microsoft/Fluent-inspired experience that feels familiar to judges evaluating professional operations software.

The redesign should communicate:

- Trust
- Operational maturity
- Clear information hierarchy
- Enterprise safety
- Evidence-based decisions
- Microsoft ecosystem compatibility

The goal is **not** to imitate Microsoft branding or imply that RecallOps is an official Microsoft product. The goal is to use enterprise design principles associated with high-quality Microsoft applications: clarity, accessibility, restrained color, structured navigation, familiar controls, and professional operational dashboards.

---

# 1. Naming and brand direction

## Recommended product name

Keep the product name:

> **RecallOps**

Use a subtitle that explains the product:

> **RecallOps — Incident intelligence that remembers**

or:

> **RecallOps — Evidence-led incident response**

## Avoid the name “Microsoft RecallOps” unless authorized

The name **Microsoft RecallOps** could imply an official Microsoft product, partnership, endorsement, or ownership. That creates avoidable trademark and credibility risk.

Use one of these safer options instead:

- **RecallOps**
- **RecallOps for Modern Operations**
- **RecallOps for Azure Operations** — only if the product actually uses Azure-oriented sample data or an approved integration
- **RecallOps · Built for enterprise incident response**
- **RecallOps · A Hindsight-powered operations workspace**

## Recommended judge-facing wording

> “RecallOps is an independent Hindsight-powered incident-response workspace designed for modern engineering and Azure-oriented operations teams.”

Do not claim Microsoft partnership, Microsoft ownership, official Azure certification, or live Microsoft integration unless that is actually approved and implemented.

---

# 2. Visual direction

## Design concept

Use a **Fluent-inspired operations workspace**:

- Light neutral canvas
- White cards with subtle elevation
- Deep navy or graphite navigation rail
- Microsoft-like blue as the primary action color
- Green for verified memory and safe progress
- Amber for caution and synthetic/demo state
- Red only for active incident severity or blocked action
- Generous spacing and clear typography
- Strong focus states and keyboard accessibility

The current green RecallOps design has a trustworthy operations feel. The redesign should retain the product’s identity while shifting the palette toward a more Microsoft enterprise interface.

## Suggested color tokens

| Purpose        | Suggested token        | Use                                        |
| -------------- | ---------------------- | ------------------------------------------ |
| App canvas     | `#F5F7FA`              | Main background                            |
| Surface        | `#FFFFFF`              | Cards and panels                           |
| Navigation     | `#1B1A19` or `#201F1E` | Sidebar/rail                               |
| Primary action | `#0078D4`              | Analyze, continue, primary buttons         |
| Primary hover  | `#106EBE`              | Hover and active action state              |
| Deep text      | `#242424`              | Headings and important content             |
| Muted text     | `#605E5C`              | Secondary information                      |
| Border         | `#E1DFDD`              | Dividers and input borders                 |
| Verified       | `#107C10`              | Confirmed memories and safe states         |
| Caution        | `#D83B01` or `#986F0B` | Warnings and synthetic labels              |
| Critical       | `#D13438`              | Incident severity and blocking errors      |
| Azure accent   | `#0078D4`              | Microsoft-oriented sample/integration cues |

Use color semantically. Do not use Microsoft logo colors as decoration or place an official Microsoft logo in the application without authorization.

## Typography

Use a clean system-first stack:

```css
font-family: "Segoe UI Variable", "Segoe UI", system-ui, sans-serif;
```

Recommended hierarchy:

- Page title: 28–36px, semibold
- Section title: 20–24px, semibold
- Panel title: 16–18px, semibold
- Body: 14px
- Supporting text: 12–13px
- Labels: 11–12px, semibold, modest letter spacing
- Code/source IDs: system monospace

Avoid excessive uppercase text. Use it only for compact metadata labels.

---

# 3. Application shell redesign

## Navigation

Replace the current highly stylized operations rail with a more familiar enterprise shell:

### Left navigation rail

- RecallOps wordmark
- Product subtitle
- Workspace selector: `Incident workspace`
- Navigation groups:
  - **Investigate**
    - Incident room
    - Memory bank
    - Playbooks
  - **Review**
    - Activity
    - Usage & audit
  - **Resources**
    - Demo guide
    - Safety and data handling
- User/account area at the bottom
- Connection status indicator

### Top command bar

Include:

- Breadcrumb: `Operations / Incident room`
- Workspace name
- Hindsight connection status
- Simulation/live mode label
- Help button
- User menu or sign-in control

Do not hide the live/simulation distinction. It is essential for trust.

## Responsive behavior

- Desktop: full navigation rail and two-column workspace
- Tablet: compact navigation rail or collapsible navigation
- Mobile: top bar with menu drawer and stacked cards
- Preserve keyboard and screen-reader navigation at every breakpoint

---

# 4. Homepage / Incident Room redesign

## Page purpose

The first screen should make the product understandable within 15 seconds.

## Recommended layout

### Header area

- Breadcrumb: `Operations / Incident room`
- Title: **Investigate with institutional memory**
- Subtitle: `RecallOps connects today’s symptoms to verified experience from past incidents.`
- Right side:
  - `Synthetic demo data` badge
  - `No production changes` badge

### Hero value strip

Use three compact cards:

1. **Failure-aware memory**
   - Remembers ineffective fixes and verified resolutions.
2. **Evidence-cited plans**
   - Every memory-backed hypothesis points to a source.
3. **Human-controlled learning**
   - Only confirmed outcomes enter future memory.

### Incident input panel

Use a clean form layout with:

- Demo scenario selector
- Service
- Environment
- Symptoms and observed signals
- Recent change
- Business impact
- Data-handling notice
- Primary CTA: **Analyze with incident memory**

The primary CTA should be blue, prominent, and visually distinct from secondary actions.

### Analysis panel

Use clear stages:

1. **Retrieved experience**
2. **Hypotheses to verify**
3. **Read-only checks**
4. **Human confirmation**
5. **Retain lesson**

Avoid presenting the result as one long AI answer. Use structured cards and evidence references.

---

# 5. Hindsight memory experience redesign

## Memory bank page

Rename the page header to:

> **Memory bank**

Subtitle:

> `A private, inspectable record of what your team learned during incidents.`

### Memory bank summary cards

- Memory mode: `Private Hindsight bank` or `Simulation mode`
- Retained lessons
- Synthetic starter memories
- Confirmed outcomes
- Last recall activity

### Memory card design

Every memory card should show a structured layout:

| Field         | Example                                         |
| ------------- | ----------------------------------------------- |
| Incident      | `INC-2841 · Checkout 502s`                      |
| Observed      | Queue depth climbed after worker change         |
| Failed path   | Rolling restarts had no durable effect          |
| Verified path | Worker concurrency returned to baseline         |
| Lesson        | Compare configuration and queue telemetry first |
| Provenance    | Hindsight / Synthetic / Human-confirmed         |
| Caution       | Similarity is evidence, not proof               |

Use icons and labels consistently, but do not overcrowd the card.

## Visible learning loop

Use a persistent stepper:

```text
Recall → Investigate → Human confirms → Retain → Recall again
```

After retention, show a blue/green confirmation panel:

> **Lesson retained.** Run the analysis again to see what changed.

Then show the factual delta:

- New evidence IDs
- New confirmed lesson
- New hypothesis or check
- Confidence change, if any

Never invent an accuracy percentage inside the UI.

---

# 6. Safety checkpoint redesign

## Retention dialog or panel

Present the retention step as an enterprise review checkpoint rather than a casual form.

### Title

> **Confirm before this lesson enters memory**

### Required confirmations

- Current evidence supports the root cause and resolution.
- A human engineer verified the outcome.
- No secrets, credentials, personal data, or customer data are included.
- The entry is historical evidence, not an automatic remediation instruction.

### Button labels

Primary:

> **Retain verified lesson**

Secondary:

> **Save draft / cancel**

Avoid labels such as “Train the AI” because the model is not being retrained.

---

# 7. Microsoft/Azure-oriented enterprise presentation

## Enterprise context panel

Add a small, honest panel on the Resources or About area:

> **Designed for modern operations teams**
>
> RecallOps can begin with approved postmortems and later connect to authorized incident and deployment sources such as Azure DevOps, Azure Monitor, Application Insights, Microsoft Teams summaries, Jira, or ServiceNow. Production connectors require separate authorization, privacy, retention, and evaluation review.

## Do not claim

- Official Microsoft product
- Official Azure integration unless implemented
- Microsoft partnership
- Microsoft certification
- Production Azure telemetry access
- Customer adoption

## Fictional Azure sample

Show the fictional Azure-style sample only under a label such as:

> `Synthetic enterprise integration preview`

Keep it separate from live Hindsight memory and clearly mark it as demonstration data.

---

# 8. Audit and usage page redesign

## Page purpose

The Usage & audit page should look like an enterprise governance console, not a marketing dashboard.

### Recommended sections

1. **Workspace activity summary**
2. **Memory operation trends**
3. **Request-limit status**
4. **Retention and expiry**
5. **Recent pseudonymous events**
6. **Export controls**

### Trust language

Use clear descriptions:

- `No incident text is stored in audit events.`
- `Personal view is the default.`
- `Workspace view requires admin access.`
- `Audit metadata expires after 30 days.`
- `Simulation activity is not live provider usage.`

---

# 9. Component and interaction quality

## Controls

Use consistent Fluent-like control behavior:

- 4px or 6px corner radius
- Clear hover state
- Clear keyboard focus ring
- Disabled state with explanation
- Loading state with progress language
- Success state with a next action
- Error state with recovery guidance

## Buttons

Use a clear hierarchy:

- Primary: blue filled
- Secondary: neutral outlined
- Tertiary: text button
- Destructive or blocked: red only when necessary

Avoid using many different button styles in the same panel.

## Cards

- Use a 1px neutral border
- Use subtle shadow only for primary surfaces
- Keep card padding consistent
- Align card headings and metadata
- Use whitespace instead of additional decorative borders

## Tables and audit data

- Right-align numeric values
- Use compact row density with comfortable line height
- Provide column labels and accessible table semantics
- Do not expose raw actor hashes or user identity

---

# 10. Accessibility requirements

A professional Microsoft-style application must be accessible, not merely visually similar.

## Required checks

- [ ] All controls have accessible names.
- [ ] Keyboard navigation reaches every interactive element.
- [ ] Focus indicators are visible.
- [ ] Color is not the only way to communicate status.
- [ ] Text contrast meets WCAG AA for normal text.
- [ ] Form errors are associated with the correct field.
- [ ] Loading and success states use `aria-live` appropriately.
- [ ] The learning stepper exposes its current state to screen readers.
- [ ] Tables and audit data have meaningful headers.
- [ ] Mobile layout remains usable at 320px width.
- [ ] Reduced-motion preferences are respected.

---

# 11. Judge-focused demo polish

## First 15 seconds

The judge should see:

1. A polished enterprise shell.
2. A clear incident problem.
3. A visible synthetic-data label.
4. The promise: **remember failed actions and verified resolutions**.

## Main demo path

1. Open Incident room.
2. Select Checkout 502s.
3. Run analysis.
4. Open the structured memory ledger.
5. Show failed path and verified path.
6. Show memory/no-memory delta.
7. Confirm the lesson through the safety checkpoint.
8. Retain and run again.
9. Show factual changes after learning.
10. Close with advisory-only safety.

## Visual presentation rule

The demo should look like a product a professional operations team could adopt tomorrow, while still being honest that its data is synthetic and its production connectors are future work.

---

# 12. Implementation sequence

## P0 — Brand and shell

- [ ] Keep the product name **RecallOps**.
- [ ] Add subtitle **Incident intelligence that remembers**.
- [ ] Add a Fluent-inspired token layer.
- [ ] Redesign sidebar and top command bar.
- [ ] Replace decorative labels with clear enterprise navigation.
- [ ] Preserve visible Hindsight/simulation status.

## P0 — Incident Room

- [ ] Redesign page heading and value strip.
- [ ] Improve input panel hierarchy.
- [ ] Make the primary analysis CTA blue and obvious.
- [ ] Improve analysis stages and evidence layout.
- [ ] Keep the learning-loop stepper visible.

## P0 — Memory and retention

- [ ] Apply the structured memory-card layout.
- [ ] Apply the safe retention checkpoint styling.
- [ ] Improve the post-retention delta panel.
- [ ] Keep failed path, verified path, provenance, and caution visible.

## P1 — Enterprise surfaces

- [ ] Redesign Memory bank page.
- [ ] Redesign Usage & audit page.
- [ ] Add Resources or About page for enterprise integration boundaries.
- [ ] Add the fictional Azure-style preview with clear synthetic labeling.

## P1 — Accessibility and responsive quality

- [ ] Run keyboard navigation review.
- [ ] Run contrast review.
- [ ] Test 320px, 768px, and desktop layouts.
- [ ] Test reduced motion.
- [ ] Test screen-reader labels for status and progress.

## P1 — Judge rehearsal

- [ ] Record the redesigned 90-second demo.
- [ ] Confirm the first 15 seconds explain the value.
- [ ] Confirm no Microsoft affiliation is implied.
- [ ] Confirm the live/simulation status is visible.
- [ ] Confirm the retain → recall → delta flow is readable.

## P2 — Optional finishing details

- [ ] Add a polished product favicon and metadata.
- [ ] Add Open Graph preview metadata.
- [ ] Add empty states with clear next actions.
- [ ] Add command-bar style keyboard shortcuts only if they improve usability.
- [ ] Add a lightweight product tour only if it does not slow the main demo.

---

# 13. Definition of done

The redesign is ready when:

- [ ] The product is clearly branded as RecallOps.
- [ ] The subtitle communicates the value immediately.
- [ ] The app feels like professional enterprise software.
- [ ] The interface uses a consistent Microsoft/Fluent-inspired system without copying protected branding.
- [ ] The main incident workflow is understandable in 15 seconds.
- [ ] The Hindsight learning loop is visually obvious.
- [ ] Failed actions and verified resolutions are easy to scan.
- [ ] The safe retention checkpoint looks deliberate and trustworthy.
- [ ] Live, fallback, and simulation states are impossible to confuse.
- [ ] The application is accessible and responsive.
- [ ] The Azure/Microsoft adoption story is credible but honest.
- [ ] The final 90-second judge demo looks polished and runs without unnecessary navigation.

## Final positioning

> **RecallOps is an independent, Hindsight-powered incident intelligence workspace for modern operations teams. It combines a Microsoft-inspired enterprise experience with failure-aware memory, evidence-cited reasoning, and human-controlled learning.**
