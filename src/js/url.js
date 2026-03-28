// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState

(function () {
  'use strict';

  var data = window.LIBRARY_DATA;
  var form = document.getElementById('configurator');

  function encodeUrl() {
    var params = new URLSearchParams();

    // pi — staffing index (0-based position in data.staffingLevels)
    var staffingEl = form.querySelector('input[name="staffing"]:checked');
    if (staffingEl) {
      var staffingIdx = data.staffingLevels.findIndex(function (l) {
        return l.id === staffingEl.value;
      });
      if (staffingIdx !== -1) {
        params.set('pi', String(staffingIdx));
      }
    }

    // delta — digital collections index (0-based position in data.collectionsDigital.options)
    var digitalEl = document.getElementById('collections-digital');
    if (digitalEl) {
      var digitalVal = parseInt(digitalEl.value, 10);
      var digitalIdx = data.collectionsDigital.options.findIndex(function (o) {
        return o.value === digitalVal;
      });
      if (digitalIdx !== -1) params.set('delta', String(digitalIdx));
    }

    // tau — physical collections index (0-based position in data.collectionsPhysical.options)
    var physicalEl = document.getElementById('collections-physical');
    if (physicalEl) {
      var physicalVal = parseInt(physicalEl.value, 10);
      var physicalIdx = data.collectionsPhysical.options.findIndex(function (o) {
        return o.value === physicalVal;
      });
      if (physicalIdx !== -1) params.set('tau', String(physicalIdx));
    }

    // phi — comma-joined city indices (0-based positions in data.cities)
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

  function restoreFromUrl() {
    var params = new URLSearchParams(location.search);
    if (!params.toString()) return; // No params — use defaults

    // Restore staffing via pi index
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
      // Out-of-bounds or NaN — silently use default
    }

    // Restore digital via delta index
    var deltaParam = params.get('delta');
    if (deltaParam !== null) {
      var digIdx = parseInt(deltaParam, 10);
      var digSlider = document.getElementById('collections-digital');
      if (!isNaN(digIdx) && digIdx >= 0 && digIdx < data.collectionsDigital.options.length) {
        digSlider.value = String(data.collectionsDigital.options[digIdx].value);
      }
      // Out-of-bounds or NaN — silently use default
    }

    // Restore physical via tau index
    var tauParam = params.get('tau');
    if (tauParam !== null) {
      var physIdx = parseInt(tauParam, 10);
      var physSlider = document.getElementById('collections-physical');
      if (!isNaN(physIdx) && physIdx >= 0 && physIdx < data.collectionsPhysical.options.length) {
        physSlider.value = String(data.collectionsPhysical.options[physIdx].value);
      }
      // Out-of-bounds falls through to default
    }

    // Restore cities via phi indices
    var phiParam = params.get('phi');
    if (phiParam !== null) {
      var cityIndices = phiParam.split(',').map(function (s) { return parseInt(s, 10); });
      form.querySelectorAll('input[name="cities"]').forEach(function (cb) { cb.checked = false; });
      cityIndices.forEach(function (idx) {
        if (!isNaN(idx) && idx >= 0 && idx < data.cities.length) {
          var cityId = data.cities[idx].id;
          var cb = form.querySelector('input[name="cities"][value="' + cityId + '"]');
          if (cb) cb.checked = true;
        }
      });
    }
  }

  // Both scripts are at end of <body> — they execute synchronously after DOM parse.
  // url.js runs AFTER calculator.js (script order in HTML), so form and calculator
  // are already initialized. No DOMContentLoaded wrapper needed.
  // Restore URL state first, then dispatch change to trigger recalculation.

  restoreFromUrl();
  form.dispatchEvent(new Event('change'));
  form.dispatchEvent(new Event('input'));
  form.addEventListener('change', encodeUrl);
}());
