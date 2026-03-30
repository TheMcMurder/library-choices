// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState

import { encodeIndices, decodeIndices } from './lib/url-helpers.js';

var data = window.LIBRARY_DATA;
var form = document.getElementById('configurator');

// Stage 1 — Pull DOM state
function getCurrentSelections() {
  var staffingEl = form.querySelector('input[name="staffing"]:checked');
  var staffingId = staffingEl ? staffingEl.value : null;
  var digitalEl = document.getElementById('collections-digital');
  var digitalValue = digitalEl ? parseInt(digitalEl.value, 10) : 0;
  var physicalEl = document.getElementById('collections-physical');
  var physicalValue = physicalEl ? parseInt(physicalEl.value, 10) : 0;
  var cityIds = Array.from(form.querySelectorAll('input[name="cities"]:checked'))
    .map(function (cb) { return cb.value; });
  return { staffingId: staffingId, digitalValue: digitalValue, physicalValue: physicalValue, cityIds: cityIds };
}

// Stage 2 — Encode (calls helper)
function encodeUrl() {
  var sel = getCurrentSelections();
  if (!sel.staffingId) return;
  var params = encodeIndices(data, sel.staffingId, sel.digitalValue, sel.physicalValue, sel.cityIds);
  var qs = params.toString();
  history.replaceState(null, '', qs ? '?' + qs : location.pathname);
}

// Stage 3 — Apply decoded indices to DOM
function applySelections(indices) {
  // Restore staffing
  if (indices.staffingIdx !== null) {
    var staffingId = data.staffingLevels[indices.staffingIdx].id;
    var radio = form.querySelector('input[name="staffing"][value="' + staffingId + '"]');
    if (radio) {
      form.querySelectorAll('input[name="staffing"]').forEach(function (r) { r.checked = false; });
      radio.checked = true;
    }
  }
  // Restore digital slider
  if (indices.digitalIdx !== null) {
    var digSlider = document.getElementById('collections-digital');
    if (digSlider) digSlider.value = String(data.collectionsDigital.options[indices.digitalIdx].value);
  }
  // Restore physical slider
  if (indices.physicalIdx !== null) {
    var physSlider = document.getElementById('collections-physical');
    if (physSlider) physSlider.value = String(data.collectionsPhysical.options[indices.physicalIdx].value);
  }
  // Restore cities
  if (indices.cityIndices.length) {
    form.querySelectorAll('input[name="cities"]').forEach(function (cb) { cb.checked = false; });
    indices.cityIndices.forEach(function (idx) {
      var cityId = data.cities[idx].id;
      var cb = form.querySelector('input[name="cities"][value="' + cityId + '"]');
      if (cb) cb.checked = true;
    });
  }
}

// Stage 4 — Pull URL params, decode, and restore
function restoreFromUrl() {
  var params = new URLSearchParams(location.search);
  if (!params.toString()) return;
  var indices = decodeIndices(data, params);
  applySelections(indices);
}

// Module scripts are deferred — DOM is ready when they execute.
// Restore URL state first, then dispatch change to trigger recalculation.
restoreFromUrl();
form.dispatchEvent(new Event('change'));
form.dispatchEvent(new Event('input'));
form.addEventListener('change', encodeUrl);
