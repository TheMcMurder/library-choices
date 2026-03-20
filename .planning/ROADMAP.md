# Roadmap: Cache County Library Choices

## Overview

Four phases deliver a working civic tax configurator: first the build pipeline is verified on GitHub Pages, then the data schema and form controls are constructed, then the calculator logic and accessibility are validated, and finally the visual polish and shareable URLs complete the experience. Each phase builds directly on the previous and can be independently verified before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Scaffolding** - Eleventy + Tailwind + GitHub Pages pipeline verified with a deployed page (completed 2026-03-20)
- [ ] **Phase 2: Data and Controls** - Data schema locked, all form controls rendered from data, explanatory copy in place
- [ ] **Phase 3: Calculator and Accessibility** - Real-time tax calculation working with full WCAG 2.1 AA compliance
- [ ] **Phase 4: Visual Polish and Shareability** - Production-quality design and shareable URL encoding complete

## Phase Details

### Phase 1: Scaffolding
**Goal**: The build pipeline is working and a deployed page is accessible at the correct GitHub Pages URL with no broken asset references
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03
**Success Criteria** (what must be TRUE):
  1. Running `pnpm run build` produces a `_site/` directory with valid HTML, CSS, and JS
  2. GitHub Actions deploys on push to main and the deployed page loads at the GitHub Pages URL with no 404 errors on any asset
  3. `_site/` is absent from the git repository (gitignored) and never committed to main
**Plans:** 2/2 plans complete
Plans:
- [ ] 01-01-PLAN.md — Eleventy v3 + Tailwind CSS v4 project scaffold with working local build
- [ ] 01-02-PLAN.md — GitHub Actions deploy workflow and deployment verification

### Phase 2: Data and Controls
**Goal**: All form controls are rendered from the data file and a non-developer can update costs or city names by editing one file without touching any template
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, DATA-03, CONF-01, CONF-02, CONF-03, TRST-01, TRST-02
**Success Criteria** (what must be TRUE):
  1. The page renders staffing radio buttons, a collections toggle, and city checkboxes — all driven from `_data/config.js` with no hardcoded values in the template
  2. Adding a new city to `_data/config.js` causes it to appear as a checkbox on the next build with no other file changes
  3. Each control has plain-language explanatory copy describing what it means in practice
  4. Source citations for cost estimates and household counts are visible on the page
  5. Editing `_data/config.js` via GitHub's web UI is sufficient to update all numbers — no local dev environment required
**Plans**: TBD

### Phase 3: Calculator and Accessibility
**Goal**: Selecting any combination of controls immediately shows the correct annual cost per household, with the result readable by screen readers and operable by keyboard
**Depends on**: Phase 2
**Requirements**: CONF-04, CONF-05, TRST-03
**Success Criteria** (what must be TRUE):
  1. Changing any control (staffing level, collections toggle, or city checkbox) updates the displayed cost instantly with no page reload
  2. Selecting zero cities shows a friendly explanatory message instead of NaN, infinity, or an error
  3. The result region is announced by screen readers when it updates (aria-live)
  4. All controls are reachable and operable via keyboard alone with visible focus indicators
  5. All interactive controls meet the 44px minimum touch target requirement
**Plans**: TBD

### Phase 4: Visual Polish and Shareability
**Goal**: The site looks trustworthy and civic-appropriate on any device, and any scenario can be shared by copying the URL
**Depends on**: Phase 3
**Requirements**: DESG-01, DESG-02, DESG-03, CONF-06
**Success Criteria** (what must be TRUE):
  1. The site renders correctly and is fully usable on a 375px-wide phone screen without horizontal scrolling or zooming
  2. The annual cost per household is displayed prominently — large typography, visible above the fold on mobile
  3. The visual design conveys civic credibility (not a prototype or developer default aesthetic)
  4. Copying the page URL and opening it in a new browser window restores the exact same staffing, collections, and city selections
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffolding | 2/2 | Complete   | 2026-03-20 |
| 2. Data and Controls | 0/TBD | Not started | - |
| 3. Calculator and Accessibility | 0/TBD | Not started | - |
| 4. Visual Polish and Shareability | 0/TBD | Not started | - |
