// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/value
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed

(function () {
  'use strict';

  const form = document.getElementById('configurator');
  const resultEl = document.getElementById('result');

  function getStaffingCost() {
    const checked = form.querySelector('input[name="staffing"]:checked');
    return parseInt(checked.dataset.cost, 10);
  }

  function getCollectionsCost() {
    // Must read .value, not .dataset.cost — data-cost is frozen at build-time default
    const collectionsSelect = document.getElementById('collections');
    return parseInt(collectionsSelect.value, 10);
  }

  function getTotalHouseholds() {
    return Array.from(form.querySelectorAll('input[name="cities"]:checked'))
      .reduce((sum, cb) => sum + parseInt(cb.dataset.households, 10), 0);
  }

  function updateResult() {
    const totalHouseholds = getTotalHouseholds();

    if (totalHouseholds === 0) {
      resultEl.innerHTML =
        '<h2 class="text-xl font-semibold text-gray-900">Annual cost per household</h2>' +
        '<p class="text-sm text-gray-600 mt-2">Select at least one participating city to calculate the estimated cost per household.</p>';
      return;
    }

    const totalCost = getStaffingCost() + getCollectionsCost();
    const perHousehold = totalCost / totalHouseholds;

    resultEl.innerHTML =
      '<h2 class="text-xl font-semibold text-gray-900">Annual cost per household</h2>' +
      '<p class="text-3xl font-semibold text-blue-700 mt-2">$' + perHousehold.toFixed(2) + '</p>' +
      '<p class="text-sm text-gray-500 mt-1">$' + totalCost.toLocaleString('en-US') +
      ' total \u00f7 ' + totalHouseholds.toLocaleString('en-US') + ' households</p>';
  }

  // Single delegated listener covers all three control types
  form.addEventListener('change', updateResult);

  // Run immediately to show result for initial (default) state
  // Safe to call here — script is at end of <body>, DOM is ready
  updateResult();
}());
