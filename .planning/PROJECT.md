# Cache County Library Choices

## What This Is

An interactive, mobile-first static website that helps Cache County citizens understand the fiscal choices around keeping their county library open. Users configure their own scenario — staffing level, collections funding, and which cities participate — and instantly see the resulting property tax impact per household. The site is built as a static site (Eleventy + Tailwind) with a separate data file so numbers can be updated without touching templates.

## Core Value

Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.

## Current State (v1.1 — Phase 10 complete 2026-03-22)

- **Live at:** https://themcmurder.github.io/library-choices/
- **Tech stack:** Eleventy v3 ESM + Tailwind CSS v4 (standalone CLI) + 11ty Nunjucks templates
- **Data file:** `src/_data/config.js` — all costs, city names, household counts, staffing levels
- **Build:** `pnpm run build` → `_site/` | CI: GitHub Actions deploys on push to `main`
- **Codebase:** ~1,350 LOC across src/ (HTML, Nunjucks, JS, CSS)
- **Known placeholder:** All cost/household values in `config.js` are marked `// PLACEHOLDER` — awaiting real data from product owner before public launch

## Requirements

### Validated (v1.0)

- [x] Deploy to GitHub Pages — *Validated Phase 1*
- [x] All dollar amounts and household counts live in a single data file — *Validated Phase 2*
- [x] Staffing level options: 1 FTE / 1 FTE + 1 PTE / 1 FTE + 2 PTE — *Validated Phase 2*
- [x] City participation: checkboxes for Providence, Nibley, Millville, River Heights — *Validated Phase 2*
- [x] Live configurator with three independent choice dimensions — *Validated Phase 3*
- [x] Collections budget: dropdown $10k–$60k ($30k default) — *Validated Phase 3*
- [x] Tax calculation: total annual cost ÷ total participating households — *Validated Phase 3*
- [x] Single per-household output number (uniform across cities) — *Validated Phase 3*
- [x] Mobile-first responsive design (375px+) — *Validated Phase 4 + Phase 6 browser QA*
- [x] Civic-appropriate visual design (blue-800 header, sticky result bar) — *Validated Phase 4 + Phase 6 browser QA*
- [x] URL shareability — copy URL restores exact selections — *Validated Phase 4*
- [x] WCAG 2.1 AA: screen reader aria-live, keyboard focus rings, 44px touch targets — *Validated Phase 3*
- [x] Collections select satisfies independent toggle (CONF-02: select-satisfies decision) — *Validated Phase 6*

## Current Milestone: v1.1 UX — Citizen-Meaningful Controls

**Goal:** Replace internal-terminology controls with citizen-meaningful UX — a collections budget slider with per-level context and a staffing section reframed as "hours open."

**Target features:**
- Collections budget: dropdown → slider with nodes + "Available books/digital" description per level (lowest = digital only / Beehive+Libby)
- Staffing levels: rename/reframe as "Hours Open" with structured weekly schedule (days + times in config.js, rendered by site)

### Active (v1.1)

- [x] Collections budget slider with nodes (replaces dropdown) — Validated in Phase 07: collections-budget-slider
- [x] Per-node "Available books/digital" description; lowest node = digital only (Beehive/Libby) — Validated in Phase 07: collections-budget-slider
- [x] Compact URL encoding: pi/tau/phi Greek letter aliases replace verbose params — *Validated in Phase 09*
- [ ] Staffing section reframed as "Hours Open" with weekly schedule display
- [ ] Structured schedule data in config.js (days + open/close times, rendered by site)

### Out of Scope

- Per-city cost breakdown — cost per household is uniform across cities by formula
- Logan, Hyrum, and cities that have already built their own libraries
- Backend / server-side logic — fully static
- User accounts or saved scenarios

## Context

The Cache County Council is shutting down the county library program. Several cities — Providence, Nibley, Millville, River Heights, and potentially others — are exploring whether to fund a collaborative library district. The current operation costs ~$250K/year (1 FTE + 2 PTE, full hours, plus collections budget). Citizens need to understand: what combination of service level and city participation leads to what property tax cost?

The site owner (a city council member or civic tech advocate) needs to update numbers as discussions evolve — new cities join, cost estimates shift — without touching HTML or JavaScript logic. The `config.js` NON-DEVELOPER EDIT GUIDE section supports this workflow.

## Constraints

- **Tech Stack**: Eleventy v3 + Tailwind CSS v4 standalone CLI (not PostCSS pipeline)
- **Hosting**: GitHub Pages — static HTML/CSS/JS only
- **Updatability**: All scenario data must live in `src/_data/config.js` — editable via GitHub web UI
- **Simplicity**: No build complexity beyond what's necessary; non-developer maintainable

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Eleventy v3 ESM over plain HTML | Separates data from presentation; template-driven city/staffing loops | ✓ Good — `config.js` edit workflow validated |
| Tailwind CSS v4 standalone CLI | Owner preference; avoids PostCSS pipeline complexity | ✓ Good — `postcss.config.mjs` was dead code, removed in Phase 6 |
| Single tax number (not per-city) | Cost per household is uniform across participating cities | ✓ Good — formula confirmed correct |
| All numbers in one data file | Owner can update without touching templates | ✓ Good — NON-DEVELOPER EDIT GUIDE added |
| City defaults via `defaultChecked` flag | Config-driven checked state instead of hardcoded `checked` attr | ✓ Good — added Phase 6, consistent with data-driven pattern |
| CONF-02: select-satisfies (no zero/off option) | Collections select is independent of staffing; "toggle" means independent adjustment | ✓ Decided Phase 6 — product owner confirmed |
| URL encoding via URLSearchParams + history.replaceState | Stateless sharing without server; degrades gracefully on invalid params | ✓ Good — all edge cases verified in Phase 6 browser QA |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 — Phase 10 complete. Staffing radio buttons converted to clickable card elements (CSS-only via has-[:checked]); slider tick labels converted to buttons that snap the slider to their value.*
