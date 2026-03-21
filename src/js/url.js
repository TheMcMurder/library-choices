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

    // tau — collections index (0-based position in data.collections.options)
    var collectionsEl = document.getElementById('collections');
    if (collectionsEl) {
      var collectionsVal = parseInt(collectionsEl.value, 10);
      var collectionsIdx = data.collections.options.findIndex(function (o) {
        return o.value === collectionsVal;
      });
      if (collectionsIdx !== -1) {
        params.set('tau', String(collectionsIdx));
      }
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

    var useCompact = params.has('pi') || params.has('tau') || params.has('phi');

    if (useCompact) {
      // --- Compact path (pi/tau/phi indices) ---

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

      // Restore collections via tau index
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
        // Out-of-bounds or NaN — silently use default
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
    } else {
      // --- Verbose path (backward compatibility with pre-phase-9 URLs) ---

      // Restore staffing
      var staffingParam = params.get('staffing');
      if (staffingParam) {
        var validStaffingIds = data.staffingLevels.map(function (l) { return l.id; });
        if (validStaffingIds.indexOf(staffingParam) !== -1) {
          var staffingRadio = form.querySelector('input[name="staffing"][value="' + staffingParam + '"]');
          if (staffingRadio) {
            form.querySelectorAll('input[name="staffing"]').forEach(function (r) { r.checked = false; });
            staffingRadio.checked = true;
          }
        }
        // Invalid staffing ID — silently use first option (default checked)
      }

      // Restore collections
      var collectionsParam = params.get('collections');
      if (collectionsParam) {
        var verboseSlider = document.getElementById('collections');
        var validValues = data.collections.options.map(function (o) { return String(o.value); });
        if (validValues.indexOf(collectionsParam) !== -1) {
          verboseSlider.value = collectionsParam;
        }
        // Invalid collections value — silently use default
      }

      // Restore cities
      var citiesParam = params.get('cities');
      if (citiesParam) {
        var cityIds = citiesParam.split(',');
        var validCityIds = data.cities.map(function (c) { return c.id; });
        form.querySelectorAll('input[name="cities"]').forEach(function (cb) {
          cb.checked = cityIds.indexOf(cb.value) !== -1 && validCityIds.indexOf(cb.value) !== -1;
        });
      }
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
