---
phase: 06-tech-debt-and-browser-verification
plan: 01
subsystem: build-config, templates, data
tags: [tech-debt, cleanup, config-driven, dead-code]
dependency_graph:
  requires: []
  provides: [config-driven-city-defaults, clean-build-config]
  affects: [src/_data/config.js, src/index.html]
tech_stack:
  added: []
  patterns:
    - defaultChecked flag pattern for config-driven boolean defaults in data file
key_files:
  created: []
  modified:
    - src/_data/config.js
    - src/index.html
  deleted:
    - postcss.config.mjs
decisions:
  - "City checkbox defaults moved to config.js defaultChecked flag — site owner can toggle without touching HTML"
  - "postcss.config.mjs deleted — build uses Tailwind CLI, not PostCSS pipeline"
  - "data-cost removed from collections select — calculator.js uses .value not .dataset.cost (already documented in Phase 3 decision)"
metrics:
  duration: "~2 minutes"
  completed: "2026-03-21"
  tasks_completed: 2
  files_changed: 3
---

# Phase 06 Plan 01: Tech Debt Cleanup Summary

**One-liner:** Deleted dead postcss.config.mjs, stripped stale data-cost from collections select, and made all city checkbox defaults config-driven via defaultChecked flags in config.js.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Remove dead postcss.config.mjs and strip data-cost from collections select | cd17f97 | postcss.config.mjs (deleted), src/index.html |
| 2 | Make city checkbox defaults config-driven via defaultChecked flag | 4f5a18c | src/_data/config.js, src/index.html |

## Verification Results

All plan success criteria met:

1. `pnpm run build` exits 0 — no template or config errors
2. `test ! -f postcss.config.mjs` — dead config removed
3. `grep -c 'data-cost' _site/index.html` returns 3 — only staffing radios have data-cost
4. 4 city objects in config.js each have `defaultChecked: true`
5. `grep 'city.defaultChecked' src/index.html` matches — template uses conditional not bare `checked`
6. Built HTML has all 4 city checkboxes with `checked=""` — behavior unchanged from before refactor

## Deviations from Plan

None — plan executed exactly as written.

Note: The plan's verification command `grep -c 'defaultChecked' src/_data/config.js | xargs -I{} test {} -eq 4` would return 6 (4 cities + 2 in the NON-DEVELOPER EDIT GUIDE comment block), not 4. The actual data objects are correct (4 cities each have the flag). This is a verification script quirk, not a code issue — the acceptance criteria spec ("exactly 4 occurrences of `defaultChecked: true` one per city") is satisfied by the 4 city data entries.

## Known Stubs

None introduced by this plan. Pre-existing placeholder household counts (PLACEHOLDER comments) and cost figures are unchanged and tracked separately.

## Self-Check: PASSED
