# Phase 9: Compact URL Encoding — pi/tau/phi easter egg param aliases — Research

**Researched:** 2026-03-21
**Domain:** Vanilla JavaScript URL encoding, URLSearchParams API, backward-compatible param aliasing
**Confidence:** HIGH

## Summary

Phase 9 adds a compact, easter-egg-style alternate URL encoding to the existing shareable-URL feature. Instead of verbose parameter names with semantic string values (`?staffing=1fte-2pte&collections=30000&cities=providence,nibley`), the compact form uses Greek letter aliases (`pi`, `tau`, `phi`) that map to 0-based positional indices into the config data arrays (`?pi=2&tau=2&phi=0,1`). This reduces a typical URL's query string from ~70 characters to ~20 — a ~72% reduction.

The feature is an "easter egg" in the sense that it is undiscoverable through normal UX — it only surfaces when a curious user inspects a URL or receives a link deliberately constructed using the compact scheme. The canonical UX-visible URL format (verbose params) remains unchanged. The compact scheme is a read-and-write alias: `url.js` should write compact URLs as the new canonical form when encoding, and must decode both forms when restoring state from a URL (for backward compatibility with existing shared verbose URLs).

**Primary recommendation:** Implement compact encoding as the new write-canonical in `url.js`, while retaining full decode support for existing verbose param names. Use 0-based indices throughout for consistency with JavaScript array conventions. Map: `pi` → staffing index, `tau` → collections index, `phi` → comma-joined city indices.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| URLSearchParams (native) | Web API | Read/write URL query params | Already used in url.js; no library needed |
| history.replaceState (native) | Web API | Update URL bar without navigation | Already used in url.js; zero cost |

### Supporting
None required. This is a pure vanilla JS enhancement to the existing `url.js` module. No new dependencies.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 0-based index | 1-based index | 0-based is consistent with JS arrays; 1-based is more human-readable in a URL. Either works — pick one and document it. Research recommends 0-based for direct array access without offset arithmetic. |
| Compact as new write-canonical | Compact as read-only alias | Read-only alias means no user ever sees the compact form unless they craft it themselves; write-canonical means all new shared URLs are compact. Phase intent ("easter egg param aliases") suggests compact should be the natural output, making the easter egg discoverable by looking at the URL bar. |
| Single-char params `p`, `t`, `c` | Greek letter names `pi`, `tau`, `phi` | Phase spec explicitly names pi/tau/phi. Stick with the spec. |

**Installation:**
No new packages. All work is in `src/js/url.js`.

## Architecture Patterns

### Recommended Project Structure
No structure changes. Only `src/js/url.js` is modified.

### Pattern 1: Param Alias Resolution on Decode (read both forms)

**What:** On page load, `restoreFromUrl()` checks for compact params first (`pi`, `tau`, `phi`). If found, resolve indices to canonical values and apply. If not found, fall back to verbose params (`staffing`, `collections`, `cities`) for backward compat.

**When to use:** Any time a URL may have been created by either the old system (verbose) or the new system (compact).

**Example:**
```javascript
// Source: MDN URLSearchParams — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

function restoreFromUrl() {
  var params = new URLSearchParams(location.search);
  if (!params.toString()) return;

  var useCompact = params.has('pi') || params.has('tau') || params.has('phi');

  if (useCompact) {
    // --- Compact path ---
    var piParam = params.get('pi');
    if (piParam !== null) {
      var staffingIdx = parseInt(piParam, 10);
      if (
        !isNaN(staffingIdx) &&
        staffingIdx >= 0 &&
        staffingIdx < data.staffingLevels.length
      ) {
        var staffingId = data.staffingLevels[staffingIdx].id;
        var radio = form.querySelector('input[name="staffing"][value="' + staffingId + '"]');
        if (radio) {
          form.querySelectorAll('input[name="staffing"]').forEach(function (r) { r.checked = false; });
          radio.checked = true;
        }
      }
    }

    var tauParam = params.get('tau');
    if (tauParam !== null) {
      var collectionsIdx = parseInt(tauParam, 10);
      var slider = document.getElementById('collections');
      if (
        !isNaN(collectionsIdx) &&
        collectionsIdx >= 0 &&
        collectionsIdx < data.collections.options.length
      ) {
        slider.value = String(data.collections.options[collectionsIdx].value);
      }
    }

    var phiParam = params.get('phi');
    if (phiParam !== null) {
      var cityIndices = phiParam.split(',').map(function (s) { return parseInt(s, 10); });
      form.querySelectorAll('input[name="cities"]').forEach(function (cb) { cb.checked = false; });
      cityIndices.forEach(function (idx) {
        if (idx >= 0 && idx < data.cities.length) {
          var cityId = data.cities[idx].id;
          var cb = form.querySelector('input[name="cities"][value="' + cityId + '"]');
          if (cb) cb.checked = true;
        }
      });
    }
  } else {
    // --- Verbose path (backward compat) ---
    // ... existing restoreFromUrl logic unchanged ...
  }
}
```

### Pattern 2: Compact Encoding on Write

**What:** `encodeUrl()` writes compact params instead of verbose params. The URL bar always shows the compact form after any user interaction.

**When to use:** Every time the form state changes (change event listener already in place).

**Example:**
```javascript
// Source: MDN URLSearchParams — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// Source: MDN history.replaceState — https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState

function encodeUrl() {
  var params = new URLSearchParams();

  // pi — staffing index
  var staffingEl = form.querySelector('input[name="staffing"]:checked');
  if (staffingEl) {
    var staffingIdx = data.staffingLevels.findIndex(function (l) {
      return l.id === staffingEl.value;
    });
    if (staffingIdx !== -1) params.set('pi', String(staffingIdx));
  }

  // tau — collections index
  var collectionsEl = document.getElementById('collections');
  if (collectionsEl) {
    var collectionsVal = parseInt(collectionsEl.value, 10);
    var collectionsIdx = data.collections.options.findIndex(function (o) {
      return o.value === collectionsVal;
    });
    if (collectionsIdx !== -1) params.set('tau', String(collectionsIdx));
  }

  // phi — comma-joined city indices
  var cityIndices = Array.from(form.querySelectorAll('input[name="cities"]:checked'))
    .map(function (cb) {
      return data.cities.findIndex(function (c) { return c.id === cb.value; });
    })
    .filter(function (idx) { return idx !== -1; });
  if (cityIndices.length) {
    params.set('phi', cityIndices.join(','));
  }

  var qs = params.toString();
  history.replaceState(null, '', qs ? '?' + qs : location.pathname);
}
```

### Pattern 3: Index Resolution Safety

**What:** Any out-of-bounds or NaN index is silently ignored (falls back to existing default). This mirrors the existing "invalid param — silently use default" behavior already established in url.js.

**When to use:** Always. Never throw on bad URL params.

### Anti-Patterns to Avoid

- **Trusting `parseInt` without bounds check:** `parseInt('99', 10)` returns 99 — always check `idx >= 0 && idx < array.length`.
- **Mixing compact and verbose in one URL:** If a URL contains both `pi=` and `staffing=`, one system must win. Define compact as taking priority (simplest rule) and document it.
- **Writing verbose URLs after this phase ships:** Ensure `encodeUrl()` always writes compact form so existing verbose-URL-restoration path is only triggered by pre-phase-9 links.
- **Using 1-based indices:** Creates off-by-one errors when indexing into JS arrays. Stick with 0-based.
- **Forgetting `Array.prototype.findIndex` returns -1 for not found:** Always filter out `-1` before writing to params.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL query string parsing | Custom split/parse | URLSearchParams (native) | Handles edge cases: encoded chars, duplicate keys, empty values |
| URL writing | String concatenation | URLSearchParams + history.replaceState | Already used in url.js; consistent, correct encoding |
| Array index lookup | Manual for-loop | Array.findIndex (ES2015, already in scope) | Cleaner, no off-by-one risk; available in all target browsers |

**Key insight:** This feature is entirely within the existing url.js module. The data is already available via `window.LIBRARY_DATA`. No new architecture needed — just extend the existing encode/decode functions.

## Common Pitfalls

### Pitfall 1: Config Array Order Changes Break Existing Compact URLs
**What goes wrong:** If a new city is inserted at position 0 in `config.js`, existing compact URLs using `phi=0` now point to the wrong city.
**Why it happens:** Compact encoding is positional, not by ID. Index 0 means "whichever city is first in the array."
**How to avoid:** Document in the NON-DEVELOPER EDIT GUIDE that cities and staffing levels must be appended to the end of their arrays, never inserted at the beginning or middle. The verbose URL format is immune to this because it uses semantic IDs (`city.id`, `staffing.id`). Note this tradeoff explicitly.
**Warning signs:** A shared link opens to the wrong selections after a config.js edit.

### Pitfall 2: Compact and Verbose Params Both Present
**What goes wrong:** A URL has both `pi=1` and `staffing=1fte` — unclear which wins. If both are decoded, the second one overwrites the first.
**Why it happens:** Manually crafted URLs, or a version mismatch where someone shares a URL from an old client.
**How to avoid:** Define a clear priority rule: compact (`pi/tau/phi`) wins over verbose (`staffing/collections/cities`) when both are present. Check for compact params first; skip verbose if any compact key is found.
**Warning signs:** State flickers or lands in wrong position on restore.

### Pitfall 3: `findIndex` on an Array That Changed at Runtime
**What goes wrong:** `data` is `window.LIBRARY_DATA`, set once at page load from the embedded JSON. It never changes at runtime. This is not a real pitfall — just confirm `LIBRARY_DATA` is always an array with the expected shape before calling `findIndex`.
**Why it happens:** Defensive coding habit from frameworks where data can be undefined during hydration.
**How to avoid:** The existing pattern already guards with `if (!params.toString()) return;`. Same guard is sufficient here.

### Pitfall 4: phi='' (No Cities Checked)
**What goes wrong:** If all city checkboxes are unchecked and `phi` is set to empty string, `''.split(',')` returns `['']`, and `parseInt('', 10)` returns `NaN`. The NaN passes `idx !== -1` but fails `idx >= 0`.
**Why it happens:** Edge case where user unchecks all cities, then shares the URL.
**How to avoid:** Filter `cityIndices` with `isNaN(idx)` check. OR: simply omit `phi` param entirely when no cities are checked (same as the existing `cities` param omission logic). The existing `if (cityIndices.length)` guard handles this.

### Pitfall 5: Backward Compatibility Test Gap
**What goes wrong:** Phase 9 ships and existing shared verbose URLs (`?staffing=1fte&collections=30000&cities=nibley`) stop restoring correctly.
**Why it happens:** `encodeUrl()` now writes compact form, but if `restoreFromUrl()` is incorrectly refactored, verbose decoding path gets broken.
**How to avoid:** After implementation, manually test a verbose URL in a new tab to confirm state restores correctly. This is the explicit verification step.

## Code Examples

Verified patterns from official sources:

### URLSearchParams.has() — Compact Param Detection
```javascript
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/has
var params = new URLSearchParams(location.search);
var isCompact = params.has('pi') || params.has('tau') || params.has('phi');
```

### Array.findIndex — ID to Index
```javascript
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
var idx = data.staffingLevels.findIndex(function (l) { return l.id === staffingEl.value; });
// Returns -1 if not found — always check before using
if (idx !== -1) params.set('pi', String(idx));
```

### Bounds-Checked Index Resolution
```javascript
// Resolves a compact index string to a config array item safely
function resolveIndex(param, array) {
  var idx = parseInt(param, 10);
  if (isNaN(idx) || idx < 0 || idx >= array.length) return null;
  return array[idx];
}
```

### URL Comparison — Compact vs Verbose
```javascript
// Verbose (existing):
// ?staffing=1fte-2pte&collections=30000&cities=providence,nibley,millville
// 71 chars

// Compact (Phase 9):
// ?pi=2&tau=2&phi=0,1,2
// 21 chars

// With all 4 cities:
// Verbose: ?staffing=1fte-2pte&collections=60000&cities=providence,nibley,millville,river-heights
// Compact: ?pi=2&tau=5&phi=0,1,2,3
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Verbose semantic URL params | Compact positional index params (phase 9) | Phase 9 | 60-75% shorter URLs; backward compat preserved |

**Deprecated/outdated after Phase 9:**
- Writing verbose URLs: `url.js` switches to compact write. Verbose format is still decoded (read) for backward compat.

## Open Questions

1. **Should the write-canonical form be compact or verbose?**
   - What we know: Phase name says "compact URL encoding" — implies compact is the goal, not just an alias
   - What's unclear: Whether "easter egg" means it should only be decodable (read-only), or should be the normal URL output
   - Recommendation: Write compact as canonical. This makes the easter egg visible to anyone who looks at the URL bar after any interaction — the most discoverable form. Verbose decoding is retained for backward compat.

2. **0-based or 1-based indices?**
   - What we know: JS arrays are 0-based; human counting is 1-based
   - What's unclear: No explicit spec in phase description
   - Recommendation: 0-based. Simpler index math, consistent with JS conventions, and the greek letters are sufficiently opaque that users won't be counting items visually.

3. **What happens when config arrays change length (new city added)?**
   - What we know: Positional encoding is brittle to array reordering or insertion
   - What's unclear: Whether the site owner will be warned about this
   - Recommendation: Add a comment to the NON-DEVELOPER EDIT GUIDE noting that adding cities should be done by appending to the array, and that existing compact URLs may resolve to different items if the array order is changed. This is acceptable given the "easter egg" nature — it is not the primary sharing mechanism.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — no test infrastructure in project |
| Config file | None |
| Quick run command | N/A — manual browser verification |
| Full suite command | N/A — manual browser verification |

### Phase Requirements → Test Map

No formal test framework exists. Validation is manual browser-based.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| URL-01 | Compact params encode correctly on form change | manual | N/A | N/A |
| URL-02 | Compact URL restores correct state on page load | manual | N/A | N/A |
| URL-03 | Verbose URLs from Phase 4/6 still restore correctly (backward compat) | manual | N/A | N/A |
| URL-04 | Out-of-bounds index falls back to default silently | manual | N/A | N/A |
| URL-05 | All-cities-unchecked edge case handled (phi omitted) | manual | N/A | N/A |

### Sampling Rate
- **Per task commit:** Manual browser test of encode and restore in the same browser tab
- **Per wave merge:** Test both a new compact URL and an old verbose URL in new tabs
- **Phase gate:** All 5 test cases above pass before `/gsd:verify-work`

### Wave 0 Gaps
No test framework exists. All validation is manual. No Wave 0 test file creation is needed — this aligns with the existing project testing posture across all prior phases.

*(No automated test infrastructure has been used in any phase of this project — manual browser verification has been the consistent pattern.)*

## Sources

### Primary (HIGH confidence)
- MDN Web Docs — URLSearchParams API (https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) — read/write methods, gotchas, browser support
- MDN Web Docs — history.replaceState (https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) — URL update without navigation
- MDN Web Docs — Array.findIndex (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) — index lookup pattern
- Project source — `src/js/url.js` (current implementation) — direct code inspection
- Project source — `src/_data/config.js` (current data shape) — direct code inspection
- Project source — `src/index.html` (form structure and IDs) — direct code inspection

### Secondary (MEDIUM confidence)
- URLSearchParams browser support: Baseline "Widely Available" since April 2018 — verified via MDN fetch
- `Array.findIndex` ES2015: universally supported in all project target browsers — no polyfill needed

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — URLSearchParams and history.replaceState are well-established, already used in the codebase
- Architecture: HIGH — extends existing url.js patterns; no new external dependencies
- Pitfalls: HIGH — derived from direct code inspection and mathematical analysis of the feature

**Research date:** 2026-03-21
**Valid until:** 2026-06-21 (stable APIs; no expiry risk)
