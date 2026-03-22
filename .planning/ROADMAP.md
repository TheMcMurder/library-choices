# Roadmap: Cache County Library Choices

## Milestones

- ✅ **v1.0 MVP** — Phases 1–6 (shipped 2026-03-21) — [archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 UX — Citizen-Meaningful Controls** — Phases 7–12 (shipped 2026-03-22) — [archive](milestones/v1.1-ROADMAP.md)
- 🚧 **v1.2 — Current Service Level Indicators** — Phase 13 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–6) — SHIPPED 2026-03-21</summary>

- [x] Phase 1: Scaffolding (2/2 plans) — completed 2026-03-20
- [x] Phase 2: Data and Controls (2/2 plans) — completed 2026-03-20
- [x] Phase 3: Calculator and Accessibility (1/1 plan) — completed 2026-03-20
- [x] Phase 4: Visual Polish and Shareability (2/2 plans) — completed 2026-03-21
- [x] Phase 5: Documentation Gap Fixes (1/1 plan) — completed 2026-03-21
- [x] Phase 6: Tech Debt Cleanup and Browser Verification (2/2 plans) — completed 2026-03-21

Full phase details: [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

</details>

<details>
<summary>✅ v1.1 UX — Citizen-Meaningful Controls (Phases 7–12) — SHIPPED 2026-03-22</summary>

- [x] Phase 7: Collections Budget Slider (2/2 plans) — completed 2026-03-21
- [x] Phase 8: Hours Open Schedule Display (1/1 plan) — completed 2026-03-21
- [x] Phase 9: Compact URL Encoding (1/1 plan) — completed 2026-03-21
- [x] Phase 10: Custom Staffing Selector + Clickable Nodes (1/1 plan) — completed 2026-03-22
- [x] Phase 11: Custom City Card Multi-Select (1/1 plan) — completed 2026-03-22
- [x] Phase 12: Fix Focus Ring Visibility (1/1 plan) — completed 2026-03-22

Full phase details: [milestones/v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md)

</details>

### v1.2 — Current Service Level Indicators (In Progress)

**Milestone Goal:** Visually distinguish the staffing card and collections slider tick marked `isCurrentServiceLevel: true` so citizens always see the current service baseline regardless of their active selection.

- [ ] **Phase 13: Current Service Level Indicators** — Amber border, badge, and slider tick that persist across all selection states; driven by config flag; screen reader accessible

## Phase Details

### Phase 13: Current Service Level Indicators
**Goal**: Citizens can always see which staffing level and collections funding amount represent the current service baseline, regardless of what they have selected
**Depends on**: Phase 12
**Requirements**: CURR-01, CURR-02, CURR-03, CURR-04, CURR-05
**Success Criteria** (what must be TRUE):
  1. The staffing card marked `isCurrentServiceLevel: true` has an amber border visible when the card is unselected, and that border coexists visibly with the blue selection ring when the card is selected
  2. The same staffing card displays a small "Current level" badge in the top-right corner that is visible in both selected and unselected states
  3. The collections slider tick for the option marked `isCurrentServiceLevel: true` is styled amber and remains amber regardless of where the slider is positioned
  4. Selecting a different staffing card or moving the slider does not remove or hide the current-level indicators on the baseline option
  5. A screen reader announces "Current level" for the badge — the indicator is not conveyed by color alone
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Scaffolding | v1.0 | 2/2 | Complete | 2026-03-20 |
| 2. Data and Controls | v1.0 | 2/2 | Complete | 2026-03-20 |
| 3. Calculator and Accessibility | v1.0 | 1/1 | Complete | 2026-03-20 |
| 4. Visual Polish and Shareability | v1.0 | 2/2 | Complete | 2026-03-21 |
| 5. Documentation Gap Fixes | v1.0 | 1/1 | Complete | 2026-03-21 |
| 6. Tech Debt Cleanup and Browser Verification | v1.0 | 2/2 | Complete | 2026-03-21 |
| 7. Collections Budget Slider | v1.1 | 2/2 | Complete | 2026-03-21 |
| 8. Hours Open Schedule Display | v1.1 | 1/1 | Complete | 2026-03-21 |
| 9. Compact URL Encoding | v1.1 | 1/1 | Complete | 2026-03-21 |
| 10. Custom Staffing Selector + Clickable Nodes | v1.1 | 1/1 | Complete | 2026-03-22 |
| 11. Custom City Card Multi-Select | v1.1 | 1/1 | Complete | 2026-03-22 |
| 12. Fix Focus Ring Visibility | v1.1 | 1/1 | Complete | 2026-03-22 |
| 13. Current Service Level Indicators | v1.2 | 0/? | Not started | - |
