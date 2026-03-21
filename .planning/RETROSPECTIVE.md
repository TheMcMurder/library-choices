# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-21
**Phases:** 6 | **Plans:** 10 | **Tasks:** 17

### What Was Built

- Eleventy v3 + Tailwind CSS v4 static site scaffold with pnpm build pipeline and GitHub Actions CI/CD
- Config-driven data schema — all costs, household counts, city names in `src/_data/config.js` with NON-DEVELOPER EDIT GUIDE
- Live tax calculator: three independent controls (staffing, collections, cities) updating per-household cost instantly
- WCAG 2.1 AA accessibility: aria-live result region, keyboard focus rings, 44px touch targets, screen reader compatible
- Civic-quality visual design: blue-800 header bar, sticky bottom result bar, mobile-first 375px+ layout
- URL shareability via URLSearchParams + history.replaceState with validation and graceful fallback
- All 14 deferred browser verification items confirmed PASS; 16/16 v1 requirements Complete

### What Worked

- **Data-driven from the start**: Phase 2's decision to drive all form controls from `config.js` paid forward through every phase — Phase 6's config-driven city defaults were trivially easy to add.
- **Phase decomposition was tight**: Each phase had a clear, verifiable goal. No phase needed to backtrack into a previous phase's work.
- **Browser verification as a dedicated phase**: Deferring all human testing to Phase 6 let earlier phases move fast. The checklist approach (14 items, all PASS) was efficient.
- **Audit-then-fix pattern**: Running the milestone audit before Phase 6 surfaced the CONF-02 ambiguity and browser verification debt precisely — Phase 6 closed all of it.

### What Was Inefficient

- **Placeholder data extends the launch timeline**: All cost/household values in `config.js` are still `// PLACEHOLDER`. This was known from day one but means the site isn't publicly launchable yet — awaiting real data from the product owner.
- **Phase 5 was a pure documentation fix**: Retroactively patching frontmatter (CONF-04, CONF-05, TRST-03) in Phase 5 could have been avoided with better traceability habits in Phase 3. The planner should enforce `requirements-completed` frontmatter at plan-creation time.
- **CONF-02 ambiguity lingered 4 phases**: The "toggle on/off" requirement was flagged as ambiguous in Phase 2 but not resolved until Phase 6. Earlier product-owner consultation would have saved audit overhead.

### Patterns Established

- **NON-DEVELOPER EDIT GUIDE in config.js**: Inline comment block explaining exactly what to edit, with examples. Should be standard on all non-developer-maintained data files.
- **`defaultChecked` flag pattern**: Config-driven boolean flags for UI defaults rather than hardcoded template attributes. Consistent with the `isDefault` pattern on collections options.
- **Browser verification checklist phase**: Batch all human_needed verification items into a dedicated late phase rather than blocking earlier phases on them.
- **Decision checkpoint in executor**: Using `checkpoint:decision` task type for product-owner decisions (CONF-02) keeps the decision and its documentation in the execution record.

### Key Lessons

1. **Resolve "toggle on/off"-style requirements before Phase 2 ends** — binary vs. multi-level ambiguity is cheap to clarify early and expensive to carry through an audit.
2. **Enforce `requirements-completed` frontmatter at write time** — the planner should flag missing traceability fields rather than fixing them in a gap-closure phase.
3. **Placeholder data is a launch blocker, not a tech blocker** — ship the code, but plan a v1.1 milestone gated on product owner delivering real numbers.

### Cost Observations

- Model mix: planner = Opus, researcher/checker/executor/verifier = Sonnet
- Sessions: single-day milestone (2026-03-20 to 2026-03-21)
- Notable: Sonnet handled all execution and verification without quality issues; Opus reserved for planning was appropriate for the complexity level

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 6 | 10 | First milestone — baseline established |

### Top Lessons (Verified Across Milestones)

1. Data-driven UI from day one reduces rework in later phases — don't hardcode values that need to change.
2. Batch human verification into a dedicated late phase rather than blocking execution phases.
