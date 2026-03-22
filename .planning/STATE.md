---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: UX — Citizen-Meaningful Controls
status: unknown
stopped_at: Phase 10 UI-SPEC approved
last_updated: "2026-03-22T00:18:34.997Z"
progress:
  total_phases: 4
  completed_phases: 3
  total_plans: 4
  completed_plans: 4
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-21)

**Core value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.
**Current focus:** Phase 09 — compact-url-encoding-pi-tau-phi-easter-egg-param-aliases-with-positional-index-values

## Current Position

Phase: 09
Plan: Not started

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
| Phase 07 P01 | 1 | 2 tasks | 5 files |
| Phase 07-collections-budget-slider P02 | 1min | 1 tasks | 1 files |
| Phase 08 P01 | 22min | 3 tasks | 3 files |
| Phase 09 P01 | 1min | 2 tasks | 2 files |

## Accumulated Context

### Roadmap Evolution

- Phase 9 added: Compact URL Encoding — pi/tau/phi easter egg param aliases with positional index values
- Phase 10 added: custom staffing selector UI and clickable slider interval nodes

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
- [Phase 07]: Tailwind v4 theme() CSS custom property syntax used for range slider colors — NOT v3 dot-notation
- [Phase 07]: Dual event listener pattern: change listener handles URL encoding, input listener handles live slider UI updates
- [Phase 07]: url.js validates collections param against LIBRARY_DATA.collections.options (not DOM select.options) — removes dependency on removed select element
- [Phase 07-collections-budget-slider]: url.js dispatches both change and input events after restoreFromUrl() — change for updateResult() hook, input for updateSliderLabels() UI sync
- [Phase 08]: formatDays filter uses 2024-01-01T12:00:00Z noon-UTC reference date and timeZone: UTC in Intl.DateTimeFormat to prevent CI/CD timezone drift in day name output
- [Phase 08]: Staffing labels renamed to Basic/Extended/Current by site owner post-checkpoint; schedule hours tuned; docs committed to track changes
- [Phase 09]: Compact params (pi/tau/phi) are write-canonical; verbose params (staffing/collections/cities) retained as backward-compatible decode fallback
- [Phase 09]: 0-based positional indices for pi/tau/phi — direct JS array access, no offset arithmetic
- [Phase 09]: Compact detection: params.has(pi) || params.has(tau) || params.has(phi) — compact path wins entirely if any compact key present

### v1.1 Research Flags

- [Phase 7]: Slider CSS approach — use `accent-color` as baseline or full vendor pseudo-element styling in `@layer base`; research recommends `accent-color` fast path with full styling as P2 option
- [Phase 7]: Slider live update requires `form.addEventListener('input', updateResult)` alongside existing `change` listener — one line, mobile critical
- [Phase 7]: url.js `restoreFromUrl()` validation must switch from `Array.from(select.options)` to `LIBRARY_DATA.collections.options.map(...)` — preserves `collections=30000` encoding unchanged
- [Phase 8]: Schedule time format must be decided before writing Nunjucks renderer and edit guide — research recommends 12-hour format (e.g. `9am`, `4pm`)
- [Phase 8]: Staffing `id` values (`"1fte"`, `"1fte-1pte"`, `"1fte-2pte"`) are URL-immutable — only `label` and `description` are citizen-facing copy; mark in config.js

### Pending Todos

None yet.

### Blockers/Concerns

- Actual household count and cost figures must be sourced from Cache County records before launch (content gap, not technical)
- Non-developer edit workflow must be explicitly tested with site owner via GitHub web UI before launch

## Session Continuity

Last session: 2026-03-22T00:18:34.995Z
Stopped at: Phase 10 UI-SPEC approved
Resume file: .planning/phases/10-custom-staffing-selector-ui-and-clickable-slider-interval-nodes/10-UI-SPEC.md
