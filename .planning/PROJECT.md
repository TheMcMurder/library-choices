# Cache County Library Choices

## What This Is

An interactive, mobile-first static website that helps Cache County citizens understand the fiscal choices around keeping their county library open. Users configure their own scenario — staffing level, collections funding, and which cities participate — and instantly see the resulting property tax impact per household. The site is built as a static site with a separate data file so numbers can be updated without touching templates.

## Core Value

Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.

## Requirements

### Validated

- [x] Deploy to GitHub Pages — *Validated in Phase 1: scaffolding*
- [x] All dollar amounts and household counts live in a single data file (not in templates) — *Validated in Phase 2: data-and-controls*
- [x] Staffing level options: 1 FTE / 1 FTE + 1 PTE / 1 FTE + 2 PTE — *Validated in Phase 2: data-and-controls*
- [x] City participation: checkboxes for each city (Providence, Nibley, Millville, River Heights) — *Validated in Phase 2: data-and-controls*

### Active

- [ ] Mobile-first responsive design using Tailwind CSS
- [ ] Clean, simple design language appropriate for a civic information site

### Validated

- [x] Live configurator with three independent choice dimensions: staffing level, collections budget, participating cities — *Validated in Phase 3: calculator-and-accessibility*
- [x] Collections budget: dropdown $10k–$60k (current: $30k, minimum is a placeholder) — *Validated in Phase 3: calculator-and-accessibility*
- [x] Tax calculation: total annual cost ÷ total participating households = cost per household per year — *Validated in Phase 3: calculator-and-accessibility*
- [x] Single output number: one annual property tax cost per household regardless of which city they live in — *Validated in Phase 3: calculator-and-accessibility*

### Out of Scope

- Per-city cost breakdown — cost per household is the same for everyone in any participating city, so one number suffices
- Logan, Hyrum, and cities that have already built their own libraries — they are not participants
- Backend / server-side logic — fully static
- User accounts or saved scenarios

## Context

The Cache County Council is shutting down the county library program. Several cities — Providence, Nibley, Millville, River Heights, and potentially others — are exploring whether to fund a collaborative library district. The current operation costs ~$250K/year (1 FTE + 2 PTE, full hours, plus collections budget). Citizens need to understand: what combination of service level and city participation leads to what property tax cost?

The site owner (a city council member or civic tech advocate) needs to update numbers as discussions evolve — new cities join, cost estimates shift — without touching HTML or JavaScript logic.

## Constraints

- **Tech Stack**: Tailwind CSS required; static site generator approach (data file + templates)
- **Hosting**: GitHub Pages — must produce static HTML/CSS/JS output
- **Updatability**: All scenario data (costs, household counts, city names) must live in one editable data file
- **Simplicity**: No build complexity beyond what's necessary; easy for a non-developer to update the data file

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static site generator over plain HTML | Separates data from presentation; easier to maintain | — Pending |
| Tailwind CSS for styling | Owner's preference; good mobile-first utilities | — Pending |
| Single tax number (not per-city) | Cost per household is uniform across participating cities by household-count formula | — Pending |
| Data file for all numbers | Owner can update without touching templates | — Pending |

---
*Last updated: 2026-03-21 — Phase 5 complete: documentation traceability gaps closed (CONF-04, CONF-05, TRST-03 now tracked in REQUIREMENTS.md)*
