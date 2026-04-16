# Phase 22: usage and other analytics tracking - Research

**Researched:** 2026-04-16
**Domain:** Google Analytics 4 (GA4) — static site integration via gtag.js
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Use Google Analytics 4 (GA4). No existing GA4 property — user must create one in the Google Analytics console to get a Measurement ID (format: `G-XXXXXXXXXX`).
- **D-02:** Use minimal data collection mode: `storage: 'none'`, disable ads personalization signals (`allow_google_signals: false`, `allow_ad_personalization_signals: false`). GA4 anonymizes IPs by default since 2022 — no extra IP config needed.
- **D-03:** Add `ga4MeasurementId` field to `src/_data/config.js`, set to `null` initially.
- **D-04:** Nunjucks template (`src/index.html`) conditionally includes the GA4 `<script>` snippet using `{% if config.ga4MeasurementId %}`.
- **D-05:** Follows the established config.js data-driven pattern — site owner updates the Measurement ID via GitHub web UI.
- **D-06:** GA4 only loads on the production hostname (`mcmurdie.github.io/library-choices`). Skip on `localhost` or any non-production hostname. Implemented via hostname check inline in the snippet or Nunjucks template.
- **D-07:** Track six custom events via `gtag('event', ...)`:
  1. `staffing_selected` — on staffing radio `change`; params: `{level_id, label}`
  2. `digital_slider_changed` — on digital slider `change`; params: `{value_dollars}`
  3. `physical_slider_changed` — on physical slider `change`; params: `{value_dollars}`
  4. `city_toggled` — on city checkbox `change`; params: `{city_id, city_label, checked: true/false}`
  5. `breakdown_opened` — when breakdown-toggle button is clicked; no additional params
  6. `shared_url_loaded` — on page load when URL params are detected; params: `{params_detected: true}`
- **D-08:** Slider events fire on `change` (final position after release), NOT `input` (every pixel of drag).

### Claude's Discretion

- Exact gtag initialization config object (beyond `storage: 'none'` and ads disabled) — Claude picks sensible GA4 v4 defaults
- Event parameter naming conventions (snake_case already chosen) — Claude normalizes
- Whether to create a dedicated `src/js/lib/analytics.js` helper module or add gtag calls inline in calculator.js and url.js — Claude decides based on what keeps the code clean
- Exactly how to detect production hostname (regex vs exact match) — Claude picks robust approach

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Phase 22 adds Google Analytics 4 to the static GitHub Pages site to measure citizen engagement with the library cost configurator. The integration is purely additive — no existing functionality changes. The implementation involves three layers: (1) a conditional `<script>` block in the Nunjucks template's `<head>`, (2) a `ga4MeasurementId` field in `config.js` serving as the on/off toggle, and (3) six `gtag('event', ...)` calls wired into existing event listeners in `calculator.js` and `url.js`.

The privacy posture is cookieless: `storage: 'none'` prevents GA4 from setting any cookies, and disabling Google Signals and ad personalization ensures data is used only for aggregate usage analytics. This is appropriate for a non-commercial civic tool — no consent banner is required under GDPR/CCPA for this configuration.

The primary architectural decision is whether to extract analytics calls into a dedicated `src/js/lib/analytics.js` helper. Given that there are only six event calls spread across two files, and that `gtag` is a global function (no import required), the cleanest approach is a thin `analytics.js` module that exports named wrapper functions (`trackStaffingSelected`, `trackBreakdownOpened`, etc.). This keeps `calculator.js` and `url.js` from growing undirected `gtag` calls, makes the analytics surface area testable, and follows the established lib helper pattern.

**Primary recommendation:** Create `src/js/lib/analytics.js` with named wrapper functions; import into `calculator.js` and `url.js`. Use `window.LIBRARY_DATA.ga4MeasurementId` as the analytics-enabled guard inside each wrapper so event calls silently no-op when no Measurement ID is set.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gtag.js | loaded from `googletagmanager.com` (no version pinning) | GA4 event tracking | Google's official tag for GA4; no npm install required; loaded async from Google CDN |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Google Analytics 4 property | — (cloud service) | Collects and reports event data | Already decided; user creates in analytics.google.com |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GA4 via gtag.js | Plausible, Fathom, Umami | GA4 decided by user (D-01) — not reconsidered |
| Inline gtag calls | Dedicated analytics.js wrapper module | Wrapper keeps lib pattern consistent; easier to no-op when ID absent |

**Installation:**

No npm packages. gtag.js loads from Google CDN via the `<script>` tag in `index.html`. No build step changes.

---

## Architecture Patterns

### Recommended Project Structure

No new directories. Files modified or created:

```
src/
├── _data/config.js          # Add ga4MeasurementId field (D-03)
├── index.html               # Add GA4 snippet in <head>, production guard (D-04, D-06)
├── js/
│   ├── calculator.js        # Add analytics calls: breakdown_opened, staffing_selected, slider events
│   ├── url.js               # Add analytics call: shared_url_loaded
│   └── lib/
│       └── analytics.js     # NEW: named wrapper functions for each custom event
```

### Pattern 1: Conditional GA4 Snippet in Nunjucks

**What:** GA4 script loads only when `config.ga4MeasurementId` is truthy, with an inline hostname guard.

**When to use:** This is the only pattern for the snippet insertion.

**Example:**
```html
{% if config.ga4MeasurementId %}
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{ config.ga4MeasurementId }}"></script>
<script>
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{{ config.ga4MeasurementId }}', {
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false,
      'storage': 'none'
    });
  }
</script>
{% endif %}
```

Note: The double-guard (Nunjucks `{% if %}` + hostname check) means:
- When `ga4MeasurementId` is null, no script tag is emitted at all (clean HTML).
- When a Measurement ID is set but running on localhost, the GA4 object exists but config is gated — the hostname check in the inline script prevents any data from being sent.
- An alternative: skip the inline hostname check and rely solely on the Nunjucks `{% if %}` template conditional, but the decision (D-06) explicitly requires runtime hostname detection as a second layer.

### Pattern 2: analytics.js Wrapper Module

**What:** A thin ES module in `src/js/lib/` that exports one named function per custom event. Each function guards against absent `gtag` (when snippet didn't load) using an existence check.

**When to use:** Import into `calculator.js` and `url.js` for all `gtag('event', ...)` calls.

**Example:**
```javascript
// src/js/lib/analytics.js
// Source: established lib helper pattern from calculator-helpers.js and url-helpers.js

/**
 * Fire a GA4 custom event if gtag is loaded.
 * Silently no-ops when gtag is absent (localhost, no Measurement ID).
 */
function fireEvent(eventName, params) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params || {});
  }
}

export function trackStaffingSelected(levelId, label) {
  fireEvent('staffing_selected', { level_id: levelId, label: label });
}

export function trackDigitalSliderChanged(valueDollars) {
  fireEvent('digital_slider_changed', { value_dollars: valueDollars });
}

export function trackPhysicalSliderChanged(valueDollars) {
  fireEvent('physical_slider_changed', { value_dollars: valueDollars });
}

export function trackCityToggled(cityId, cityLabel, checked) {
  fireEvent('city_toggled', { city_id: cityId, city_label: cityLabel, checked: checked });
}

export function trackBreakdownOpened() {
  fireEvent('breakdown_opened', {});
}

export function trackSharedUrlLoaded() {
  fireEvent('shared_url_loaded', { params_detected: true });
}
```

### Pattern 3: Event Wiring in calculator.js

**What:** Import analytics functions and call them at the correct listener attachment points.

**When to use:** Three event types live here: staffing radio change, slider change (final), and breakdown toggle click.

**Example (illustrative — not final code):**
```javascript
// In calculator.js — import at top (alongside existing import)
import { trackStaffingSelected, trackDigitalSliderChanged, trackPhysicalSliderChanged, trackBreakdownOpened } from './lib/analytics.js';

// Existing delegated change listener — add analytics dispatch
form.addEventListener('change', function (e) {
  updateResult();
  // Analytics: staffing radio change
  if (e.target.matches('input[name="staffing"]')) {
    var level = window.LIBRARY_DATA.staffingLevels.find(l => l.id === e.target.value);
    if (level) trackStaffingSelected(e.target.value, level.label);
  }
  // Analytics: digital slider change (fires on change = release)
  if (e.target.id === 'collections-digital') {
    var idx = parseInt(e.target.value, 10);
    var opts = window.LIBRARY_DATA.collectionsDigital.options;
    if (opts[idx]) trackDigitalSliderChanged(opts[idx].value);
  }
  // Analytics: physical slider change
  if (e.target.id === 'collections-physical') {
    var idx = parseInt(e.target.value, 10);
    var opts = window.LIBRARY_DATA.collectionsPhysical.options;
    if (opts[idx]) trackPhysicalSliderChanged(opts[idx].value);
  }
});

// Existing breakdown toggle listener — add analytics call
toggleBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  var isHidden = breakdownDetail.hidden;
  breakdownDetail.hidden = !isHidden;
  toggleBtn.setAttribute('aria-label', isHidden ? 'Hide cost breakdown' : 'Show cost breakdown');
  if (isHidden) trackBreakdownOpened(); // fires on open only
});
```

### Pattern 4: Event Wiring in url.js

**What:** `shared_url_loaded` fires at the end of `restoreFromUrl()` when URL params are present.

**When to use:** Only when `params.toString()` is non-empty (params detected).

**Example:**
```javascript
// In url.js — import at top
import { trackSharedUrlLoaded } from './lib/analytics.js';

function restoreFromUrl() {
  var params = new URLSearchParams(location.search);
  if (!params.toString()) return;
  var indices = decodeIndices(data, params);
  applySelections(indices);
  trackSharedUrlLoaded(); // fires after successful restoration
}
```

### Pattern 5: City Toggle via Delegated Listener

**What:** `city_toggled` fires from the existing `form.addEventListener('change', ...)` in calculator.js, checking for city checkbox targets.

**Example:**
```javascript
// Add inside the 'change' listener in calculator.js
if (e.target.matches('input[name="cities"]')) {
  trackCityToggled(e.target.value, e.target.closest('label').querySelector('.text-base').textContent.trim(), e.target.checked);
}
```

Alternative: access `window.LIBRARY_DATA.cities.find(c => c.id === e.target.value).label` — more reliable than DOM text scraping.

### Anti-Patterns to Avoid

- **Inline gtag calls without a guard:** If `gtag` is not defined (localhost, no snippet), calling `window.gtag(...)` throws a ReferenceError. Always guard with `typeof window.gtag === 'function'`.
- **Firing on `input` for sliders:** Fires hundreds of times during drag. Confirmed: fire only on `change` (D-08). The existing `form.addEventListener('input', ...)` listener is for UI updates only — analytics must NOT be added there.
- **Using Nunjucks to inject the Measurement ID into JS files:** Only inject it into the `<script>` snippet in `<head>`. JS files access `window.LIBRARY_DATA.ga4MeasurementId` if they need it. However, the analytics.js wrapper doesn't need the ID — it calls `window.gtag` which already has the ID baked in from the init call.
- **Tracking before gtag('config') has run:** Custom events placed before the `gtag('config', ...)` call in the HTML may not be associated with the GA4 property. Per Google's documentation, custom event calls must appear after the config call.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sending hit data to an analytics endpoint | Custom fetch/XHR to analytics server | gtag.js loaded from Google CDN | GA4 handles batching, retry, session stitching, bot filtering, deduplication |
| Privacy-preserving tracking | Custom IP masking, custom cookie controls | `storage: 'none'` + `allow_google_signals: false` | GA4 has built-in IP anonymization (since 2022); `storage: none` is the official cookieless mode |
| A/B test or sampling | Custom random sampling gate | GA4 sampling is built-in at the property level | Not needed for this use case |

**Key insight:** All complexity lives in GA4's cloud infrastructure. The client-side code is shallow: load a script, call `gtag('event', ...)` at the right moments. Everything else (session tracking, sampling, reporting) happens server-side in GA4.

---

## Common Pitfalls

### Pitfall 1: gtag not defined when analytics.js fires

**What goes wrong:** `window.gtag` is undefined on localhost or when `ga4MeasurementId` is null — calling it throws `TypeError: window.gtag is not a function`.

**Why it happens:** The GA4 snippet is conditionally omitted from the HTML when `ga4MeasurementId` is null, so `window.gtag` is never assigned.

**How to avoid:** Wrap every `gtag(...)` call in `if (typeof window.gtag === 'function')`. The analytics.js wrapper's `fireEvent` function is the single place to do this — all exported functions call through `fireEvent`.

**Warning signs:** Console errors on localhost after wiring in analytics calls.

### Pitfall 2: Slider analytics firing on `input` instead of `change`

**What goes wrong:** Hundreds of events per slider interaction flood GA4 with noise, making data useless and potentially hitting GA4 rate limits.

**Why it happens:** The existing `form.addEventListener('input', ...)` fires on every pixel of drag. If analytics is hooked into `input` instead of `change`, it fires continuously.

**How to avoid:** Analytics calls go ONLY inside the `form.addEventListener('change', ...)` listener (or a new dedicated change listener). Never inside the `input` listener. The `change` event fires once when the user releases the slider.

**Warning signs:** GA4 Real-time report showing dozens of `digital_slider_changed` events per second.

### Pitfall 3: Tick button clicks triggering double-fire

**What goes wrong:** Clicking a tick button dispatches both `input` and `change` events programmatically (see `calculator.js` lines 137-138). This would fire analytics twice if the event handler doesn't deduplicate.

**Why it happens:** The tick button handler does `slider.dispatchEvent(new Event('input', ...))` then `slider.dispatchEvent(new Event('change', ...))` to trigger both the UI update and URL encode. Analytics hooked into `change` will fire exactly once — but only if the analytics guard is checking `e.target.id === 'collections-digital'` (not `e.target.matches('[data-slider]')`).

**How to avoid:** Wire analytics to `e.target.id` checks inside the `form.addEventListener('change', ...)` handler. The dispatched `change` event bubbles from the slider input itself (`e.target` = the range input), so the existing filter by ID is correct.

**Warning signs:** GA4 showing double `digital_slider_changed` events when clicking tick labels.

### Pitfall 4: City label extraction via DOM scraping

**What goes wrong:** `e.target.closest('label').querySelector('.text-base').textContent` is brittle — it depends on the Tailwind class structure of the city card.

**Why it happens:** City label text lives in the DOM but the event only provides `e.target.value` (the city ID).

**How to avoid:** Use `window.LIBRARY_DATA.cities.find(c => c.id === e.target.value)?.label` — the LIBRARY_DATA pattern is already established in calculator.js for accessing staffing and collections data.

### Pitfall 5: `shared_url_loaded` firing on normal page loads

**What goes wrong:** `trackSharedUrlLoaded` fires on every page load if not properly gated.

**Why it happens:** If the guard condition (`params.toString()`) is removed or incorrect, the call fires even when there are no URL params.

**How to avoid:** The guard is already present in `restoreFromUrl()`: `if (!params.toString()) return;`. `trackSharedUrlLoaded()` must be called INSIDE the function body after this early return, not before it.

---

## Code Examples

Verified patterns from official sources:

### Standard GA4 gtag.js Snippet (privacy-minimized)

```html
<!-- Source: Google Tag Platform developer docs (developers.google.com/tag-platform/security/guides/privacy) -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'allow_google_signals': false,
    'allow_ad_personalization_signals': false,
    'storage': 'none'
  });
</script>
```

Parameters confirmed:
- `allow_google_signals: false` — disables advertising features, demographics/interests reports (HIGH confidence, from Google developer docs)
- `allow_ad_personalization_signals: false` — prevents data from being used for ads personalization, sends `npa=1` parameter on beacons (HIGH confidence, from Google developer docs)
- `storage: 'none'` — prevents GA4 from setting or reading cookies; switches to cookieless pings (HIGH confidence, confirmed against Google Tag Platform privacy guide)
- IP anonymization — no config needed; GA4 has anonymized IPs by default since 2022 (HIGH confidence, per CONTEXT.md decision D-02)

### Sending a Custom Event

```javascript
// Source: developers.google.com/analytics/devguides/collection/ga4/events
gtag('event', 'staffing_selected', {
  level_id: '44hr-pt',
  label: 'Standard'
});
```

### Nunjucks Conditional for config.draft Reference (existing pattern)

```nunjucks
{# Existing pattern in src/index.html — exact analog for ga4MeasurementId guard #}
{% if config.draft %}
<div ...>SAMPLE DATA</div>
{% endif %}
```

The GA4 snippet uses `{% if config.ga4MeasurementId %}` — same pattern, same clean on/off toggle.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Universal Analytics (analytics.js) | Google Analytics 4 (gtag.js) | July 2023 — UA sunset | GA4 is the only supported Google Analytics product |
| UA IP anonymization (`anonymize_ip: true`) | GA4 anonymizes IPs by default | 2022 | No config needed |
| UA cookie control via `cookieName`, `cookieExpires` | GA4 `storage: 'none'` for cookieless mode | GA4 launch | Must explicitly set `storage: 'none'` to avoid cookies |

**Deprecated/outdated:**
- `analytics.js` and Universal Analytics: fully sunset July 2023. All new implementations use `gtag.js` with GA4 properties.
- `anonymize_ip: true` flag: irrelevant for GA4 (automatic).

---

## Open Questions

1. **Production hostname for D-06 guard**
   - What we know: The site is at `mcmurdie.github.io/library-choices`. `location.hostname` for this URL is `mcmurdie.github.io` (not `library-choices`).
   - What's unclear: Should the guard check only `!== 'localhost'` (any non-localhost = production) or check specifically for `mcmurdie.github.io`?
   - Recommendation: Use `location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'` — this is robust enough for a single-owner civic site. If the site were ever staged at a separate domain, the explicit allowlist approach would be safer, but YAGNI applies here.

2. **Whether analytics.js should be a lib helper or inline calls**
   - What we know: Decision D-discretion leaves this to Claude.
   - Recommendation: Create `src/js/lib/analytics.js` as a thin wrapper. This follows the established pattern (`calculator-helpers.js`, `url-helpers.js`) and makes the analytics surface area easy to review, mock in tests, and no-op when GA4 isn't loaded.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 2.x |
| Config file | No dedicated config file — Vitest picks up from `package.json` / default discovery |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANA-01 | GA4 snippet conditionally rendered when `ga4MeasurementId` set | manual / Eleventy build | Build and inspect `_site/index.html` | N/A — template change |
| ANA-02 | GA4 snippet absent when `ga4MeasurementId` is null | manual / Eleventy build | Build with null ID, grep `_site/index.html` for `gtag` | N/A — template change |
| ANA-03 | analytics.js wrapper no-ops when `window.gtag` absent | unit | `pnpm test -- --reporter verbose` | ❌ Wave 0 — new file |
| ANA-04 | analytics.js exports call gtag with correct event names/params | unit | `pnpm test -- --reporter verbose` | ❌ Wave 0 — new file |
| ANA-05 | hostname guard prevents GA4 init on localhost | manual | Load page on localhost, observe DevTools Network tab | N/A — manual only |
| ANA-06 | Custom events fire at correct interaction points | manual | GA4 Real-time / DebugView after deploying with Measurement ID | N/A — manual only |

Note: The core integration (snippet rendering, event wiring) is not unit-testable in Vitest because it requires a browser DOM with a live gtag script. Unit tests can cover the `analytics.js` module (the guard logic and function signatures) but not the full event pipeline. Manual verification via GA4 DebugView is the definitive validation path.

### Sampling Rate

- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `test/analytics.test.js` — covers ANA-03, ANA-04: unit tests for `analytics.js` wrapper (no-op guard, gtag call arguments)

---

## Sources

### Primary (HIGH confidence)

- Google Tag Platform privacy guide (developers.google.com/tag-platform/security/guides/privacy) — `allow_google_signals`, `allow_ad_personalization_signals`, `storage: 'none'` config parameters
- Google Analytics GA4 events reference (developers.google.com/analytics/devguides/collection/ga4/events) — `gtag('event', ...)` syntax, parameter structure, positioning requirement (after gtag config)
- Google Analytics config reference (developers.google.com/analytics/devguides/collection/ga4/reference/config) — `allow_google_signals` and `allow_ad_personalization_signals` confirmed
- Project CONTEXT.md — all decisions locked by user, canonical integration points, code context

### Secondary (MEDIUM confidence)

- WebSearch results confirming `storage: 'none'` as the cookieless mode parameter — cross-referenced with Tag Platform privacy guide
- WebSearch confirming GA4 default IP anonymization since 2022

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — gtag.js is Google's own tool; no third-party library concerns
- Architecture: HIGH — all integration points are pre-identified in CONTEXT.md with specific file/line-level guidance
- Pitfalls: HIGH — identified from direct code inspection of `calculator.js` (input vs change event, tick button double-dispatch) and standard GA4 best practices
- Validation: MEDIUM — unit test scope is limited; full validation requires live GA4 DebugView

**Research date:** 2026-04-16
**Valid until:** 2027-04-16 (GA4 gtag API is stable; no major changes expected)
