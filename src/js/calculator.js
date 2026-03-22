// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/value
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed

(function () {
  'use strict';

  var form = document.getElementById('configurator');

  function getStaffingCost() {
    var checked = form.querySelector('input[name="staffing"]:checked');
    return parseInt(checked.dataset.cost, 10);
  }

  function getCollectionsCost() {
    // Must read .value, not .dataset.cost — data-cost is frozen at build-time default
    var collectionsSelect = document.getElementById('collections');
    return parseInt(collectionsSelect.value, 10);
  }

  function getTotalHouseholds() {
    return Array.from(form.querySelectorAll('input[name="cities"]:checked'))
      .reduce(function (sum, cb) { return sum + parseInt(cb.dataset.households, 10); }, 0);
  }

  function updateResult() {
    var totalHouseholds = getTotalHouseholds();
    var resultAmount = document.getElementById('result-amount');
    var breakdownDetail = document.getElementById('breakdown-detail');

    if (totalHouseholds === 0) {
      resultAmount.textContent = 'Select at least one city';
      resultAmount.className = 'text-base text-blue-100';
      breakdownDetail.textContent = '';
      return;
    }

    var totalCost = getStaffingCost() + getCollectionsCost();
    var perHousehold = totalCost / totalHouseholds;

    resultAmount.textContent = '$' + perHousehold.toFixed(2) + '/household/year';
    resultAmount.className = 'text-2xl font-semibold';
    breakdownDetail.textContent = '$' + totalCost.toLocaleString('en-US') + ' total \u00f7 ' + totalHouseholds.toLocaleString('en-US') + ' households';
  }

  function updateSliderLabels() {
    var slider = document.getElementById('collections');
    var value = parseInt(slider.value, 10);
    var options = window.LIBRARY_DATA.collections.options;
    var node = null;
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === value) { node = options[i]; break; }
    }
    if (!node) return;
    document.getElementById('collections-amount').textContent = '$' + value.toLocaleString('en-US');
    document.getElementById('collections-description').textContent = node.description;
    slider.setAttribute('aria-valuetext', (value / 1000).toLocaleString('en-US') + ',000 dollars \u2014 ' + node.description);
    var nodeButtons = document.querySelectorAll('[data-value]');
    nodeButtons.forEach(function (btn) {
      var isActive = btn.dataset.value === String(slider.value);
      btn.classList.toggle('text-blue-800', isActive);
      btn.classList.toggle('font-semibold', isActive);
      btn.classList.toggle('text-gray-500', !isActive);
      btn.classList.toggle('font-normal', !isActive);
    });
  }

  var toggleBtn = document.getElementById('breakdown-toggle');
  var breakdownDetail = document.getElementById('breakdown-detail');

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var isHidden = breakdownDetail.hidden;
    breakdownDetail.hidden = !isHidden;
    toggleBtn.setAttribute('aria-label', isHidden ? 'Hide cost breakdown' : 'Show cost breakdown');
  });

  document.addEventListener('click', function (e) {
    if (!breakdownDetail.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
      breakdownDetail.hidden = true;
      toggleBtn.setAttribute('aria-label', 'Show cost breakdown');
    }
  });

  // Single delegated listener covers all three control types
  form.addEventListener('change', updateResult);

  // Input event fires on every slider move (including during drag) — ensures live updates
  form.addEventListener('input', function () {
    updateResult();
    updateSliderLabels();
  });

  // Run immediately to show result for initial (default) state
  // Safe to call here — script is at end of <body>, DOM is ready
  updateResult();
  updateSliderLabels();

  // Node button click handlers — snap slider to clicked value
  document.querySelectorAll('[data-value]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slider = document.getElementById('collections');
      slider.value = btn.dataset.value;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
}());
