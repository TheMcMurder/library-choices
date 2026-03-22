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

## Milestone: v1.1 — UX — Citizen-Meaningful Controls

**Shipped:** 2026-03-22
**Phases:** 6 (7–12) | **Plans:** 7 | **Tasks:** 12

### What Was Built

- Collections budget range slider replacing the dropdown — 6 nodes with citizen-meaningful descriptions, live drag updates, aria-valuetext for screen readers, backward-compatible URL restoration
- Staffing section reframed as "Hours Open" with inline weekly schedule tables driven by structured config.js data; NON-DEVELOPER EDIT GUIDE extended with schedule editing section
- Compact pi/tau/phi URL param aliases (~72% shorter shared URLs) with full backward-compatible verbose decode fallback; edit guide warns about array reordering risk
- Staffing options and city options converted to full-width clickable card elements with CSS-only `has-[:checked]` selection state — no JavaScript added or modified
- Slider tick labels converted to `<button>` elements that snap the slider via bubbling event dispatch
- Keyboard focus ring refactored from `ring` to `outline-offset-4` so focus indicator appears visibly outside the selected-state blue ring

### What Worked

- **has-[:checked] CSS-only pattern**: Discovered in Phase 10 for staffing cards, immediately reused identically in Phase 11 for city cards — zero JavaScript added across both phases. CSS-only selection state is the right pattern for this kind of UI.
- **Event contract preservation discipline**: Each phase's success criteria explicitly required that url.js and calculator.js integration contracts be preserved unchanged. This prevented scope creep and kept phases truly independent.
- **Gap closure as a named phase type**: Phase 7-02 explicitly closed the SLDR-05/SLDR-08 input event gap found after Phase 7-01 shipped. Naming it a "gap closure" plan rather than an amendment kept the execution record clean.
- **Phase 12 was a one-file, one-commit fix**: Because the card pattern was already CSS-class-based and consistent across both card types, the focus ring fix was two-line substitutions in `src/index.html`. Small, scoped phases work.

### What Was Inefficient

- **ROADMAP.md milestone heading wasn't updated as phases 9–12 were added**: The milestone heading still showed "Phases 7–8 (in progress)" when phases 9–12 were added ad hoc. Phase additions should update the milestone heading immediately.
- **FOCUS-01 and FOCUS-02 weren't checked off after Phase 12 executed**: Minor documentation gap, but it required a pre-flight fix step during milestone completion. Executor should check off requirements in REQUIREMENTS.md as part of plan completion.
- **Progress table accumulated stale rows**: Phase 7 showed `1/2 — Gap closure` and Phase 8 showed `0/1 — Planned` well after both completed. Progress table maintenance should happen at phase transition, not milestone completion.

### Patterns Established

- **`has-[:checked]` CSS-only card pattern**: Label element wraps sr-only input; `has-[:checked]` drives ring + background; `has-[:focus-visible]` drives focus outline with `outline-offset-4`. Reusable for any card-style radio/checkbox group.
- **`outline-offset-4` over `ring` for focus on selection-ringed cards**: When an element already uses `ring-2` for selected state, use `outline` + `outline-offset-4` for focus so the two indicators are visually distinct.
- **Compact URL param aliases (pi/tau/phi) with positional index encoding**: Write compact, decode compact-first then verbose fallback. Array ordering is URL-immutable — warn in edit guide.
- **formatDays filter with noon-UTC reference date**: Prevents timezone drift in day name output across CI/CD environments.

### Key Lessons

1. **CSS-only state via `has-[:checked]` scales across card types** — once the pattern exists for one control (staffing), applying it to another (cities) is a template copy with zero JS changes.
2. **Requirements and progress table need maintenance at plan completion, not milestone completion** — defer maintenance and you create pre-flight fix debt.
3. **Scope additions (Phases 9–12) during a milestone work well when each phase is independent and small** — no phase needed to modify another phase's primary output files.

### Cost Observations

- Model mix: planner = Opus, researcher/executor/verifier = Sonnet
- Sessions: single-day milestone (2026-03-21 to 2026-03-22)
- Notable: Phases 10 and 11 reused the exact same CSS pattern — planner could have combined them; instead they were clean independent phases with no rework

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 6 | 10 | First milestone — baseline established |

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 6 | 10 | First milestone — baseline established |
| v1.1 | 6 | 7 | Ad hoc phase additions mid-milestone; CSS-only card pattern discovered |

### Top Lessons (Verified Across Milestones)

1. Data-driven UI from day one reduces rework in later phases — don't hardcode values that need to change.
2. Batch human verification into a dedicated late phase rather than blocking execution phases.
3. CSS-only state via `has-[:checked]` is the right pattern for card-style radio/checkbox groups — no JavaScript needed, keyboard/screen-reader accessible by default.
