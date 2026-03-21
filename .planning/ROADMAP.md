# Roadmap: Cache County Library Choices

## Milestones

- ✅ **v1.0 MVP** — Phases 1–6 (shipped 2026-03-21) — [archive](milestones/v1.0-ROADMAP.md)
- 🚧 **v1.1 UX — Citizen-Meaningful Controls** — Phases 7–8 (in progress)

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

### 🚧 v1.1 UX — Citizen-Meaningful Controls (In Progress)

**Milestone Goal:** Replace internal-terminology controls with citizen-meaningful UX — a collections budget slider with per-level context and a staffing section reframed as "Hours Open."

- [ ] **Phase 7: Collections Budget Slider** - Replace the dropdown with a native range slider that snaps to 6 nodes, shows citizen-meaningful descriptions, updates live, and preserves backward-compatible URL encoding
- [ ] **Phase 8: Hours Open Schedule Display** - Reframe the staffing section as "Hours Open," add structured weekly schedule data to config.js, and render schedules inline from Nunjucks templates

## Phase Details

### Phase 7: Collections Budget Slider
**Goal**: Citizens can explore collections budget options through a slider that shows what each level means in accessible, citizen-meaningful terms
**Depends on**: Phase 6 (v1.0 complete)
**Requirements**: SLDR-01, SLDR-02, SLDR-03, SLDR-04, SLDR-05, SLDR-06, SLDR-07, SLDR-08
**Success Criteria** (what must be TRUE):
  1. User can drag or keyboard-navigate the slider to any of 6 discrete dollar amounts ($10k–$60k) and the tax result updates live during the interaction — not only on release
  2. Each slider position shows a citizen-meaningful description of what that funding level provides; the lowest position explicitly describes digital-only access (Beehive/Libby)
  3. Dollar amount labels are visible below the slider in Firefox, Safari, and Chrome (CSS label row, not datalist-only)
  4. A screen reader user hears a meaningful label (e.g., "30,000 dollars — Print collection + digital") on every slider change, not a raw integer
  5. A previously shared URL containing `?collections=30000` restores the slider to the correct node when opened in a new browser tab
**Plans:** 2 plans (1 complete + 1 gap closure)
Plans:
- [x] 07-01-PLAN.md — Replace select dropdown with range slider, add descriptions and CSS styling, update JS for live interaction and URL restoration
- [x] 07-02-PLAN.md — Gap closure: dispatch input event after URL restoration so slider labels sync on shared URLs

### Phase 8: Hours Open Schedule Display
**Goal**: Citizens see each staffing option's actual weekly schedule inline, making the tradeoff between service levels tangible without requiring any JavaScript
**Depends on**: Phase 7
**Requirements**: HOURS-01, HOURS-02, HOURS-03, HOURS-04, HOURS-05
**Success Criteria** (what must be TRUE):
  1. The staffing section heading reads "Hours Open" — no reference to "Staffing Level" visible anywhere on the page
  2. Each radio option shows its weekly schedule (days and times) directly below the label, always visible without any click or toggle
  3. A non-technical site owner can update a schedule entirely through the GitHub web UI using the NON-DEVELOPER EDIT GUIDE, which includes a copy-pasteable example
  4. A shared URL using `?staffing=1fte-2pte` restores the correct radio selection after the "Hours Open" reframe
**Plans:** 1 plan
Plans:
- [x] 08-01-PLAN.md — Add schedule data + formatDays filter, rename heading to "Hours Open", render schedule tables inline, extend edit guide

### Phase 9: Compact URL Encoding — pi/tau/phi easter egg param aliases with positional index values
**Goal:** Shared URLs use compact Greek-letter param aliases (pi/tau/phi) with 0-based positional indices, reducing query strings by ~72% while preserving backward compatibility with existing verbose URLs
**Depends on:** Phase 8
**Requirements**: URL-01, URL-02, URL-03, URL-04, URL-05
**Success Criteria** (what must be TRUE):
  1. After any form interaction, the URL bar shows compact params (pi, tau, phi) with 0-based index values — not verbose param names
  2. Opening a compact URL like `?pi=2&tau=2&phi=0,1` in a new tab restores the correct staffing, collections, and city selections
  3. Opening a legacy verbose URL like `?staffing=1fte-2pte&collections=30000&cities=providence,nibley` in a new tab still restores correctly (backward compat)
  4. An out-of-bounds index (e.g. `?pi=99`) is silently ignored — the default selection is used
  5. The NON-DEVELOPER EDIT GUIDE warns that array reordering breaks compact URLs
**Plans:** 1 plan
Plans:
- [ ] 09-01-PLAN.md — Rewrite url.js with compact encode/decode, add edit guide array ordering warning

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Scaffolding | v1.0 | 2/2 | Complete | 2026-03-20 |
| 2. Data and Controls | v1.0 | 2/2 | Complete | 2026-03-20 |
| 3. Calculator and Accessibility | v1.0 | 1/1 | Complete | 2026-03-20 |
| 4. Visual Polish and Shareability | v1.0 | 2/2 | Complete | 2026-03-21 |
| 5. Documentation Gap Fixes | v1.0 | 1/1 | Complete | 2026-03-21 |
| 6. Tech Debt Cleanup and Browser Verification | v1.0 | 2/2 | Complete | 2026-03-21 |
| 7. Collections Budget Slider | v1.1 | 1/2 | Gap closure | - |
| 8. Hours Open Schedule Display | v1.1 | 0/1 | Planned | - |
| 9. Compact URL Encoding | v1.1 | 0/1 | Planned | - |
