---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
stopped_at: Completed 02-02-PLAN.md
last_updated: "2026-03-20T20:10:18.604Z"
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 4
  completed_plans: 4
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-20)

**Core value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.
**Current focus:** Phase 02 — data-and-controls

## Current Position

Phase: 02 (data-and-controls) — EXECUTING
Plan: 1 of 2

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

### Pending Todos

None yet.

### Blockers/Concerns

- Actual household count and cost figures must be sourced from Cache County records before launch (content gap, not technical)
- Non-developer edit workflow must be explicitly tested with site owner via GitHub web UI before launch

## Session Continuity

Last session: 2026-03-20T20:02:54.694Z
Stopped at: Completed 02-02-PLAN.md
Resume file: None
