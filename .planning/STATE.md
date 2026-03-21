---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: UX — Citizen-Meaningful Controls
status: defining_requirements
stopped_at: ~
last_updated: "2026-03-21T00:00:00.000Z"
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-21)

**Core value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.
**Current focus:** Defining requirements for v1.1

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-03-21 — Milestone v1.1 started

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: none yet
- Trend: -

*Updated after each plan completion*
| Phase 01-scaffolding P01 | 5 | 2 tasks | 8 files |
| Phase 01-scaffolding P02 | 20 | 2 tasks | 1 files |
| Phase 02 P01 | 1min | 2 tasks | 3 files |
| Phase 02-data-and-controls P02 | 1min | 1 tasks | 2 files |
| Phase 02-data-and-controls P02 | 15min | 2 tasks | 3 files |
| Phase 03 P01 | 2min | 2 tasks | 2 files |
| Phase 04-visual-polish-and-shareability P02 | 8min | 1 tasks | 2 files |
| Phase 04-visual-polish-and-shareability P02 | 8min | 2 tasks | 2 files |
| Phase 05-documentation-gap-fixes P01 | 1min | 2 tasks | 2 files |
| Phase 06-tech-debt-and-browser-verification P01 | 2min | 2 tasks | 3 files |
| Phase 06-tech-debt-and-browser-verification P02 | 30min | 3 tasks | 2 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Stack: Eleventy v3 + Tailwind CSS v4 + vanilla JavaScript (no framework)
- Data: `_data/config.js` is single source of truth; embedded as `window.LIBRARY_DATA` at build time
- Paths: Use relative asset paths or `pathPrefix` from day one to avoid GitHub Pages subdirectory 404s
- Arithmetic: Store monetary values as integers in data file; format with `toFixed(2)` only at display
- [Phase 01-scaffolding]: Added type:module to package.json — eleventy.config.js uses ESM import syntax
- [Phase 01-scaffolding]: Updated engines to node>=20 — @tailwindcss/oxide native bindings require Node 20+
- [Phase 01-scaffolding]: Added @tailwindcss/cli as explicit devDependency — Tailwind v4 ships CLI as separate package
- [Phase 01-scaffolding]: Converted src/_data/config.js to ESM export default — required by type:module context
- [Phase 01-scaffolding]: Used Node.js 22 in CI workflow — current LTS, satisfies >=20 requirement for @tailwindcss/oxide native bindings
- [Phase 01-scaffolding]: Separated build and deploy into two jobs — deploy job holds Pages permissions, keeps permissions scoped and matches GitHub-native recommended pattern
- [Phase 01-scaffolding]: Used pnpm/action-setup@v4 in CI after project migrated from npm to pnpm — frozen-lockfile install for reproducibility
- [Phase 01-scaffolding]: CI package manager must match local tooling — pnpm/action-setup@v4 + frozen-lockfile pattern established for CI
- [Phase 02]: config.js non-developer edit guide block comment pattern established for single-source-of-truth data files
- [Phase 02]: toLocaleString Nunjucks filter registered in Eleventy config for comma-formatted number display in templates
- [Phase Phase 02]: htmlTemplateEngine: 'njk' added to eleventy.config.js — Eleventy defaults to Liquid for .html files; Nunjucks is required for dump filter and loop.first patterns
- [Phase Phase 02]: window.LIBRARY_DATA embedded via config | dump | safe pattern — Phase 3 calculator reads full config from this global at runtime
- [Phase 02-data-and-controls]: Collections budget uses select dropdown (k-k, k default) — allows residents to explore budget scenarios; k minimum is placeholder pending real data
- [Phase 02-data-and-controls]: isDefault flag on options array drives pre-selected state in Nunjucks select loops; select data-cost set at build time, Phase 3 must update on change events
- [Phase 03]: Collections cost reads select.value (live property), not select.dataset.cost (frozen build-time attribute)
- [Phase 03]: IIFE + 'use strict' wrapping for calculator module encapsulation without bundler
- [Phase 04]: Sticky bar #result-bar uses relative positioning so #breakdown-detail can use absolute bottom-full within the z-50 stacking context
- [Phase 04]: DRAFT overlay z-40, sticky bar z-50 — sticky bar always above overlay
- [Phase 04]: config.draft boolean and config.footerLinks array are non-developer editable fields in config.js; site owner toggles draft and supplies real footerLinks URLs via GitHub UI
- [Phase 04-02]: url.js uses IIFE + 'use strict' pattern matching calculator.js; history.replaceState not pushState for no-history-entry URL encoding; cities comma-joined per CONTEXT.md locked format
- [Phase 04-visual-polish-and-shareability]: url.js uses IIFE + 'use strict' pattern matching calculator.js; history.replaceState not pushState for no-history-entry URL encoding; cities comma-joined per CONTEXT.md locked format
- [Phase 05-documentation-gap-fixes]: Documentation-only fix: implementations of CONF-04, CONF-05, TRST-03 were already verified in Phase 3, only traceability metadata was missing
- [Phase 06-tech-debt-and-browser-verification]: City checkbox defaults moved to config.js defaultChecked flag — site owner can toggle without touching HTML
- [Phase 06-tech-debt-and-browser-verification]: postcss.config.mjs deleted — build uses Tailwind CLI, not PostCSS pipeline
- [Phase 06-tech-debt-and-browser-verification]: CONF-02 resolved as select-satisfies — the 6-level collections select satisfies independence requirement; no zero/off option added

### Pending Todos

None yet.

### Blockers/Concerns

- Actual household count and cost figures must be sourced from Cache County records before launch (content gap, not technical)
- Non-developer edit workflow must be explicitly tested with site owner via GitHub web UI before launch

## Session Continuity

Last session: 2026-03-21T02:15:25.244Z
Stopped at: Completed 06-02-PLAN.md
Resume file: None
