# RecallOps — Premium Flexible 3D UI/UX Plan

## Status

**Planning only. Do not implement yet.**

This plan defines a premium 3D-inspired experience for RecallOps while preserving the product’s core enterprise qualities: clarity, trust, evidence, safety, speed, and accessibility.

The design should feel like a high-quality operations product with spatial depth—not like a game, crypto dashboard, or decorative marketing page.

---

# 1. Design objective

## Experience goal

Make RecallOps feel like a premium incident command center where:

- Current incidents exist in the foreground.
- Historical memory sits behind the current investigation.
- Evidence connects the two as visible, inspectable layers.
- Human confirmation is the control point before new memory is retained.
- The interface has depth without hiding important information.

## Core design statement

> **RecallOps turns incident memory into an explorable operational workspace.**

## Premium qualities

- Calm, precise, and confident
- Responsive and fluid
- Strong visual hierarchy
- Subtle depth and lighting
- Excellent typography
- Purposeful motion
- High information density without clutter
- Fast first render
- Clear safety boundaries

---

# 2. 3D direction: spatial, not ornamental

## Recommended approach

Use a **hybrid 2.5D system** as the default:

- CSS perspective
- Layered cards
- Soft shadows
- Glass or translucent surfaces used sparingly
- Tilt only on pointer-capable devices
- Depth transitions between workspace states
- Small animated evidence connections
- Optional WebGL only for a contained hero visual

This provides a premium 3D impression without making the core operations workflow dependent on a heavy 3D engine.

## Avoid

- Full-screen rotating 3D objects behind text
- Constant parallax that makes reading difficult
- Excessive glassmorphism
- Neon gradients and gaming aesthetics
- Text floating in 3D space
- Motion that changes the position of form fields while typing
- Depth effects that reduce contrast
- A WebGL scene that delays the incident workspace

## Depth hierarchy

Use three consistent spatial layers:

| Layer | Purpose | Visual treatment |
|---|---|---|
| Layer 0 | App canvas | Soft neutral background, subtle grid/noise |
| Layer 1 | Workspace panels | White or slightly tinted surfaces, 1px borders |
| Layer 2 | Active evidence and decisions | Elevated cards, accent edge, focused glow |
| Layer 3 | Temporary feedback | Toasts, confirmation states, command popovers |

Do not create more than four simultaneous depth layers.

---

# 3. Premium visual system

## Color direction

Keep the enterprise foundation and add a controlled depth palette:

| Role | Suggested color |
|---|---|
| Canvas | `#F4F7FB` |
| Surface | `#FFFFFF` |
| Elevated surface | `#FBFDFF` |
| Ink | `#17212B` |
| Muted text | `#5B6873` |
| Primary blue | `#0078D4` |
| Deep blue | `#004578` |
| Memory violet | `#6B5DD3` |
| Verified green | `#107C10` |
| Caution amber | `#A66B00` |
| Critical red | `#C4314B` |
| Depth shadow | `rgba(20, 45, 75, .14)` |

Use violet only for memory provenance or historical context. Do not let it compete with the primary blue action color.

## Lighting model

Use one consistent light source across the interface:

- Highlight: top-left
- Shadow: bottom-right
- Border highlight: subtle white or blue tint
- No random shadow directions between components

## Surface treatment

Premium cards can use:

```css
background: rgba(255, 255, 255, 0.88);
backdrop-filter: blur(18px);
border: 1px solid rgba(255, 255, 255, 0.78);
box-shadow: 0 18px 45px rgba(31, 65, 100, 0.10);
```

Use this selectively. Critical operational data should remain on solid, high-contrast surfaces.

## Typography

Use a calm enterprise type scale:

- Display: 32–40px
- Page title: 26–32px
- Section title: 18–22px
- Card title: 15–17px
- Body: 14px
- Compact metadata: 11–12px
- Source IDs: monospace 11–12px

Avoid ultra-thin font weights. Depth effects should never be used to compensate for weak typography.

---

# 4. Application shell concept

## Spatial shell

The application should feel like a stable command surface:

- Dark navigation rail remains fixed and quiet.
- Main workspace floats as a large surface above the canvas.
- Top command bar sits on a separate plane.
- Active incident context is shown as a focused object or elevated header.

## Navigation rail

Add subtle depth only to active navigation:

- Inactive items: flat and quiet
- Active item: blue edge light and 1–2px elevation
- Hover: small translation toward the user, maximum 2px
- Collapsed rail: icon tile with tooltip and accessible label

## Top command bar

Include:

- Breadcrumb
- Workspace name
- Simulation/live indicator
- Hindsight connection status
- Help and safety control
- User menu

Use a gentle shadow only when the command bar overlaps content while scrolling.

---

# 5. Premium Incident Room

## Hero layout

The Incident Room should open with a layered hero composition:

### Back layer

A faint, low-contrast operational mesh:

- Grid lines
- Service nodes
- Timestamp markers
- No customer data
- No animated noise that competes with the form

### Middle layer

The incident context card:

- Severity
- Incident ID
- Service
- Environment
- Impact
- Recent change

### Front layer

The primary action panel:

- Incident input
- Demo scenario selector
- Analyze button
- Clear data-handling notice

## 3D interaction rule

Only the active layer may move. Background layers remain stable.

When the user selects a scenario:

1. Context card gently rises by 2px.
2. Related service node highlights.
3. Form values crossfade, not jump.
4. Focus remains on the selected scenario control.

---

# 6. Memory visualization

## Memory constellation

Create an optional memory visualization for the Memory Bank page, not the primary analysis form.

### Visual model

- Current incident: large central node
- Historical incidents: smaller surrounding nodes
- Evidence links: thin lines
- Failed actions: amber markers
- Verified resolutions: green markers
- Human-confirmed memories: blue-violet ring
- Synthetic memories: dashed outline
- No-match state: empty space with a cautious explanation

### Interaction

- Hover or keyboard focus reveals a compact memory preview.
- Selecting a node opens the full evidence ledger.
- Selecting an evidence link highlights the citation in the analysis panel.
- Zoom is bounded; never allow the user to lose the current incident context.
- Provide an accessible list view as an equivalent to the visualization.

## Data honesty

The visualization must not imply causal certainty from visual proximity. Add a label:

> **Similarity is evidence to investigate, not proof of today’s root cause.**

Do not use line thickness to represent confidence unless the value is explicitly defined and backed by data.

---

# 7. Evidence cards with depth

## Memory card anatomy

Each card should have a clear front face:

- Source ID
- Incident title
- Provenance badge
- Confidence state
- One-line lesson

On expand, reveal the second layer:

- Observed symptoms
- Failed path
- Verified path
- Follow-up lesson
- Citation context
- Historical-evidence caution

## Interaction behavior

- Expand/collapse uses a short height animation.
- The card does not tilt while expanded.
- Expanded state receives a strong focus ring.
- Only one card should receive the strongest elevation at a time.

## Depth cues

Use a thin accent edge:

- Blue: Hindsight memory
- Violet: human-confirmed memory
- Amber: synthetic demo memory
- Green: verified current outcome
- Red: blocked or unsafe action

Always pair color with text or an icon.

---

# 8. Retain and recall experience

## Premium learning-loop stepper

Use a horizontal stepper on desktop and vertical stepper on mobile:

```text
Recall → Investigate → Human confirms → Retain → Recall again
```

### State design

| State | Visual treatment |
|---|---|
| Not started | Flat outline |
| Current | Elevated surface and blue glow |
| Complete | Solid blue or green check |
| Blocked | Amber or red explanation |
| Retained | Layered success card with next action |

## Retention checkpoint

Use a focused elevated panel titled:

> **Confirm before this lesson enters memory**

The panel should visually separate:

- Evidence confirmation
- Human verification
- Privacy confirmation
- Historical-evidence disclaimer

Primary action:

> **Retain verified lesson**

After success, show:

> **Lesson retained. Run the analysis again to see what changed.**

Do not use confetti or celebratory effects for an operational memory write.

---

# 9. Motion system

## Motion principles

- Motion communicates state, not decoration.
- Use 150–220ms for micro-interactions.
- Use 250–400ms for panel transitions.
- Use spring-like easing only for cards and depth shifts.
- Never animate critical text while the user is reading it.

## Approved motion patterns

- Card lift on hover: 2px
- Evidence highlight pulse: one cycle
- Panel reveal: opacity + 8px vertical movement
- Stepper progression: line fill + icon transition
- Retention success: border glow + icon check
- Scenario switch: crossfade and small depth transition

## Reduced-motion support

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

When motion is disabled, preserve state changes through color, labels, and icons.

---

# 10. Flexible layout requirements

The 3D system must remain useful on every screen size.

## Desktop: 1280px and above

- Two-column Incident Room
- Memory constellation available beside or below evidence
- Hover tilt enabled
- Full stepper and metadata

## Tablet: 768–1279px

- Two-column layout only when space allows
- Reduce perspective and shadow intensity
- Collapse secondary metadata
- Keep the primary evidence ledger readable

## Mobile: 320–767px

- Single-column flow
- Disable pointer tilt
- Use vertical stepper
- Replace constellation with accessible list view
- Keep primary action sticky only if it does not cover content
- Never place critical confirmation controls inside a floating 3D layer

## Small-screen rule

> **If depth competes with reading, remove depth.**

---

# 11. Accessibility and usability

## Required accessibility behavior

- All 3D visualizations have an equivalent list/table view.
- Keyboard focus never depends on hover.
- Focus rings remain visible over elevated surfaces.
- Motion can be reduced or disabled.
- Contrast remains WCAG AA compliant.
- Status is communicated with text and icon, not color alone.
- Screen readers receive meaningful stepper state.
- Expanded cards announce their state.
- Canvas/visualization nodes have accessible names.
- Dragging, zooming, and pointer gestures are optional, never required.

## Usability constraints

- No critical control may be hidden behind a hover state.
- No 3D effect may obscure a citation ID.
- No translucent surface may sit over dense text without a solid fallback.
- Error and safety messages must remain flat, high-contrast, and stable.

---

# 12. Performance strategy

## Default recommendation

Implement premium depth with CSS and SVG first.

Use WebGL or a 3D library only if a contained visualization provides clear value and can be lazy-loaded.

## Performance budget

- First contentful paint should not depend on 3D initialization.
- Do not load a 3D library on the initial Incident Room route unless required.
- Lazy-load the Memory Constellation view.
- Keep the initial visual asset payload small.
- Use CSS transforms instead of layout-triggering properties.
- Prefer SVG nodes and lines for data visualizations.
- Cap active animated elements.
- Pause effects when the tab is hidden.

## Fallback behavior

If 3D initialization fails or the device is low-power:

1. Render the standard 2D evidence cards.
2. Preserve all data and controls.
3. Show no error to the user.
4. Keep the list view available.

---

# 13. Component inventory

## New or redesigned components

- `PremiumWorkspaceShell`
- `DepthSurface`
- `IncidentContextCard`
- `MemoryConstellation`
- `AccessibleMemoryList`
- `EvidenceLedgerCard`
- `LearningLoopStepper`
- `RetentionCheckpoint`
- `StatusLayer`
- `ScenarioTransition`
- `PremiumEmptyState`

## Component API principles

Each component should accept:

- `interactive?: boolean`
- `depth?: "flat" | "raised" | "focused"`
- `motion?: "full" | "reduced" | "none"`
- `provenance?: "hindsight" | "synthetic" | "human-confirmed"`
- `aria-label` or a semantic accessible name

Avoid components that require global hover state or global pointer coordinates.

---

# 14. Premium empty and loading states

## Empty Incident Room

Use a calm spatial illustration:

- One central node
- Three faint evidence rings
- Text: `Start with a synthetic incident or enter today’s observed signals.`
- CTA: `Choose a demo scenario`

## Loading state

Show a structured three-step progress state:

1. `Recalling relevant experience`
2. `Building evidence-cited hypotheses`
3. `Preparing read-only checks`

Do not show fake percentages or indefinite technical metrics.

## No-match state

Show a deliberately open visualization with:

> **No relevant prior memory found**
>
> RecallOps will keep this investigation broad and cautious rather than forcing a historical match.

---

# 15. Judge presentation strategy

## What judges should notice

Within the first 20 seconds:

1. The interface looks production-grade.
2. The spatial design has a purpose.
3. The product remembers operational experience.
4. The safety boundary is visible.
5. The app is not pretending that similarity equals certainty.

## Demo route

1. Open Incident Room.
2. Select Checkout 502s.
3. Show the elevated incident context card.
4. Run analysis.
5. Expand one memory card.
6. Show failed path, verified path, and citation.
7. Complete the retention checkpoint.
8. Run analysis again.
9. Show the learning delta.
10. Open Memory Bank to show the accessible list/3D view.

## Closing message

> **RecallOps gives incident experience a place to live—and gives responders a safer way to use it.**

---

# 16. Implementation phases

## Phase 0 — Design validation

- [ ] Create a static visual moodboard.
- [ ] Define color, type, shadow, and motion tokens.
- [ ] Prototype one card in flat, raised, and focused states.
- [ ] Validate the visual direction at desktop and mobile widths.
- [ ] Confirm that no official Microsoft branding is being implied.

## Phase 1 — 2.5D shell

- [ ] Implement depth tokens and `DepthSurface`.
- [ ] Add premium canvas and surface treatment.
- [ ] Improve navigation rail and command bar.
- [ ] Add subtle active-state depth.
- [ ] Add reduced-motion support.

## Phase 2 — Incident Room

- [ ] Add layered incident context card.
- [ ] Add premium empty and loading states.
- [ ] Add structured evidence ledger cards.
- [ ] Add learning-loop stepper.
- [ ] Add retention checkpoint surface.

## Phase 3 — Memory Bank visualization

- [ ] Implement accessible list view first.
- [ ] Add SVG-based memory constellation.
- [ ] Connect node selection to evidence details.
- [ ] Add provenance and no-match states.
- [ ] Lazy-load any optional 3D engine only after profiling.

## Phase 4 — Quality and polish

- [ ] Run keyboard navigation tests.
- [ ] Run screen-reader label tests.
- [ ] Run contrast checks.
- [ ] Test reduced motion.
- [ ] Test 320px, 768px, and desktop layouts.
- [ ] Test low-power fallback.
- [ ] Run production build and runtime smoke test.
- [ ] Rehearse the judge demo.

---

# 17. Definition of done

The premium 3D redesign is ready when:

- [ ] The interface feels premium without becoming distracting.
- [ ] Depth clarifies hierarchy instead of hiding content.
- [ ] The Incident Room remains fast and readable.
- [ ] The Memory Bank has both visualization and accessible list modes.
- [ ] The learning loop is visually memorable.
- [ ] Retention remains deliberate and safe.
- [ ] The experience works without WebGL.
- [ ] Reduced-motion mode is complete.
- [ ] Mobile users receive the same information and controls.
- [ ] The first render does not wait for 3D assets.
- [ ] No Microsoft affiliation is implied.
- [ ] All existing tests and safety checks continue to pass.

## Final design principle

> **Premium is not more effects. Premium is more control, more clarity, and more confidence in every interaction.**
