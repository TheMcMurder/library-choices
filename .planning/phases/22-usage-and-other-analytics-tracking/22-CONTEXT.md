# Phase 22: usage and other analytics tracking - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Google Analytics 4 (GA4) to the static GitHub Pages site to understand how citizens engage with the configurator. Track both visit volume and specific configuration interactions (staffing, collections, cities, breakdown popover, shared URL arrivals). Analytics data will be shared with the Cache County city council to inform the public decision process.

This phase does NOT include: building a custom analytics dashboard, adding a cookie consent banner, or any backend infrastructure.

</domain>

<decisions>
## Implementation Decisions

### Analytics Provider
- **D-01:** Use Google Analytics 4 (GA4). No existing GA4 property exists — user will need to create a new GA4 property in the Google Analytics console to get a Measurement ID (format: `G-XXXXXXXXXX`).
- **D-02:** Use minimal data collection mode: disable ads personalization signals, set `storage: 'none'` in gtag config, configure GA4 for privacy-minimized operation. GA4 already anonymizes IPs by default (since 2022) — no extra IP config needed.

### Measurement ID Location
- **D-03:** Add `ga4MeasurementId` field to `src/_data/config.js`. Set to `null` initially (placeholder for user to fill in after creating the GA4 property).
- **D-04:** The Nunjucks template (`src/index.html`) conditionally includes the GA4 `<script>` snippet using `{% if config.ga4MeasurementId %}`. If the field is null or empty, no analytics script loads at all — clean on/off toggle without touching HTML.
- **D-05:** This follows the established config.js data-driven pattern — the site owner can update the Measurement ID via the GitHub web UI without touching templates.

### Production-Only Loading
- **D-06:** GA4 should only load on the production site (mcmurdie.github.io/library-choices). Skip on localhost or any non-production hostname. Implement via a hostname check in the Nunjucks template or an inline `<script>` guard: `if (location.hostname !== 'localhost')`.

### Custom Events to Track
- **D-07:** Track the following custom events (all fired via `gtag('event', ...)` calls):
  1. `staffing_selected` — fired on staffing radio change; include `{level_id, label}` as event parameters
  2. `digital_slider_changed` — fired on digital collections slider `change` (not `input`); include `{value_dollars}` as parameter
  3. `physical_slider_changed` — fired on physical collections slider `change` (not `input`); include `{value_dollars}` as parameter
  4. `city_toggled` — fired on city checkbox change; include `{city_id, city_label, checked: true/false}` as parameters
  5. `breakdown_opened` — fired when user clicks the info (?) button to open the formula popover; no additional parameters needed
  6. `shared_url_loaded` — fired on page load when `url.js` detects a shared URL (i.e., URL has the compact `pi`/`tau`/`phi` params or verbose params). Include `{params_detected: true}` as parameter.
- **D-08:** Slider events fire on the `change` event (final position after user releases). Do NOT fire on `input` (every pixel of drag) — that would generate excessive noise in GA4.

### Claude's Discretion
- Exact gtag initialization config object (beyond `storage: 'none'` and ads disabled) — Claude picks sensible GA4 v4 defaults
- Event parameter naming conventions (snake_case already chosen) — Claude normalizes
- Whether to create a dedicated `src/js/lib/analytics.js` helper module or add gtag calls inline in calculator.js and url.js — Claude decides based on what keeps the code clean
- Exactly how to detect production hostname (regex vs exact match) — Claude picks robust approach

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core files to modify
- `src/_data/config.js` — Add `ga4MeasurementId: null` field here; this is the data-driven config pattern
- `src/index.html` — GA4 snippet goes in `<head>` (conditional on `config.ga4MeasurementId`); also hosts the `window.LIBRARY_DATA` injection and the two `<script type="module">` tags at end of body
- `src/js/calculator.js` — Handles breakdown popover button click (`breakdown-toggle`); `breakdown_opened` event fires here
- `src/js/url.js` — Handles URL restoration on load; `shared_url_loaded` event fires here; also handles slider/city/staffing event listeners where custom events can be added

### Project conventions
- `src/js/lib/calculator-helpers.js` — Pure helper module pattern (reference for extracting analytics into its own helper if needed)
- `src/js/lib/url-helpers.js` — Pure helper module pattern (same)

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `window.LIBRARY_DATA` (injected in index.html): Full config object is already in the browser at page load; `ga4MeasurementId` from config.js will be available here too if needed in JS
- `calculator.js`: Already listens to `#breakdown-toggle` click for popover; `breakdown_opened` event can be added here in 1-2 lines
- `url.js`: Already detects and processes URL params on load; `shared_url_loaded` event hooks in naturally at the end of the URL restore block

### Established Patterns
- Config-driven feature flags: `config.draft` already gates the SAMPLE DATA watermark via `{% if config.draft %}` in index.html — same pattern for `{% if config.ga4MeasurementId %}`
- `change` vs `input` event distinction: `url.js` already uses `change` for URL encoding and `input` for live label updates — same discipline applies to analytics events
- ES module imports: Both `calculator.js` and `url.js` import from `src/js/lib/` — same pattern for an optional `analytics.js` helper

### Integration Points
- GA4 `<script>` tag goes in `<head>` of `src/index.html` (before `</head>`), gated by `{% if config.ga4MeasurementId %}`
- Custom event calls (`gtag('event', ...)`) wire into the existing event listener callbacks in `calculator.js` and `url.js`
- No new DOM elements needed; no changes to Nunjucks macros or Tailwind classes

</code_context>

<specifics>
## Specific Ideas

- The user will need to: (1) create a GA4 property at analytics.google.com, (2) get the Measurement ID (G-XXXXXXXXXX), (3) add it to `config.js` as `ga4MeasurementId`. Plans should include a clear comment in config.js explaining this step for the non-developer site owner.
- GA4 config with `storage: 'none'` means GA4 will not set cookies — this is the non-cookie mode that doesn't require consent banners for a civic/non-commercial site.
- The NON-DEVELOPER EDIT GUIDE pattern in config.js (from Phase 1) should be extended to cover `ga4MeasurementId` — explain what it is and where to get it.
- The user intends to share analytics insights with the Cache County city council as evidence of citizen engagement.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 22-usage-and-other-analytics-tracking*
*Context gathered: 2026-04-16*
