# Phase 2: Data and Controls - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Expand `src/_data/config.js` to the full schema (staffing levels, collections, cities) and replace the pipeline-verification `src/index.html` with Nunjucks for-loops that render all form controls from data. No JavaScript calculator logic — that is Phase 3. After Phase 2, a non-developer can update any cost figure or add a city by editing one file via GitHub's web UI.

</domain>

<decisions>
## Implementation Decisions

### Cost figures — placeholder values
All monetary values are placeholders with clear `// PLACEHOLDER` comments in `config.js`. Real figures will be supplied by the site owner and updated via GitHub's web UI. Rough ballpark proportions to use (adding up near the ~$250K/year total mentioned in PROJECT.md):

| Option | Annual cost |
|--------|-------------|
| 1 FTE | $150,000 |
| 1 FTE + 1 PTE | $190,000 |
| 1 FTE + 2 PTE | $230,000 |
| Collections budget | $30,000 |

These are clearly flagged in config.js as estimates. The user wants to evaluate real Cache County figures when available — see Deferred Ideas.

### Cost display in controls
Claude's discretion on exact formatting. Recommendation: show the annual cost inline in the staffing radio label (e.g., "1 FTE + 2 Part-Time — $230,000/year") so the cost comparison is immediate. Collections can keep cost in description text since it is a single toggle. Either approach must pull the value from `config.annualCost`, never hardcode in template.

### Cities list — 4 cities, all placeholders
Providence, Nibley, Millville, and River Heights are the 4 participating cities for this phase. No additional cities at this stage. More cities can be added later by editing only `config.js` (DATA-02 requirement). Household counts are placeholders with `// PLACEHOLDER` comments:

| City | Households (placeholder) |
|------|--------------------------|
| Providence | 2,100 |
| Nibley | 1,800 |
| Millville | 950 |
| River Heights | 620 |

### Source citation strings — plain text, no links
Phase 2 renders citations as plain `<cite>Source: [text]</cite>` elements — no hyperlinks. Placeholder citation strings:
- Staffing costs: `Cache County HR salary schedule FY2025`
- Household counts: `Cache County Assessor 2024`
- Collections budget: `Cache County Library Services budget proposal FY2025`

All marked as placeholders. Site owner updates these when real citations are confirmed. A linked citations/sources page (with archived fallbacks for link-rot protection) is a deferred idea for Phase 4.

### Claude's Discretion
- Exact Tailwind utility classes for control layout within the fieldsets (UI-SPEC provides the token scale and component inventory)
- Whether `htmlTemplateEngine: "njk"` config or `.html` extension is sufficient for Nunjucks for-loops (RESEARCH notes this needs a build test — resolve in Wave 0)
- Whether to add a `toLocaleString` Eleventy filter for comma-formatted numbers in template display
- Empty placeholder file `src/js/calculator.js` — creates the directory for Phase 3; content is a comment only

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract
- `.planning/phases/02-data-and-controls/02-UI-SPEC.md` — Complete visual and interaction contract: spacing scale, typography, color palette, component inventory with Tailwind classes, layout contract, copywriting contract (exact label/description strings), data attribute contract, accessibility baseline. LOCKED.

### Technical research
- `.planning/phases/02-data-and-controls/02-RESEARCH.md` — Data schema recommendations, Nunjucks for-loop patterns, `dump | safe` embedding pattern, pitfall list, validation architecture (grep-based checks after build).

### Project requirements
- `.planning/REQUIREMENTS.md` — DATA-01, DATA-02, DATA-03, CONF-01, CONF-02, CONF-03, TRST-01, TRST-02 are the Phase 2 requirements. TRST-03 (WCAG 2.1 AA, touch targets) is Phase 3 — do not implement touch target sizing in Phase 2.

### Project state and decisions
- `.planning/STATE.md` — Key decisions: ESM `export default` in config.js (type:module); integers for monetary values; `window.LIBRARY_DATA` embedding pattern confirmed.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/_data/config.js` — Currently stub (`{ siteName: "Cache County Library Choices" }`). Phase 2 expands this in place. ESM `export default` is confirmed working.
- `src/index.html` — Currently pipeline-verification placeholder. Phase 2 replaces body content entirely. Head (charset, viewport, CSS link) is preserved.
- `src/css/style.css` — Bare `@import "tailwindcss"`. No changes needed in Phase 2.
- `src/css/compiled.css` — Build artifact, gitignored. No changes needed.

### Established Patterns
- `{{ config.siteName }}` renders correctly in `src/index.html` — Eleventy processes `.html` files as Nunjucks. For-loops need a build test (open question from RESEARCH).
- ESM `export default` is required in all `_data/` files — `"type": "module"` in `package.json`.
- Integer storage for monetary values; format only at display time.
- `window.LIBRARY_DATA = {{ config | dump | safe }}` pattern confirmed safe for static data embedding.

### Integration Points
- `src/_data/config.js` → all Nunjucks templates via `config` variable (Eleventy data cascade auto-wires this)
- `window.LIBRARY_DATA` in the HTML `<head>` or end of `<body>` → Phase 3 calculator JS reads it
- `data-cost` and `data-households` attributes on inputs → Phase 3 DOM reads (MUST be present in Phase 2 template per RESEARCH pitfall #3)
- `src/js/` directory → needs to exist as Phase 3 will add `calculator.js` as a passthrough copy; create empty placeholder in Phase 2

</code_context>

<specifics>
## Specific Ideas

- Ballpark cost figures should sum to approximately $250K for the 1 FTE + 2 PTE + collections scenario — this is the real-world total mentioned in PROJECT.md, so placeholders should be in that neighborhood.
- Source citations are plain text only in Phase 2 — no `<a>` tags. The user wants a future citations landing page with archived fallbacks to protect against dead links (Phase 4 deferred idea).
- User is interested in finding real Cache County HR/Assessor figures from public sources before launch — worth noting in STATE.md so it is not forgotten.

</specifics>

<deferred>
## Deferred Ideas

- **Citations/sources landing page** — A dedicated `/sources` page listing all data sources with both primary and archived URLs (link-rot protection). User's instinct: intermediary summary page before raw source links. New page template — Phase 4 or its own phase.
- **Real Cache County cost and household figures** — Site owner wants to evaluate actual figures from Cache County HR and Assessor records before launch. Not blocking Phase 2 (placeholders with comments suffice), but should be surfaced as a pre-launch verification step. Worth checking Cache County public budget documents and Assessor data portal.

</deferred>

---

*Phase: 02-data-and-controls*
*Context gathered: 2026-03-20*
