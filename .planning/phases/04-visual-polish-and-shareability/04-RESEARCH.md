# Phase 4: Visual Polish and Shareability - Research

**Researched:** 2026-03-20
**Domain:** Vanilla JS URL API, Tailwind CSS v4 fixed positioning, civic visual design, DRAFT overlay
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Result placement:**
- Sticky footer bar pinned to bottom of viewport — visible at all times while user scrolls the form
- Bar shows: large dollar amount only — `$47.23/household/year`
- A heroicons `?` icon in the bar expands to show the breakdown line (`$187,000 total ÷ 3,940 households`) when tapped/clicked
- Expanded breakdown dismisses when the user taps/clicks anywhere outside it (click-outside pattern, no explicit close button)
- When zero cities are selected: bar stays visible but shows a short message ("Select at least one city") instead of the dollar amount
- The existing `#result` region in the page body can be removed or repurposed — the sticky bar is the primary result display

**Civic visual design:**
- Color: Keep and deepen existing blue — blue-700/blue-800 for the page header bar and sticky result bar (white text); gray-50/white fieldset backgrounds with gray-200 borders; blue-700 as the single accent color throughout
- Page header: Blue bar at the top with the site name and a one-line subtitle ("Explore library funding options" or similar). Sets civic context before the form. No hero image.
- Typography: System font stack (`system-ui, sans-serif`) — no web font download. Body text at base (16px), `font-semibold` for section headings and labels, `text-sm text-gray-500` for citations and secondary text.
- Footer: Minimal footer containing attribution line, "Explore other options" section with links to external civic initiatives, and a note that URLs live in `config.js` or hardcoded if stable.

**DRAFT overlay:**
- Semi-transparent diagonal "DRAFT" stamp renders over the entire page — click-through (`pointer-events: none`), centered on viewport
- Controlled by a `draft: true` boolean field in `_data/config.js`
- Style: large rotated text, partial opacity, single centered instance (not repeating)

**URL encoding / shareability:**
- Named, human-readable query params: `?staffing=fte-2-pte&collections=30000&cities=providence,nibley,millville`
- Uses existing `id` values from `config.js`
- URL updates via `history.replaceState` on every form change — no history entries created
- On page load: read query params and restore form selections before first `updateResult()` call
- Invalid/stale param values silently ignored — unknown staffing ID → use first option; unknown city → skip; unknown collections value → use default. No error banner.

### Claude's Discretion
- Exact Tailwind classes for sticky bar height, padding, shadow, and z-index
- Heroicons implementation (SVG inline vs `<img>` tag vs CSS background)
- Animation/transition for expanding the breakdown tooltip (simple show/hide or brief fade)
- Whether the footer external links live in `config.js` (better for non-developer updates) or directly in the template (simpler if URLs are stable)
- How the DRAFT overlay text is sized and positioned for optimal visual weight across viewports

### Deferred Ideas (OUT OF SCOPE)
- Phase 5: Design iteration — visual design ideas to explore after seeing Phase 4 with real stakeholder feedback
- `/about` page — "Who built this and why"
- `/sources` citations landing page — dedicated page listing all data sources with primary and archived URLs
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DESG-01 | Polished, trustworthy visual design appropriate for civic engagement (not a prototype aesthetic) | Phase 2 UI-SPEC color/typography contract extended with blue-700/800 header + footer bars; `config.js` footer links pattern |
| DESG-02 | Mobile-first responsive layout — full functionality on a phone without zooming | Fixed bar with `pb-[4rem]` body padding; `max-w-2xl` + `px-4 sm:px-8` guards 375px; safe-area-inset-bottom for notched devices |
| DESG-03 | Clean, simple design language using Tailwind CSS v4 | Existing style.css `@import "tailwindcss"` pattern extended; no config file needed; utility-only approach confirmed |
| CONF-06 | Shareable URL — current selections encoded in query string so scenarios can be linked | `URLSearchParams` + `history.replaceState` pattern; `window.LIBRARY_DATA` for validation; IIFE module pattern for `url.js` |
</phase_requirements>

---

## Summary

Phase 4 adds three independent layers on top of the working Phase 3 calculator: a civic visual shell (header bar + footer), a sticky result bar replacing the current `#result` div, and URL query-string encoding for shareability. A DRAFT overlay controlled by a single config boolean is the fourth deliverable.

The stack is already settled (Eleventy v3 + Tailwind v4 + vanilla JS, no framework). All Phase 4 work is template + CSS + vanilla JS changes — no new build tooling or npm packages are strictly required. The one discretionary addition is heroicons, used for the `?` icon in the sticky bar; the recommended approach is copying the SVG inline from heroicons.com (no package install needed).

The dominant technical risks are (1) the sticky result bar overlapping form content on short mobile viewports, solved by adding `padding-bottom` equal to the bar height on `<body>` or `<main>`, and (2) URL param encoding/decoding edge cases (stale IDs, comma-delimited city values), mitigated by the graceful-fallback strategy already decided in CONTEXT.md.

**Primary recommendation:** Implement the four deliverables as three separate files — `header/footer` changes in `index.html`, a new `src/js/url.js` IIFE for URL encoding, and targeted edits to `calculator.js` to redirect output to `#result-bar` — keeping concerns separated and individually testable.

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS v4 | 4.2.2 (installed) | Utility classes for all visual styling | Already the project standard; no config file; `@import "tailwindcss"` is sufficient |
| Eleventy v3 | 3.1.5 (installed) | Static site generation; Nunjucks templates | Already the project standard |
| Vanilla JS (browser) | ES2018+ | `URLSearchParams`, `history.replaceState`, DOM events | No framework needed; all required APIs have universal browser support |

### Supporting (no install required)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Heroicons v2 SVG | 2.2.0 (npm; use inline SVG instead) | Single `?` icon in sticky bar | Copy SVG markup from heroicons.com — no package install needed for one icon |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline SVG for heroicons | `npm install heroicons` + file reference | Installing a package for a single icon adds dependency weight with no build-step benefit in this stack |
| `URLSearchParams` API | Manual `location.search` string parsing | URLSearchParams has 100% support in target browsers (Chrome, Firefox, Safari, Edge since 2018); no reason to hand-parse |
| `history.replaceState` | `history.pushState` | `pushState` would create a history entry per form change, flooding the back stack; `replaceState` is correct for this use case |
| Native Popover API for breakdown tooltip | `document.addEventListener('click', outside)` pattern | Native Popover API has "light dismiss" built in (no JS), but `popover="auto"` is less flexible to position absolutely within the sticky bar; the classic click-outside pattern is simpler here and still correct |

**Installation:** No new packages needed. All required capabilities exist in the installed stack.

---

## Architecture Patterns

### Recommended File Changes
```
src/
├── index.html              # Add: page header bar, sticky result bar, footer, DRAFT overlay conditional
├── css/style.css           # Possibly: @layer utilities for DRAFT overlay if needed (likely pure Tailwind suffices)
├── js/calculator.js        # Edit: retarget from #result → #result-bar; expose updateResult for url.js
├── js/url.js               # New: IIFE for URL encoding (read params on load, replaceState on change)
└── _data/config.js         # Edit: add draft boolean field; optionally add footer link URLs
```

### Pattern 1: Sticky Result Bar (Fixed Positioning)

**What:** A `<div id="result-bar">` with `position: fixed; bottom: 0; left: 0; right: 0` pinned to the bottom of the viewport at all times.

**When to use:** Any result that must remain visible while the user scrolls a form above it.

**Critical mobile detail:** The bar overlaps the bottom of `<main>` unless `<body>` or `<main>` has `padding-bottom` equal to (or greater than) the bar's height. Set this on `<main>` rather than `<body>` so it participates in the centered max-width layout cleanly.

**Safe area insets (notched phones):** If `viewport-fit=cover` is added to the meta viewport tag, the bar must include `padding-bottom: env(safe-area-inset-bottom, 0px)` to avoid being hidden behind the iPhone home indicator. Since `viewport-fit=cover` is not currently in the template, this is optional — add it only if the site owner wants edge-to-edge color on iOS.

**Example (Tailwind v4 classes, Claude's discretion):**
```html
<!-- Source: Tailwind CSS docs — https://tailwindcss.com/docs/position -->
<div
  id="result-bar"
  class="fixed bottom-0 left-0 right-0 z-50 bg-blue-800 text-white
         flex items-center justify-between px-4 py-3 shadow-lg"
  aria-live="polite"
  aria-atomic="true"
>
  <span id="result-amount" class="text-2xl font-semibold">$47.23/household/year</span>
  <button id="breakdown-toggle" aria-label="Show cost breakdown" class="p-2">
    <!-- heroicons question-mark-circle inline SVG here -->
  </button>
  <div id="breakdown-detail" hidden class="absolute bottom-full left-0 right-0 bg-blue-900 text-sm px-4 py-2">
    $187,000 total ÷ 3,940 households
  </div>
</div>
```

### Pattern 2: Click-Outside Dismissal

**What:** A `document.addEventListener('click')` handler that checks if the click target is outside the breakdown detail element and the toggle button; if so, hides the detail.

**When to use:** Any inline popover that should dismiss on outside click with no explicit close button.

**Example:**
```javascript
// Source: MDN — https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
document.addEventListener('click', function (e) {
  if (!breakdownDetail.contains(e.target) && e.target !== toggleBtn) {
    breakdownDetail.hidden = true;
  }
});
```

**Note on native Popover API:** The native `popover="auto"` attribute provides built-in light-dismiss, but positioning a popover absolutely within a fixed bar is more complex than the classic pattern above. Use the classic `document.addEventListener` approach for this narrow use case.

### Pattern 3: URL Encoding — `url.js` IIFE

**What:** A standalone IIFE that (a) reads `URLSearchParams` on `DOMContentLoaded` to restore form state, then (b) listens to `form.change` to call `history.replaceState` with updated params.

**When to use:** Any form whose state should be persistable via URL without reloading the page.

**Separation:** `url.js` is a separate file from `calculator.js`. `url.js` fires `updateResult()` after restoring state; `calculator.js` must therefore expose `updateResult` to `window` (or both scripts share a single `updateResult` call via a custom event or `DOMContentLoaded` ordering).

**Simplest wiring:** Have `url.js` load after `calculator.js` in the template. `url.js` restores state, then calls `updateResult()` which it accesses via a shared module pattern. Since both are IIFEs, the cleanest approach is to have `calculator.js` not auto-invoke `updateResult()` at the bottom, and instead have `url.js` call it after restoration. OR: keep `calculator.js` auto-invoking, and let `url.js` re-invoke after setting the restored form values — the double-call is harmless.

**Recommended approach (simplest, no interface changes to calculator.js):**
1. `calculator.js` auto-calls `updateResult()` on load as it does now.
2. `url.js` runs on `DOMContentLoaded`, restores form values, then calls the delegated `form.dispatchEvent(new Event('change'))` to trigger recalculation.
3. `url.js` also attaches a second `form.addEventListener('change', encodeUrl)` delegated listener.

**Example:**
```javascript
// Source: MDN — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// Source: MDN — https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
(function () {
  'use strict';

  var data = window.LIBRARY_DATA;

  function encodeUrl() {
    var params = new URLSearchParams();
    var staffing = document.querySelector('input[name="staffing"]:checked');
    if (staffing) params.set('staffing', staffing.value);
    var collections = document.getElementById('collections');
    if (collections) params.set('collections', collections.value);
    var cities = Array.from(document.querySelectorAll('input[name="cities"]:checked'))
      .map(function (cb) { return cb.value; });
    if (cities.length) params.set('cities', cities.join(','));
    history.replaceState(null, '', '?' + params.toString());
  }

  function restoreFromUrl() {
    var params = new URLSearchParams(location.search);

    // Restore staffing
    var staffingIds = data.staffingLevels.map(function (l) { return l.id; });
    var staffingParam = params.get('staffing');
    if (staffingParam && staffingIds.indexOf(staffingParam) !== -1) {
      var radio = document.querySelector('input[name="staffing"][value="' + staffingParam + '"]');
      if (radio) {
        document.querySelectorAll('input[name="staffing"]').forEach(function (r) { r.checked = false; });
        radio.checked = true;
      }
    }

    // Restore collections
    var collectionsParam = params.get('collections');
    var select = document.getElementById('collections');
    if (collectionsParam && select) {
      var validValues = Array.from(select.options).map(function (o) { return o.value; });
      if (validValues.indexOf(collectionsParam) !== -1) {
        select.value = collectionsParam;
      }
    }

    // Restore cities
    var citiesParam = params.get('cities');
    if (citiesParam) {
      var cityIds = citiesParam.split(',');
      var validCityIds = data.cities.map(function (c) { return c.id; });
      document.querySelectorAll('input[name="cities"]').forEach(function (cb) {
        cb.checked = cityIds.indexOf(cb.value) !== -1 && validCityIds.indexOf(cb.value) !== -1;
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    restoreFromUrl();
    // Trigger recalculation after restoration
    var form = document.getElementById('configurator');
    form.dispatchEvent(new Event('change'));
    // Encode initial state into URL if no params present
    if (!location.search) encodeUrl();
    form.addEventListener('change', encodeUrl);
  });
}());
```

### Pattern 4: DRAFT Overlay

**What:** A fixed, full-viewport `<div>` with large rotated "DRAFT" text, rendered only when `config.draft === true` in `_data/config.js`.

**When to use:** Pre-launch, while placeholder numbers are in use.

**Nunjucks conditional (in `index.html`):**
```html
<!-- Source: Nunjucks docs — https://mozilla.github.io/nunjucks/templating.html -->
{% if config.draft %}
<div
  class="fixed inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden"
  aria-hidden="true"
>
  <span
    class="text-[12vw] font-black text-red-600 opacity-15 rotate-[-30deg] select-none tracking-widest uppercase"
  >DRAFT</span>
</div>
{% endif %}
```

**Key CSS properties:**
- `pointer-events: none` — users can still interact with form controls beneath it
- `z-index` lower than the sticky result bar (`z-40` vs `z-50`) — bar remains accessible
- `opacity-15` (15% opacity) — visible as a stamp, not blocking
- `rotate-[-30deg]` — classic diagonal rubber-stamp angle
- `text-[12vw]` — viewport-relative sizing so it scales on mobile and desktop alike

### Pattern 5: Page Header Bar

**What:** A full-width blue header bar containing the site name and a subtitle, replacing the current bare `<h1>` inside `<main>`.

**Example:**
```html
<header class="bg-blue-800 text-white px-4 py-4 sm:px-8">
  <h1 class="text-xl font-semibold">Cache County Library Service Choices</h1>
  <p class="text-sm text-blue-200 mt-0.5">Explore library funding options for our community</p>
</header>
<main class="max-w-2xl mx-auto px-4 sm:px-8 py-8 pb-24">
  <!-- form content -->
</main>
```

**Note:** `px-8` on `<main>` may cause horizontal overflow at 375px if the viewport is narrow. Changing to `px-4 sm:px-8` guards against this. Current template uses `px-8` — this should be corrected in Phase 4 as part of DESG-02.

### Anti-Patterns to Avoid

- **Using `pushState` instead of `replaceState`:** Creates a new browser history entry per form interaction — the back button fills with duplicate states. Use `replaceState` always for this UI pattern.
- **Attaching multiple `change` listeners without deduplication:** `calculator.js` already has a `form.addEventListener('change', updateResult)`. `url.js` adds a second `form.addEventListener('change', encodeUrl)`. This is fine — two delegated listeners on the same element, each doing its own job. Do NOT merge them into one file unless necessary.
- **Using `location.href` assignment for URL updates:** Causes a full page reload. Always use `history.replaceState`.
- **Setting `z-index` on DRAFT overlay higher than sticky bar:** Bar must be accessible; DRAFT overlay must be click-through. Keep overlay at `z-40`, bar at `z-50`.
- **Not adding padding-bottom to main/body:** Fixed bar overlaps bottom form content on short mobile screens. `pb-24` on `<main>` (approximately 96px) provides safe clearance for a 64px bar plus breathing room.
- **Using `px-8` on `<main>` without a mobile breakpoint guard:** At 375px viewport width, `px-8` = 64px total horizontal padding, leaving only 311px for content. Switching to `px-4 sm:px-8` (16px padding on mobile) is the correct mobile-first approach.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Query string parsing | Custom regex or string split on `location.search` | `URLSearchParams` (browser native) | Handles encoding, edge cases, multi-value params; universally supported |
| Icon rendering | CSS border hacks, Unicode glyphs as fake icons | Heroicons inline SVG (copy from heroicons.com) | Crisp at all sizes, accessible with `aria-label`, no external dependency |
| Popover positioning | Fixed `top`/`left` pixel values | `absolute` positioning within the `relative` parent bar | Relative positioning respects the bar's actual rendered position across breakpoints |

**Key insight:** In a vanilla JS + Tailwind project without a bundler, zero-cost browser APIs (`URLSearchParams`, `history.replaceState`) are the right tools. Every custom implementation adds surface area for bugs that the browser handles correctly by spec.

---

## Common Pitfalls

### Pitfall 1: Fixed Bar Obscures Bottom Form Content on Mobile

**What goes wrong:** The sticky result bar (fixed, bottom-0) overlays the last fieldset (Cities) so the bottom checkboxes are permanently hidden behind the bar.

**Why it happens:** `position: fixed` removes the element from document flow — nothing pushes content above it.

**How to avoid:** Add `padding-bottom` to `<main>` equal to or greater than the bar height. `pb-24` (96px) is safe for a bar that is approximately 56–64px tall. This must be applied to `<main>` not `<body>` because `<main>` is the scrolling content container.

**Warning signs:** Lowest city checkbox is clipped or cannot be tapped on iPhone.

### Pitfall 2: `px-8` Causes Horizontal Scroll at 375px

**What goes wrong:** The existing `<main class="max-w-2xl mx-auto px-8 py-12">` applies 32px horizontal padding on each side at all viewport widths. At 375px, this leaves 311px of content width, which is usually fine — but if the sticky bar or header bar uses `w-full` with `px-8`, those fixed elements may also overflow.

**Why it happens:** 375px − 64px padding = 311px content. This is fine for text but can clip if any element inside has a minimum width.

**How to avoid:** Use `px-4 sm:px-8` on `<main>` (and match on header bar) so mobile gets 16px padding. The Phase 2 UI-SPEC used `px-8` without a breakpoint guard — Phase 4 is the right time to correct this.

**Warning signs:** Horizontal scrollbar appears on iPhone Safari at 375px.

### Pitfall 3: URL Encoding Fires Before DOM Is Ready

**What goes wrong:** `url.js` runs immediately (not on `DOMContentLoaded`) and tries to query form elements before Eleventy has rendered them.

**Why it happens:** Scripts at end of `<body>` execute synchronously, but `DOMContentLoaded` is the safe signal that the full DOM is parsed.

**How to avoid:** Wrap `url.js` restoration logic in `document.addEventListener('DOMContentLoaded', ...)`. Note that `calculator.js` currently calls `updateResult()` at the bottom of its IIFE (after the `form.addEventListener` attach) — this works because scripts at end of `<body>` run after DOM parse. `url.js` must do the same or use `DOMContentLoaded`.

**Warning signs:** `querySelector` returns `null`, `TypeError: Cannot read properties of null`.

### Pitfall 4: Double `updateResult()` Call on Page Load

**What goes wrong:** `calculator.js` calls `updateResult()` immediately. Then `url.js` restores state and triggers a `change` event, firing `updateResult()` again. The result briefly flashes the default state before switching to the URL-encoded state.

**Why it happens:** Two initialization paths executing sequentially with no coordination.

**How to avoid:** Two options:
1. Have `calculator.js` NOT auto-call `updateResult()` (remove line 52: `updateResult();`) and let `url.js` always trigger it after restoration. This is the cleanest but requires modifying `calculator.js`.
2. Accept the double-call — it is a single render cycle on page load and not user-visible (no flash; browser paints after all scripts complete synchronously). This requires zero changes to `calculator.js`.

Option 2 is recommended for minimal diff. The double call is safe because both calls happen synchronously before the first browser paint.

**Warning signs:** Result briefly shows wrong value on page load when URL params are present.

### Pitfall 5: Cities Param Uses Comma-Delimited Value

**What goes wrong:** `cities=providence,nibley` — if any city ID contains a comma, the split breaks. Also, `URLSearchParams.toString()` will percent-encode the comma to `%2C`, making the URL less readable.

**Why it happens:** Comma is a valid URL character but is percent-encoded by `URLSearchParams` by default.

**How to avoid:** City IDs in `config.js` are simple slug strings (`"providence"`, `"nibley"`, etc.) and will never contain commas. The percent-encoding is harmless — browsers display decoded URLs in the address bar. Alternatively, use multiple `params.append('cities', id)` calls and `params.getAll('cities')` to read — this avoids the split entirely and is more robust.

**Recommended:** Use `params.append` + `params.getAll` pattern rather than manual comma join/split. Produces `?cities=providence&cities=nibley` — slightly longer but spec-correct and unambiguous.

### Pitfall 6: DRAFT Overlay `z-index` Conflict with Sticky Bar

**What goes wrong:** If the DRAFT overlay has a higher `z-index` than the sticky result bar, the bar's breakdown tooltip becomes inaccessible.

**How to avoid:** DRAFT overlay = `z-40`; sticky result bar = `z-50`. Bar is always on top of overlay. Both are below any browser-native elements (browser UI, OS overlays).

---

## Code Examples

Verified patterns from official sources and the existing codebase:

### Reading URLSearchParams on Page Load
```javascript
// Source: MDN — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
var params = new URLSearchParams(location.search);
var staffingParam = params.get('staffing');   // returns null if not present
var citiesParam   = params.getAll('cities');  // returns [] if not present
```

### Writing URLSearchParams with replaceState
```javascript
// Source: MDN — https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
var params = new URLSearchParams();
params.set('staffing', 'fte-2-pte');
params.append('cities', 'providence');
params.append('cities', 'nibley');
history.replaceState(null, '', '?' + params.toString());
// Result: ?staffing=fte-2-pte&cities=providence&cities=nibley
```

### Triggering recalculation from url.js without modifying calculator.js
```javascript
// Dispatch a change event on the form — calculator.js's delegated listener will fire updateResult()
var form = document.getElementById('configurator');
form.dispatchEvent(new Event('change'));
```

### DRAFT overlay conditional in Nunjucks
```html
{% if config.draft %}
<div class="fixed inset-0 z-40 pointer-events-none flex items-center justify-center" aria-hidden="true">
  <span class="text-[12vw] font-black text-red-600 opacity-15 rotate-[-30deg] select-none uppercase tracking-widest">DRAFT</span>
</div>
{% endif %}
```

### config.js additions (Phase 4)
```javascript
export default {
  siteName: "Cache County Library Service Choices",
  draft: true,               // NEW: set to false when numbers are finalized

  // NEW: footer links (Claude's discretion: keep here for non-developer editability)
  footerLinks: [
    {
      label: "County-wide ballot initiative",
      url: "https://example.com/ballot"  // Site owner will supply real URL
    },
    {
      label: "Friends of the Library",
      url: "https://example.com/friends"
    }
  ],

  // ... existing staffingLevels, collections, cities ...
};
```

### Heroicons question-mark-circle (inline SVG, 20px solid style)
```html
<!-- Source: heroicons.com — copy from https://heroicons.com/ (search: question-mark-circle, 20/solid) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
     class="size-5" aria-hidden="true" focusable="false">
  <path fill-rule="evenodd"
    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
    clip-rule="evenodd" />
</svg>
```
**Note:** Verify the exact SVG path at heroicons.com before implementation — SVG paths may differ between minor versions. The `size-5` class (Tailwind v4) sets width and height to 1.25rem (20px).

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual `location.search` parsing | `URLSearchParams` API | Chrome 49 / Firefox 44 / Safari 10.1 (2016–2017) | Universal browser support since 2018; no custom parser needed |
| `history.pushState` for every filter change | `history.replaceState` for non-navigational state | Well-established pattern | Back button behavior is correct; no flooded history |
| CSS pseudo-element `::after` for watermarks | Fixed `<div>` with `pointer-events: none` | — | `::after` cannot overlay interactive elements that are positioned; a separate element with `pointer-events: none` is more reliable |
| Native Popover API for tooltips | Manual click-outside pattern | Popover API became Baseline 2024 | Native API is cleaner but harder to position absolutely within a fixed bar; manual pattern is still appropriate for this specific case |

**Deprecated/outdated:**
- IE11 URLSearchParams support: IE does not support `URLSearchParams`. This project targets modern browsers and does not support IE — no polyfill needed.

---

## Open Questions

1. **Should `viewport-fit=cover` be added to the meta viewport tag?**
   - What we know: Required to use `safe-area-inset-bottom` CSS env variable for iPhone home indicator. Currently not present in `index.html`.
   - What's unclear: Site owner's expectation for edge-to-edge appearance on iOS. Without it, the fixed bar rests above the safe area automatically.
   - Recommendation: Do NOT add `viewport-fit=cover` in Phase 4 unless site owner requests it. Default behavior (safe area above home indicator) is correct and simpler.

2. **Should URL encoding use `params.set('cities', ids.join(','))` or `params.append` per city?**
   - What we know: CONTEXT.md shows the comma-joined format (`cities=providence,nibley,millville`). `URLSearchParams.toString()` percent-encodes commas to `%2C` which browsers display decoded in the address bar.
   - What's unclear: Which format the site owner prefers for the displayed URL.
   - Recommendation: Use the comma-join format as specified in CONTEXT.md. Read back with `params.get('cities').split(',')`. The percent-encoding is cosmetic; browsers display the decoded form.

3. **Footer link URLs — config.js vs. hardcoded?**
   - What we know: CONTEXT.md marks this as Claude's Discretion. Actual URLs not yet available.
   - Recommendation: Put links in `config.js` under `footerLinks` array. Site owner can update via GitHub web UI without touching the template. This is consistent with the non-developer edit guide pattern already established in Phase 2.

---

## Validation Architecture

`nyquist_validation: true` in config.json — validation section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — Wave 0 must add a framework or use manual verification |
| Config file | None — no test directory exists in the project |
| Quick run command | `pnpm build` (build smoke test — verifies Eleventy renders without error) |
| Full suite command | `pnpm build` (no automated test suite exists) |

**Assessment:** This project has no automated test infrastructure beyond the build itself. Phase 4 requirements (visual, URL, overlay) are primarily UI behaviors that are difficult to unit-test without a headless browser. Manual verification against the success criteria is the appropriate validation strategy. Wave 0 should establish the build smoke test as the automated gate.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DESG-01 | Civic visual design renders correctly | Manual visual review | N/A | N/A |
| DESG-02 | No horizontal scroll at 375px; result visible above fold | Manual — open in browser at 375px width | N/A | N/A |
| DESG-03 | Tailwind utility classes only; no custom CSS added | Code review | `pnpm build` (fails if CSS invalid) | ❌ Wave 0 |
| CONF-06 | URL params restore exact selections when opened in new tab | Manual — copy URL, open new tab, verify | N/A | N/A |

### Sampling Rate
- **Per task commit:** `pnpm build` — confirms Eleventy renders without error and CSS compiles
- **Per wave merge:** `pnpm build` + manual browser verification (375px viewport, URL round-trip)
- **Phase gate:** All success criteria verified manually before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No test framework installed — manual verification is the gate for this phase
- [ ] No `tests/` directory — not needed for Phase 4 given the visual/behavioral nature of requirements
- [ ] Build smoke test: `pnpm build` — already available, use as the automated gate

*(All Phase 4 requirements require visual or browser-interaction verification that is not automatable without a headless browser (e.g., Playwright). Installing Playwright for Phase 4 alone would be disproportionate. Manual verification against the four success criteria in the phase description is the correct approach.)*

---

## Sources

### Primary (HIGH confidence)
- MDN Web Docs: URLSearchParams — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
- MDN Web Docs: History.replaceState — https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
- MDN Web Docs: env() CSS function — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env
- Tailwind CSS docs: position — https://tailwindcss.com/docs/position
- Tailwind CSS docs: z-index — https://tailwindcss.com/docs/z-index
- heroicons.com — icon source and SVG copy
- `.planning/phases/02-data-and-controls/02-UI-SPEC.md` — established color/typography/spacing contract

### Secondary (MEDIUM confidence)
- Chrome for Developers: safe-area-inset edge-to-edge migration — https://developer.chrome.com/docs/css-ui/edge-to-edge
- MDN: Popover API — https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
- Go Make Things: replaceState pattern — https://gomakethings.com/how-to-replace-the-current-url-in-the-browsers-history-with-the-vanilla-js-replacestate-method/
- Tailwind CSS fixed positioning guide — https://tailkits.com/blog/tailwind-fixed-positioning/

### Tertiary (LOW confidence — not relied upon for critical claims)
- CodePen stamp effect examples — informative for DRAFT overlay aesthetic direction

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and in use; browser APIs verified via MDN
- Architecture patterns: HIGH — URL API, replaceState, fixed positioning are stable browser primitives with no deprecation risk
- Pitfalls: HIGH — overlap, double-call, and scroll issues are verified by multiple authoritative sources; encoding behavior confirmed by MDN spec

**Research date:** 2026-03-20
**Valid until:** 2026-09-20 (stable browser APIs; Tailwind v4 patterns stable for 6 months minimum)
