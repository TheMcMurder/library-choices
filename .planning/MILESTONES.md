# Milestones

## v1.1 UX — Citizen-Meaningful Controls (Shipped: 2026-03-22)

**Phases completed:** 6 phases, 7 plans, 12 tasks

**Key accomplishments:**

- Native range slider replacing the collections dropdown, with 6 citizen-meaningful description nodes, live drag updates, and backward-compatible URL encoding via LIBRARY_DATA validation
- One-line input event dispatch after restoreFromUrl() closes SLDR-05/SLDR-08: slider description, dollar amount, and aria-valuetext now sync from shared URL on page load
- Staffing section reframed as "Hours Open" with inline semantic schedule tables driven by {days, open, close} config arrays and a locale-aware formatDays Nunjucks filter
- Compact pi/tau/phi Greek letter URL params replace verbose staffing/collections/cities strings, reducing shared URLs from ~70 to ~20 chars while retaining full backward-compatible verbose decode
- Staffing radio buttons converted to full-width clickable card labels with has-[:checked] CSS selection state; collections slider tick labels converted to button elements that snap the slider via bubbling event dispatch
- CSS-only city selection cards with name, household count, and source citation matching the Phase 10 staffing card design pattern

---

## v1.0 MVP (Shipped: 2026-03-21)

**Phases completed:** 6 phases, 10 plans, 17 tasks

**Key accomplishments:**

- Eleventy v3 ESM static site with Tailwind CSS v4 PostCSS pipeline producing pathPrefix-correct _site/ output from npm run build
- GitHub Actions two-job pnpm workflow that builds with Node 22, runs pnpm install + pnpm run build, uploads _site/ as a Pages artifact, and deploys to https://mcmurdie.github.io/library-choices/ on push to main — verified live with styled content and no 404 errors
- Full config.js data schema with 3 staffing levels, 4 cities, and collections — plus toLocaleString Nunjucks filter and calculator.js Phase 3 placeholder
- Complete Nunjucks form with 3 staffing radios, 1 collections budget dropdown ($10k-$60k, $30k default), and 4 city checkboxes — all rendered from config.js with data-cost/data-households attributes and window.LIBRARY_DATA for Phase 3
- One-liner:
- Civic-quality production layout with blue-800 header bar, sticky result bar replacing #result, footer with config-driven civic links, DRAFT watermark overlay, and mobile-first responsive corrections
- URL query-string shareability via URLSearchParams + history.replaceState, encoding all three form controls (staffing radio, collections select, city checkboxes) with validation against window.LIBRARY_DATA
- Retroactive traceability patch: added requirements-completed frontmatter to 03-01-SUMMARY.md and updated REQUIREMENTS.md to mark CONF-04, CONF-05, and TRST-03 as Complete in Phase 3.
- One-liner:
- All 14 browser verification items PASSED, CONF-02 product decision recorded (select-satisfies), and all 16 v1 requirements marked Complete.

---
