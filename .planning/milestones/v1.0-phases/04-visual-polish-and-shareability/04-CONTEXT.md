# Phase 4: Visual Polish and Shareability - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the site look trustworthy and civic-appropriate on any device, and allow any configured scenario to be shared by copying the URL. This phase delivers: (1) production-quality visual design and mobile responsiveness, (2) a sticky result bar prominently displaying the cost, (3) a DRAFT overlay for pre-launch use while numbers are placeholder, and (4) URL query-string encoding that restores selections when a link is opened.

</domain>

<decisions>
## Implementation Decisions

### Result placement
- Sticky footer bar pinned to bottom of viewport — visible at all times while user scrolls the form
- Bar shows: large dollar amount only — `$47.23/household/year`
- A heroicons `?` icon in the bar expands to show the breakdown line (`$187,000 total ÷ 3,940 households`) when tapped/clicked
- Expanded breakdown dismisses when the user taps/clicks anywhere outside it (click-outside pattern, no explicit close button)
- When zero cities are selected: bar stays visible but shows a short message ("Select at least one city") instead of the dollar amount
- The existing `#result` region in the page body can be removed or repurposed — the sticky bar is the primary result display

### Civic visual design
- **Color**: Keep and deepen existing blue — blue-700/blue-800 for the page header bar and sticky result bar (white text); gray-50/white fieldset backgrounds with gray-200 borders; blue-700 as the single accent color throughout
- **Page header**: Blue bar at the top with the site name and a one-line subtitle ("Explore library funding options" or similar). Sets civic context before the form. No hero image.
- **Typography**: System font stack (`system-ui, sans-serif`) — no web font download. Body text at base (16px), `font-semibold` for section headings and labels, `text-sm text-gray-500` for citations and secondary text.
- **Footer**: Minimal footer containing:
  - Attribution line (data sources, builder credit)
  - "Explore other options" / "Not happy with these choices?" section with links to external civic initiatives — e.g., a county-wide ballot initiative and/or Friends of the Library nonprofit. Actual URLs to be supplied by the site owner (can live in `config.js` or hardcoded in footer if stable).
  - Note: An `/about` page ("who built it and why") is deferred — see Deferred Ideas.

### DRAFT overlay
- While placeholder numbers are in use, a semi-transparent diagonal "DRAFT" stamp renders over the entire page — visually similar to a rubber-stamp watermark
- The overlay is click-through (`pointer-events: none`) so users can still interact with all form controls
- Controlled by a `draft: true` boolean field in `_data/config.js` — site owner toggles it off via GitHub web UI when numbers are finalized, no code changes required
- Style direction: large rotated text, partial opacity, positioned centered on the viewport (not repeating background tile)

### URL encoding / shareability
- Named, human-readable query params: `?staffing=fte-2-pte&collections=30000&cities=providence,nibley,millville`
- Uses existing `id` values from `config.js` data (no separate lookup table needed)
- URL updates via `history.replaceState` on every form change — no history entries created, browser back button takes user to the previous page they came from
- On page load: read query params and restore form selections before the first `updateResult()` call
- Invalid or stale param values are silently ignored with graceful fallback: unknown staffing ID → use first option; unknown city → skip; unknown collections value → use default. No error banner shown.

### Claude's Discretion
- Exact Tailwind classes for sticky bar height, padding, shadow, and z-index
- Heroicons implementation (SVG inline vs `<img>` tag vs CSS background)
- Animation/transition for expanding the breakdown tooltip (simple show/hide or brief fade)
- Whether the footer external links live in `config.js` (better for non-developer updates) or directly in the template (simpler if URLs are stable)
- How the DRAFT overlay text is sized and positioned for optimal visual weight across viewports

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract (Phase 2)
- `.planning/phases/02-data-and-controls/02-UI-SPEC.md` — Spacing scale, typography, color palette, and component inventory with Tailwind classes established in Phase 2. Phase 4 visual decisions extend this contract — check it before adding new color or spacing values.

### Project requirements
- `.planning/REQUIREMENTS.md` — DESG-01, DESG-02, DESG-03, CONF-06 are the Phase 4 requirements. Key success criteria: (1) no horizontal scroll on 375px phone, (2) result visible above fold on mobile, (3) civic credibility aesthetic, (4) URL restores exact selections.

### Project state and stack
- `.planning/STATE.md` — Stack: Eleventy v3 + Tailwind CSS v4 + vanilla JavaScript (no framework). `window.LIBRARY_DATA` embedding pattern. IIFE + `'use strict'` module pattern for JS files.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.html` — Current Nunjucks template. Result lives in `#result` div at bottom of `<main>`. Sticky bar will be a new fixed element added outside or at the bottom of `<main>`. `#result` can be removed.
- `src/js/calculator.js` — IIFE containing `updateResult()` which targets `#result`. Phase 4 needs a new JS file (or extended calculator) to: (a) update sticky bar instead, (b) read/write URL params via `replaceState`.
- `src/css/style.css` — Bare `@import "tailwindcss"`. Tailwind v4 — utility classes only, no config file needed.
- `src/_data/config.js` — ESM `export default`. Phase 4 adds a `draft` boolean field and potentially footer link URLs.

### Established Patterns
- IIFE + `'use strict'` wrapping for all JS modules — new `url.js` or `share.js` should follow this
- `form.addEventListener('change', handler)` delegated event — same pattern for URL encoding listener
- Integer storage for monetary values, `toFixed(2)` only at display
- `window.LIBRARY_DATA` is the runtime data source — URL encoding should use `id` values from this object for param validation

### Integration Points
- Sticky bar: new `<div id="result-bar">` element fixed to bottom of viewport, outside `<main>`, before `</body>`
- `calculator.js` targets `#result-bar` (or equivalent) instead of `#result`
- URL params JS: separate IIFE that runs on `DOMContentLoaded` to restore state, then listens to `form` change to call `replaceState`
- `config.js` gets `draft: true/false` field — Nunjucks template conditionally renders the DRAFT overlay based on this value

</code_context>

<specifics>
## Specific Ideas

- "DRAFT" overlay should feel like a classic rubber stamp — large rotated text, partial opacity — not a banner or modal. User specifically referenced the accepted/rejected stamp aesthetic.
- "Hate these options" / "Not happy with these choices?" footer section — links to a county ballot initiative and Friends of the Library nonprofit. Tone should be constructive and empowering, not dismissive. Actual URLs to be provided by site owner.
- Heroicons for the `?` icon in the sticky bar
- Click-outside dismissal for the breakdown tooltip (standard mobile popover pattern, no close button)
- Phase 5 design iteration planned — Phase 4 achieves functional production-readiness; Phase 5 refines visual design based on stakeholder feedback.

</specifics>

<deferred>
## Deferred Ideas

- **Phase 5: Design iteration** — User has visual design ideas to explore after seeing Phase 4 in action with real stakeholder feedback. New phase to be added after Phase 4 completes.
- **`/about` page** — "Who built this and why" page. New page template and content. Not Phase 4 — Phase 5 or later.
- **`/sources` citations landing page** — Dedicated page listing all data sources with primary and archived (Wayback Machine) URLs for link-rot protection. Carried forward from Phase 2 deferred ideas. Phase 5 or later.

</deferred>

---

*Phase: 04-visual-polish-and-shareability*
*Context gathered: 2026-03-20*
