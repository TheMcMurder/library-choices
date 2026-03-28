# Requirements: Cache County Library Choices

**Defined:** 2026-03-21
**Core Value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.

## v1.2 Requirements

Requirements for the current service level indicator milestone.

### Current Service Indicators

- [x] **CURR-01**: Staffing card marked `isCurrentServiceLevel: true` displays an amber border that is visible in both selected and unselected states — the blue selection ring remains fully intact and coexists with the amber border
- [x] **CURR-02**: Staffing card marked `isCurrentServiceLevel: true` displays a small amber "Current level" badge in the top-right corner, visible in both selected and unselected states
- [x] **CURR-03**: Collections slider tick for the option marked `isCurrentServiceLevel: true` is styled amber and persists regardless of slider position — the tick's active/inactive visual state is otherwise unchanged
- [x] **CURR-04**: All indicators are template-driven from the `isCurrentServiceLevel` config flag — no option IDs or values hardcoded in templates
- [x] **CURR-05**: Screen reader text communicates "Current level" for the badge (color alone is not the only signal)

## v1.3 Requirements

Requirements for separating digital and physical collections.

### Separate Collections

- [x] **COLL-01**: `collections` config key replaced with `collectionsDigital` and `collectionsPhysical` top-level keys, each with independent tier options — old blended key removed entirely
- [x] **COLL-02**: Reusable Nunjucks macro (`collectionSlider`) renders both sliders from the same template with different parameters
- [x] **COLL-03**: Two stacked sliders inside the Collections Budget fieldset — digital on top, physical below, each with own description and source citation
- [x] **COLL-04**: Total tax = staffing cost + digital budget + physical budget (additive, no floor/ceiling)
- [x] **COLL-05**: URL encoding uses `tau` for physical collections index and `delta` for digital collections index — old tau values out of range for new physical tiers silently fall to default
- [x] **COLL-06**: Both sliders display Phase 13 amber current-level tick independently via `isCurrentServiceLevel` flag and `data-current-level` attribute
- [x] **COLL-07**: NON-DEVELOPER EDIT GUIDE in config.js updated to document both `collectionsDigital` and `collectionsPhysical` keys

## Future Requirements

- Scenario summary text — human-readable sentence describing the selected combination (ENH-01)
- Print stylesheet — printable version of the configured scenario (ENH-02)
- Real household counts and cost figures sourced from Cache County records
- Non-developer edit workflow tested with site owner via GitHub web UI

## Out of Scope

| Feature | Reason |
|---------|--------|
| City "current" indicators | All four cities currently participate — no city has `isCurrentServiceLevel`; not needed |
| Animated transition between indicator states | Motion disorder risk; instant update is more accessible |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CURR-01 | Phase 13 | Complete |
| CURR-02 | Phase 13 | Complete |
| CURR-03 | Phase 13 | Complete |
| CURR-04 | Phase 13 | Complete |
| CURR-05 | Phase 13 | Complete |
| COLL-01 | Phase 14 | Complete |
| COLL-02 | Phase 14 | Complete |
| COLL-03 | Phase 14 | Complete |
| COLL-04 | Phase 14 | Complete |
| COLL-05 | Phase 14 | Complete |
| COLL-06 | Phase 14 | Complete |
| COLL-07 | Phase 14 | Complete |

**Coverage:**
- v1.2 requirements: 5 total, 5 complete
- v1.3 requirements: 7 total, 0 complete
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-28 — Phase 14 requirements added*
