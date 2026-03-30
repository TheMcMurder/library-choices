---
gsd_state_version: 1.0
milestone: v1.3
milestone_name: — Separate Digital and Physical Collections
status: Milestone complete
stopped_at: Completed 17-01-PLAN.md
last_updated: "2026-03-30T00:17:55.883Z"
progress:
  total_phases: 5
  completed_phases: 4
  total_plans: 5
  completed_plans: 5
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-21)

**Core value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.
**Current focus:** Phase 17 — migrate-to-calculator-helpers-and-more-easily-testable-code-structure

## Current Position

Phase: 17
Plan: Not started

## Performance Metrics

**Velocity:**

- Total plans completed: 13 plans (v1.0 + v1.1)
- Average duration: ~20 min
- Total execution time: ~4.5 hours

**By Phase:**

| Phase | Plans | Milestone |
|-------|-------|-----------|
| 1–6 | 10 plans | v1.0 |
| 7–12 | 7 plans | v1.1 |
| 13 | TBD | v1.2 |

**Recent Trend:**

- Last 3 phases: 1 plan each (Phases 10, 11, 12)
- Trend: Stable

*Updated after each plan completion*
| Phase 13-current-service-level-indicators P01 | 25min | 3 tasks | 2 files |
| Phase 14-separate-digital-and-physical-collections P01 | 4min | 3 tasks | 5 files |
| Phase 16-unit-tests P01 | 3min | 2 tasks | 7 files |
| Phase 16-unit-tests P02 | 5min | 1 tasks | 1 files |
| Phase 17-migrate-to-calculator-helpers-and-more-easily-testable-code-structure P01 | 2min | 2 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Phase 12]: outline-offset-4 for focus rings — focus ring appears outside the selection ring; the amber current-level border must coexist with both unselected state and selected blue ring state
- [Phase 10/11]: has-[:checked] CSS-only selection state for cards — current-level indicator must work within this CSS-only pattern; no JS selection state to hook into
- isCurrentServiceLevel: true is already set on staffingLevels[2] and collections.options[2] in config.js — no data changes required for Phase 13
- [Phase 10]: sr-only on radio inputs inside cards — accessibility pattern to preserve for badge screen reader text
- [Phase 13-current-service-level-indicators]: data-current-level attribute bridges Nunjucks isCurrentServiceLevel flag to JS guard — no hardcoded values in JS (CURR-04)
- [Phase 13-current-service-level-indicators]: text-amber-600 used for slider tick (not amber-500) for WCAG AA contrast on white background
- [Phase 13-current-service-level-indicators]: ring-offset layering: blue selection ring (no offset) / amber current ring (offset-2) / focus outline (offset-4)
- [Phase 14-separate-digital-and-physical-collections]: Reused tau param for physical collections index; delta is new param for digital
- [Phase 14-separate-digital-and-physical-collections]: Verbose backward-compat URL branch removed — referenced data.collections which no longer exists
- [Phase 16-unit-tests]: Vitest downgraded from 4.x to 2.x for Node 18 compatibility (node:util styleText missing in Node 18)
- [Phase 16-unit-tests]: IIFEs in calculator.js and url.js left unchanged; pure helpers extracted as separate ESM modules in src/js/lib/
- [Phase 16-unit-tests]: Non-blocking CI workflow: site owner is a non-developer; tests visible in Actions tab without blocking push-to-deploy
- [Phase 17-migrate-to-calculator-helpers-and-more-easily-testable-code-structure]: ESM import in browser scripts closes duplication gap from Phase 16 — browser scripts now call same pure functions as unit tests

### Roadmap Evolution

- Phase 14 added: separate digital and physical collections
- Phase 15 added: Hours Update
- Phase 16 added: unit tests
- Phase 17 added: migrate to calculator helpers and more easily testable code structure.

### Pending Todos

None.

### Blockers/Concerns

- Actual household count and cost figures must be sourced from Cache County records before launch (content gap, not technical)
- Non-developer edit workflow must be explicitly tested with site owner via GitHub web UI before launch

## Session Continuity

Last session: 2026-03-30T00:15:32.354Z
Stopped at: Completed 17-01-PLAN.md
Resume file: None
