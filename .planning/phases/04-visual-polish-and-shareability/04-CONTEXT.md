# Phase 4: Visual Polish and Shareability - Context

**Gathered:** 2026-03-20
**Status:** Partial — result placement captured; visual design, URL encoding, and citations still to discuss

<domain>
## Phase Boundary

Make the site look trustworthy and civic-appropriate on any device, and allow any configured scenario to be shared by copying the URL. This phase delivers two things: (1) production-quality visual design and mobile responsiveness, and (2) URL query-string encoding that restores selections when a link is opened.

</domain>

<decisions>
## Implementation Decisions

### Result placement
- Sticky footer bar pinned to bottom of viewport as user scrolls the form
- Bar shows: large dollar amount only — `$47.23/household/year`
- A heroicons `?` icon in the bar expands to show the breakdown line (`$187,000 total ÷ 3,940 households`) when tapped/clicked
- Expanded breakdown dismisses when the user taps anywhere outside it (click-outside pattern, no explicit close button)
- When zero cities are selected: bar stays visible but shows a short message instead of the dollar amount ("Select at least one city")
- The existing `#result` region in the page body can be removed or repurposed — the sticky bar is the primary result display

### Civic visual design
*Not yet discussed — revisit in next session*

### URL encoding / shareability
*Not yet discussed — revisit in next session*

### Citations landing page
*Not yet discussed — revisit in next session (deferred from Phase 2)*

### Claude's Discretion
- Exact Tailwind classes for sticky bar sizing, padding, shadow
- Heroicons implementation (SVG inline vs img tag)
- Animation/transition for expanding breakdown tooltip
- Breakpoint behavior of sticky bar on desktop vs mobile

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract (Phase 2)
- `.planning/phases/02-data-and-controls/02-UI-SPEC.md` — Spacing scale, typography, color palette, component inventory with Tailwind classes. Phase 4 visual decisions should extend this contract, not contradict it.

### Project requirements
- `.planning/REQUIREMENTS.md` — DESG-01, DESG-02, DESG-03, CONF-06 are the Phase 4 requirements. Key success criteria: (1) no horizontal scroll on 375px phone, (2) result visible above fold on mobile, (3) civic credibility aesthetic, (4) URL restores exact selections.

### Project state
- `.planning/STATE.md` — Stack: Eleventy v3 + Tailwind CSS v4 + vanilla JavaScript. No framework. `window.LIBRARY_DATA` pattern. IIFE + 'use strict' module pattern for JS.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.html` — Current template. Result lives in `#result` div at bottom of `<main>`. The sticky bar will likely replace or supplement this element.
- `src/js/calculator.js` — Updates `#result` innerHTML on every form change. Phase 4 needs to redirect result output to the sticky bar element instead (or in addition).
- `src/css/style.css` — Bare `@import "tailwindcss"`. Tailwind v4 — utility classes only, no config file.

### Established Patterns
- IIFE + `'use strict'` wrapping for all calculator JS modules
- `form.addEventListener('change', updateResult)` delegated event pattern — same pattern can extend to URL encoding
- Integer storage for monetary values, `toFixed(2)` only at display
- `text-3xl font-semibold text-blue-700` is the current result amount styling

### Integration Points
- Sticky bar needs a new DOM element (outside `<main>`, likely before `</body>`) so it can be `position: fixed`
- `calculator.js` `updateResult()` function will need to target the sticky bar element in addition to (or instead of) `#result`
- URL encoding JS reads `form` state on change → `history.replaceState` → also reads on page load to restore state

</code_context>

<specifics>
## Specific Ideas

- Heroicons for the `?` icon in the sticky bar (user's preference — established in discussion)
- Click-outside dismissal for the breakdown tooltip — standard mobile popover pattern, no extra close button

</specifics>

<deferred>
## Deferred Ideas

- **Citations/sources landing page** — `/sources` page with primary + archived URLs for all data sources. Carried forward from Phase 2 deferred ideas. Whether to include in Phase 4 or its own phase is still to be decided (not yet discussed in Phase 4 context session).

</deferred>

---

*Phase: 04-visual-polish-and-shareability*
*Context gathered: 2026-03-20*
