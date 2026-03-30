---
phase: 09-compact-url-encoding-pi-tau-phi-easter-egg-param-aliases-with-positional-index-values
plan: 01
subsystem: ui
tags: [url-encoding, URLSearchParams, history-replaceState, vanilla-js]

# Dependency graph
requires:
  - phase: 07-collections-budget-slider
    provides: collections slider element (replaces select; url.js must read slider value)
  - phase: 08-hours-open-schedule-display
    provides: staffingLevels with schedule data (array shape unchanged for url.js)
provides:
  - Compact URL encoding using pi/tau/phi Greek letter param aliases with 0-based positional indices
  - Dual-format URL decoding: compact (pi/tau/phi) takes priority, verbose (staffing/collections/cities) as backward-compatible fallback
  - NON-DEVELOPER EDIT GUIDE warning about array ordering and compact URL fragility
affects: [phase-10-and-beyond, any-phase-touching-url-js, any-phase-touching-config-arrays]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Compact URL write-canonical with verbose read-fallback (dual-format decode pattern)
    - 0-based positional index encoding via Array.findIndex for encode, parseInt + bounds check for decode
    - useCompact branch guard: params.has('pi') || params.has('tau') || params.has('phi')

key-files:
  created: []
  modified:
    - src/js/url.js
    - src/_data/config.js

key-decisions:
  - "Compact params (pi/tau/phi) are the new write-canonical form — all new shared URLs use compact encoding"
  - "Verbose params (staffing/collections/cities) remain decodable for backward compatibility with pre-phase-9 links"
  - "Compact detection: if any of pi/tau/phi present, entire compact path used; verbose path skipped"
  - "0-based indices throughout — consistent with JS array conventions, no offset arithmetic needed"
  - "Out-of-bounds or NaN indices silently ignored — existing default selection preserved"

patterns-established:
  - "Dual-format URL decode: check for compact keys first, fall back to verbose only when none present"
  - "findIndex for encode (ID/value to index), parseInt + bounds check for decode (index to array item)"

requirements-completed: [URL-01, URL-02, URL-03, URL-04, URL-05]

# Metrics
duration: 1min
completed: 2026-03-21
---

# Phase 9 Plan 01: Compact URL Encoding Summary

**Compact pi/tau/phi Greek letter URL params replace verbose staffing/collections/cities strings, reducing shared URLs from ~70 to ~20 chars while retaining full backward-compatible verbose decode**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-21T22:54:48Z
- **Completed:** 2026-03-21T22:55:50Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Rewrote `encodeUrl()` to write compact pi/tau/phi params using 0-based array index lookup via findIndex
- Rewrote `restoreFromUrl()` with dual-format decode: compact path (pi/tau/phi) when any compact key present, verbose path (staffing/collections/cities) as backward-compatible fallback
- Added clear array ordering warning to the NON-DEVELOPER EDIT GUIDE in config.js, covering all three affected arrays

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite url.js with compact encoding and dual-format decoding** - `ead0244` (feat)
2. **Task 2: Add array ordering warning to NON-DEVELOPER EDIT GUIDE** - `557f7ef` (chore)

## Files Created/Modified
- `src/js/url.js` - Compact URL encode (pi/tau/phi indices) + dual-format decode with verbose fallback
- `src/_data/config.js` - NON-DEVELOPER EDIT GUIDE: compact URL array ordering warning

## Decisions Made
- Compact params are the new write-canonical form — all URLs generated after form interaction use pi/tau/phi
- Compact detection uses `params.has('pi') || params.has('tau') || params.has('phi')` — if any compact key present, the entire compact path runs (verbose skipped entirely)
- 0-based indices chosen for direct JS array access consistency
- Out-of-bounds and NaN indices silently fall back to defaults, consistent with existing behavior

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Compact URL encoding complete; all 5 URL requirements satisfied
- Site owner warned in config.js that array reordering breaks compact shared links
- Backward compatibility with all pre-phase-9 verbose URLs preserved
- Phase 9 is the final planned phase; project is feature-complete for v1.1 UX milestone pending staffing/hours display (already shipped in Phase 08) and real data from product owner

## Self-Check: PASSED

- src/js/url.js — FOUND
- src/_data/config.js — FOUND
- 09-01-SUMMARY.md — FOUND
- Commit ead0244 — FOUND
- Commit 557f7ef — FOUND

---
*Phase: 09-compact-url-encoding-pi-tau-phi-easter-egg-param-aliases-with-positional-index-values*
*Completed: 2026-03-21*
