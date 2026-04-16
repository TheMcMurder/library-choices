---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
stopped_at: Completed 22-usage-and-other-analytics-tracking-22-02-PLAN.md
last_updated: "2026-04-16T09:16:31.256Z"
progress:
  total_phases: 1
  completed_phases: 1
  total_plans: 2
  completed_plans: 2
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-30)

**Core value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.
**Current focus:** Phase 22 — usage-and-other-analytics-tracking

## Current Position

Phase: 22 (usage-and-other-analytics-tracking) — EXECUTING
Plan: 2 of 2

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
| Phase 18-incorporate-feedback-from-library-notes P01 | 2min | 2 tasks | 2 files |
| Phase 19-fix-slider-issue-allow-for-non-linear-options P01 | 2min | 2 tasks | 5 files |
| Phase 20-update-hours-selection-with-new-data P01 | 1min | 2 tasks | 2 files |
| Phase 22 P01 | 4 | 2 tasks | 4 files |
| Phase 22-usage-and-other-analytics-tracking P02 | 6min | 2 tasks | 2 files |

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
- [Phase 18-incorporate-feedback-from-library-notes]: Digital slider expanded from 4 placeholder tiers to 5 real tiers; isDefault moved to $55k current-level tier
- [Phase 18-incorporate-feedback-from-library-notes]: Physical current-level marker moved from $10k to $15k — actual 2025 spend ~$12.5k; staffing annualCost remains PLACEHOLDER
- [Phase 19-fix-slider-issue-allow-for-non-linear-options]: Slider value domain switched from dollar amounts to 0-based indices (0 through N-1), eliminating phantom positions on non-linearly-spaced digital collections options
- [Phase 19-fix-slider-issue-allow-for-non-linear-options]: encodeIndices signature changed to accept digitalIdx/physicalIdx directly; removes findIndex value lookups; bounds check replaces them
- [Phase 20-update-hours-selection-with-new-data]: annualCost = wages only per D-02; no overhead (ILS, programs, supplies). Tier 2 Standard (44hr-pt) is current service level. IDs updated to 35hr-pt/44hr-pt/44hr-fte; compact pi param uses array index so compact URLs remain valid.
- [Phase 22]: Used @vitest-environment jsdom comment in analytics test file rather than global vitest config change — preserves node environment for all other test files
- [Phase 22]: GA4 snippet is privacy-minimized: storage none, no Google Signals, no ad personalization — hostname guard prevents initialization on localhost
- [Phase 22-usage-and-other-analytics-tracking]: Single delegated change listener in calculator.js dispatches both updateResult and analytics; no new event listeners added
- [Phase 22-usage-and-other-analytics-tracking]: City label resolved from window.LIBRARY_DATA.cities.find(), not DOM scraping
- [Phase 22-usage-and-other-analytics-tracking]: Analytics only on change events, never on input — prevents flooding during slider drag

### Roadmap Evolution

- Phase 14 added: separate digital and physical collections
- Phase 15 added: Hours Update
- Phase 16 added: unit tests
- Phase 17 added: migrate to calculator helpers and more easily testable code structure.
- Phase 18 added: incorporate feedback from library notes
- Phase 19 added: fix slider issue - allow for non linear options
- Phase 20 added: update hours selection with new data
- Phase 21 added: show-your-work-totals
- Phase 22 added: usage and other analytics tracking

### Pending Todos

None.

### Blockers/Concerns

- Actual household count and cost figures must be sourced from Cache County records before launch (content gap, not technical)
- Non-developer edit workflow must be explicitly tested with site owner via GitHub web UI before launch

## Session Continuity

Last session: 2026-04-16T09:16:31.254Z
Stopped at: Completed 22-usage-and-other-analytics-tracking-22-02-PLAN.md
Resume file: None
