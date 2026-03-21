// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState

(function () {
  'use strict';

  var data = window.LIBRARY_DATA;
  var form = document.getElementById('configurator');

  function encodeUrl() {
    var params = new URLSearchParams();

    // Staffing — single radio value
    var staffing = form.querySelector('input[name="staffing"]:checked');
    if (staffing) {
      params.set('staffing', staffing.value);
    }

    // Collections — slider value
    var collections = document.getElementById('collections');
    if (collections) {
      params.set('collections', collections.value);
    }

    // Cities — comma-joined checkbox values
    var cities = Array.from(form.querySelectorAll('input[name="cities"]:checked'))
      .map(function (cb) { return cb.value; });
    if (cities.length) {
      params.set('cities', cities.join(','));
    }

    var qs = params.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  function restoreFromUrl() {
    var params = new URLSearchParams(location.search);
    if (!params.toString()) return; // No params — use defaults

    // Restore staffing
    var staffingParam = params.get('staffing');
    if (staffingParam) {
      var validStaffingIds = data.staffingLevels.map(function (l) { return l.id; });
      if (validStaffingIds.indexOf(staffingParam) !== -1) {
        var radio = form.querySelector('input[name="staffing"][value="' + staffingParam + '"]');
        if (radio) {
          form.querySelectorAll('input[name="staffing"]').forEach(function (r) { r.checked = false; });
          radio.checked = true;
        }
      }
      // Invalid staffing ID — silently use first option (default checked)
    }

    // Restore collections
    var collectionsParam = params.get('collections');
    if (collectionsParam) {
      var slider = document.getElementById('collections');
      var validValues = data.collections.options.map(function (o) { return String(o.value); });
      if (validValues.indexOf(collectionsParam) !== -1) {
        slider.value = collectionsParam;
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

  // Both scripts are at end of <body> — they execute synchronously after DOM parse.
  // url.js runs AFTER calculator.js (script order in HTML), so form and calculator
  // are already initialized. No DOMContentLoaded wrapper needed.
  // Restore URL state first, then dispatch change to trigger recalculation.

  restoreFromUrl();
  form.dispatchEvent(new Event('change'));
  form.addEventListener('change', encodeUrl);
}());
