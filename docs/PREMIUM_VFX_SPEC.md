# RecallOps Premium VFX Design Specification

## Purpose

This document specifies the visual-effects system for a premium RecallOps experience.
It is intentionally implementation-ready but does not replace product safety requirements.
VFX means visual feedback, depth, lighting, motion, spatial memory, and state clarity.
The goal is to make incident memory feel explorable without turning operations into a game.

## Non-negotiable principles

- Evidence remains more important than decoration.
- Safety messages remain readable above every effect.
- Every visualization has an accessible non-visual equivalent.
- Every effect has a reduced-motion and low-power interpretation.
- The application works fully without WebGL.
- Synthetic, live, fallback, and human-confirmed states remain explicit.
- Similarity is never presented as causality.
- Premium quality comes from control, clarity, and confidence.

## VFX vocabulary

| Term | Meaning |
| --- | --- |
| Surface | A visual plane containing related information. |
| Depth | The perceived distance between surfaces. |
| Focus | The currently selected or active visual state. |
| Ambient | Non-interactive background atmosphere. |
| Provenance | The origin of a memory or evidence item. |
| Fallback | A simpler presentation that preserves functionality. |
| Learning delta | Observable differences between two analyses. |

## How to use this specification

Each section defines one VFX concern and records its purpose, behavior, constraints, fallback, and acceptance check.
Product designers should use the sections as a shared vocabulary with frontend engineers.
Engineers should implement tokens before component-specific effects.
Judges should see the effects as a coherent product language rather than isolated tricks.
All copy examples are illustrative and must remain honest about synthetic data.

## 001. VFX north star

**Intent:** Define effects that make evidence feel spatial, calm, and trustworthy.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.vfx-north-star`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 002. Premium visual principles

**Intent:** Use restraint, hierarchy, lighting consistency, and purposeful motion.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.premium-visual-principles`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 003. Brand atmosphere

**Intent:** Balance enterprise precision with a memorable sense of operational depth.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.brand-atmosphere`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 004. Canvas and world space

**Intent:** Treat the application background as a quiet operational world.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.canvas-and-world-space`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 005. Navigation rail

**Intent:** Use depth to make navigation feel stable, tactile, and easy to scan.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.navigation-rail`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 006. Command bar

**Intent:** Use a floating command surface that remains calm during investigation.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.command-bar`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 007. Incident hero

**Intent:** Make the current incident the visual anchor of the workspace.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.incident-hero`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 008. Incident glow

**Intent:** Use a controlled halo to communicate active investigation without alarm fatigue.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.incident-glow`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 009. Incident severity

**Intent:** Use light, color, and copy to communicate severity without flashing.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.incident-severity`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 010. Current incident node

**Intent:** Represent the current investigation as a stable central spatial object.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.current-incident-node`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 011. Historical memory nodes

**Intent:** Place prior incidents around the current incident with clear provenance.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.historical-memory-nodes`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 012. Memory orbit

**Intent:** Use orbital motion only to show relationships, never to imply causality.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.memory-orbit`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 013. Evidence connectors

**Intent:** Animate evidence links when a citation is selected.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.evidence-connectors`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 014. Failed action marker

**Intent:** Use amber markers to make failed paths easy to recognize.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.failed-action-marker`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 015. Verified resolution marker

**Intent:** Use green markers to distinguish confirmed resolution paths.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.verified-resolution-marker`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 016. Human confirmation marker

**Intent:** Use a visible confirmation ring for human-verified memory.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.human-confirmation-marker`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 017. Synthetic data marker

**Intent:** Make demo data visibly synthetic without making the interface feel fake.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.synthetic-data-marker`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 018. No-match state

**Intent:** Use negative space to communicate that no relevant memory was found.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.no-match-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 019. Weak similarity state

**Intent:** Reduce visual intensity when historical similarity is weak.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.weak-similarity-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 020. Strong similarity state

**Intent:** Increase evidence emphasis while preserving the caution label.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.strong-similarity-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 021. Memory recall transition

**Intent:** Show recalled evidence entering the investigation in a readable sequence.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.memory-recall-transition`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 022. Reasoning transition

**Intent:** Present reasoning as layered evidence assembly rather than magic.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.reasoning-transition`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 023. Human review transition

**Intent:** Make human review feel like a deliberate control point.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.human-review-transition`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 024. Retention transition

**Intent:** Show a verified lesson entering memory with a quiet confirmation effect.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.retention-transition`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 025. Recall-again transition

**Intent:** Show how retained experience becomes available on the next run.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.recall-again-transition`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 026. Learning delta panel

**Intent:** Use visual comparison to show factual changes between analyses.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.learning-delta-panel`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 027. Hypothesis card

**Intent:** Give each hypothesis a surface with clear evidence references.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.hypothesis-card`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 028. Read-only check card

**Intent:** Make observational checks look safe, inspectable, and actionable.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.read-only-check-card`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 029. Safety boundary

**Intent:** Keep safety notices visually stable and separate from decorative effects.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.safety-boundary`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 030. Citation focus

**Intent:** Use a spotlight effect to connect a recommendation to its source.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.citation-focus`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 031. Evidence ledger

**Intent:** Use layered card surfaces to reveal observed, failed, verified, and lesson fields.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.evidence-ledger`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 032. Provenance badges

**Intent:** Make source type visible through shape, text, and color.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.provenance-badges`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 033. Confidence badges

**Intent:** Represent confidence with restrained intensity and explicit words.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.confidence-badges`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 034. Loading state

**Intent:** Make loading progress explainable without fake percentages.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.loading-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 035. Empty state

**Intent:** Use a calm spatial illustration to invite the first investigation.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.empty-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 036. Error state

**Intent:** Use stable high-contrast surfaces with recovery guidance.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.error-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 037. Success state

**Intent:** Use a professional confirmation surface without confetti.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.success-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 038. Toast effects

**Intent:** Keep temporary feedback compact, accessible, and non-blocking.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.toast-effects`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 039. Button micro-interactions

**Intent:** Use slight lift and highlight for tactile feedback.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.button-micro-interactions`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 040. Input focus

**Intent:** Use a precise focus ring that feels like a control surface.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.input-focus`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 041. Scenario switch

**Intent:** Crossfade scenario content without disorienting the operator.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.scenario-switch`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 042. Form validation

**Intent:** Use local feedback that does not shift the entire layout unexpectedly.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.form-validation`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 043. Primary CTA

**Intent:** Make analysis the strongest visual action on the Incident Room.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.primary-cta`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 044. Secondary actions

**Intent:** Keep supporting actions visually subordinate but discoverable.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.secondary-actions`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 045. Map/list toggle

**Intent:** Make visualization and accessible list modes feel like equal views.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.map/list-toggle`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 046. Memory selection

**Intent:** Use focus, border, and depth to show the selected node.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.memory-selection`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 047. Keyboard traversal

**Intent:** Make every interactive VFX state reachable without a pointer.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.keyboard-traversal`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 048. Screen-reader state

**Intent:** Pair visual transitions with meaningful accessible announcements.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.screen-reader-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 049. Reduced motion

**Intent:** Provide a complete static interpretation of every animated state.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.reduced-motion`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 050. Pointer tilt

**Intent:** Use subtle tilt only on capable desktop devices.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.pointer-tilt`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 051. Touch behavior

**Intent:** Replace hover depth with press and selection states on touch devices.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.touch-behavior`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 052. Mobile layout

**Intent:** Keep depth from covering critical controls on small screens.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.mobile-layout`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 053. Tablet layout

**Intent:** Reduce perspective and preserve evidence readability.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.tablet-layout`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 054. Large display layout

**Intent:** Use additional whitespace without scaling effects excessively.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.large-display-layout`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 055. Surface tokens

**Intent:** Define reusable surface, border, shadow, and highlight variables.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.surface-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 056. Depth tokens

**Intent:** Define flat, raised, focused, and overlay levels.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.depth-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 057. Lighting tokens

**Intent:** Keep highlight direction consistent across the product.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.lighting-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 058. Motion tokens

**Intent:** Define fast, standard, deliberate, and none motion modes.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.motion-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 059. Color tokens

**Intent:** Assign colors by semantic meaning instead of decoration.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.color-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 060. Typography tokens

**Intent:** Use size, weight, and line height to carry hierarchy.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.typography-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 061. Radius tokens

**Intent:** Use a restrained radius family that supports enterprise credibility.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.radius-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 062. Shadow tokens

**Intent:** Use shadows to separate layers without muddying the page.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.shadow-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 063. Blur tokens

**Intent:** Reserve blur for surfaces where it does not reduce clarity.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.blur-tokens`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 064. Grid texture

**Intent:** Use a faint grid to suggest operational structure.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.grid-texture`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 065. Mesh texture

**Intent:** Use a low-contrast mesh as a non-interactive background layer.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.mesh-texture`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 066. Particle field

**Intent:** Use very sparse particles only for ambient memory context.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.particle-field`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 067. Particle safety

**Intent:** Never use particles around warning or confirmation controls.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.particle-safety`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 068. Node pulse

**Intent:** Use one-cycle pulses for selected evidence instead of continuous breathing.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.node-pulse`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 069. Orbit timing

**Intent:** Keep orbital timing slow and pause it when content is selected.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.orbit-timing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 070. Connection draw

**Intent:** Draw evidence links from source to recommendation during focus.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.connection-draw`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 071. Depth parallax

**Intent:** Limit parallax to a few pixels and disable it for reduced motion.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.depth-parallax`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 072. Glass surfaces

**Intent:** Use translucency only where the background remains low contrast.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.glass-surfaces`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 073. Solid fallback

**Intent:** Provide solid surfaces for dense evidence and forms.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.solid-fallback`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 074. Gradient discipline

**Intent:** Use gradients to support lighting, not as decoration.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.gradient-discipline`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 075. Dark mode option

**Intent:** Plan a dark mode with equivalent contrast and semantic colors.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.dark-mode-option`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 076. Light mode quality

**Intent:** Ensure the default light experience remains premium and not washed out.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.light-mode-quality`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 077. Enterprise tone

**Intent:** Avoid gaming, crypto, cyberpunk, and neon visual language.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.enterprise-tone`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 078. Microsoft compatibility

**Intent:** Remain enterprise-compatible without implying official affiliation.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.microsoft-compatibility`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 079. Azure sample context

**Intent:** Use fictional enterprise data with explicit synthetic labels.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.azure-sample-context`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 080. Privacy visual language

**Intent:** Make redaction and data boundaries visually understandable.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.privacy-visual-language`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 081. Audit visual language

**Intent:** Keep governance surfaces quieter than incident surfaces.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.audit-visual-language`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 082. Usage dashboard

**Intent:** Use restrained charts with clear labels and no decorative noise.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.usage-dashboard`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 083. Activity timeline

**Intent:** Use a vertical depth line to make events easy to follow.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.activity-timeline`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 084. Playbook cards

**Intent:** Give playbooks a calm, tactile card system.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.playbook-cards`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 085. Resource surfaces

**Intent:** Use cards for integration and safety guidance without overselling.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.resource-surfaces`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 086. Authentication state

**Intent:** Make sign-in requirements clear without visual intimidation.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.authentication-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 087. Provider status

**Intent:** Use a compact connection indicator with honest status text.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.provider-status`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 088. Simulation state

**Intent:** Make simulation mode prominent enough to prevent confusion.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.simulation-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 089. Live state

**Intent:** Make live Hindsight mode feel trusted but not overpromised.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.live-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 090. Fallback state

**Intent:** Make provider fallback visible and recoverable.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.fallback-state`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 091. Network latency

**Intent:** Use progressive feedback for slow external memory calls.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.network-latency`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 092. Provider error

**Intent:** Avoid dramatic effects during a provider error.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.provider-error`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 093. Retry action

**Intent:** Use a clear retry affordance with stable layout.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.retry-action`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 094. Data redaction

**Intent:** Animate redaction only as a brief explanatory cue.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.data-redaction`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 095. Retention privacy

**Intent:** Use a privacy checklist surface before a lesson is retained.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.retention-privacy`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 096. Operational caution

**Intent:** Keep caution copy readable above all ambient effects.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.operational-caution`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 097. Demo choreography

**Intent:** Design a short visual path that judges can understand quickly.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.demo-choreography`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 098. First ten seconds

**Intent:** Create a clear focal state before any interaction.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.first-ten-seconds`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 099. First analysis

**Intent:** Show memory entering the investigation with intentional pacing.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.first-analysis`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 100. Second analysis

**Intent:** Make the learning delta visually undeniable but factual.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.second-analysis`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 101. Judge screenshot

**Intent:** Ensure the default viewport is visually balanced and legible.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.judge-screenshot`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 102. Brand screenshot

**Intent:** Create a coherent shareable visual identity without false claims.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.brand-screenshot`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 103. Performance budget

**Intent:** Set limits for paint, animation, memory, and asset weight.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.performance-budget`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 104. CSS implementation

**Intent:** Prefer transform and opacity for safe compositing.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.css-implementation`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 105. SVG implementation

**Intent:** Use SVG for nodes, links, and simple spatial diagrams.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.svg-implementation`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 106. Canvas implementation

**Intent:** Use canvas only when the content remains accessible elsewhere.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.canvas-implementation`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 107. WebGL boundary

**Intent:** Lazy-load WebGL only for a proven value case.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.webgl-boundary`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 108. 3D fallback

**Intent:** Ensure the app remains complete without advanced graphics.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.3d-fallback`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 109. Asset pipeline

**Intent:** Keep textures and visual assets compressed and optional.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.asset-pipeline`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 110. Browser support

**Intent:** Detect unsupported effects and degrade gracefully.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.browser-support`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 111. Low-power mode

**Intent:** Reduce animation and blur on constrained devices.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.low-power-mode`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 112. Hidden tab behavior

**Intent:** Pause ambient effects when the tab is not visible.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.hidden-tab-behavior`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 113. Testing strategy

**Intent:** Test visual states as behavior, not only as screenshots.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.testing-strategy`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 114. Visual regression

**Intent:** Capture stable reference views for key routes.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.visual-regression`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 115. Interaction testing

**Intent:** Verify focus, selection, retention, and fallback states.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.interaction-testing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 116. Contrast testing

**Intent:** Verify text and controls over every depth surface.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.contrast-testing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 117. Motion testing

**Intent:** Verify reduced-motion output for every animated component.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.motion-testing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 118. Responsive testing

**Intent:** Verify 320px, tablet, desktop, and wide layouts.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.responsive-testing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 119. Accessibility testing

**Intent:** Verify screen-reader names and state announcements.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.accessibility-testing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 120. Security testing

**Intent:** Ensure effects never expose secrets or raw provider data.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.security-testing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 121. Content testing

**Intent:** Check that long incident text does not break surfaces.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.content-testing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 122. Localization readiness

**Intent:** Avoid animations and widths that assume English labels.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.localization-readiness`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 123. Resilience testing

**Intent:** Verify visual fallback during provider and network failures.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.resilience-testing`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 124. Documentation

**Intent:** Document every VFX token and component behavior.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.documentation`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 125. Design review

**Intent:** Use a visual checklist before releasing a new effect.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.design-review`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 126. Acceptance criteria

**Intent:** Define what premium means in observable terms.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.acceptance-criteria`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 127. Release checklist

**Intent:** Verify build, smoke test, accessibility, and performance.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.release-checklist`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## 128. Final VFX promise

**Intent:** Make the product feel premium through clarity and control.

**Visual behavior:** Use a restrained effect that establishes hierarchy and makes the relevant state easier to understand.

**Interaction behavior:** The effect responds to a meaningful user action, selection, transition, or status change.

**Depth rule:** Keep the effect within the approved spatial hierarchy and never obscure critical content.

**Motion rule:** Use transform and opacity where possible, keep timing deliberate, and avoid continuous attention capture.

**Accessibility rule:** Provide text, icon, focus, list, or semantic state that communicates the same meaning without relying on the effect.

**Fallback rule:** On unsupported, reduced-motion, mobile, or low-power contexts, render a stable 2D equivalent.

**Performance rule:** Avoid layout-triggering animation, cap simultaneous effects, and pause ambient work when the page is hidden.

**Implementation key:** `vfx.final-vfx-promise`

**Acceptance check:** A reviewer can explain what the effect communicates, and removing the effect does not remove product functionality.

## Final acceptance matrix

| Area | Must be true before release |
| --- | --- |
| Visual hierarchy | The current incident and primary action are immediately obvious. |
| Memory | Historical evidence is spatially understandable and inspectable. |
| Safety | Cautions and confirmation controls are never visually buried. |
| Accessibility | Every spatial state has a keyboard and screen-reader equivalent. |
| Motion | Reduced-motion mode removes unnecessary movement without removing meaning. |
| Performance | First render does not wait for 3D assets or WebGL. |
| Reliability | Provider errors and no-match states remain calm and actionable. |
| Honesty | Simulation, live, fallback, and human-confirmed states are accurately labelled. |
| Responsive design | The same information remains available at 320px, tablet, and desktop widths. |
| Judge demo | The visual story is understandable within the first ten seconds. |

## Final design statement

> RecallOps should feel premium because every visual effect makes the evidence, decision, or safety boundary clearer.
