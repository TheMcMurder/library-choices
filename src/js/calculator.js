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

  function getDigitalCost() {
    var el = document.getElementById('collections-digital');
    return parseInt(el.value, 10);
  }

  function getPhysicalCost() {
    var el = document.getElementById('collections-physical');
    return parseInt(el.value, 10);
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

    var totalCost = getStaffingCost() + getDigitalCost() + getPhysicalCost();
    var perHousehold = totalCost / totalHouseholds;

    resultAmount.textContent = '$' + perHousehold.toFixed(2) + '/household/year';
    resultAmount.className = 'text-2xl font-semibold';
    breakdownDetail.textContent = '$' + totalCost.toLocaleString('en-US') + ' total \u00f7 ' + totalHouseholds.toLocaleString('en-US') + ' households';
  }

  function updateSliderLabels(sliderId, dataKey, amountId, descriptionId) {
    var slider = document.getElementById(sliderId);
    var value = parseInt(slider.value, 10);
    var options = window.LIBRARY_DATA[dataKey].options;
    var node = null;
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === value) { node = options[i]; break; }
    }
    if (!node) return;
    document.getElementById(amountId).textContent = '$' + value.toLocaleString('en-US');
    document.getElementById(descriptionId).textContent = node.description;
    slider.setAttribute('aria-valuetext', value.toLocaleString('en-US') + ' dollars \u2014 ' + node.description);
    document.querySelectorAll('[data-slider="' + sliderId + '"]').forEach(function (btn) {
      var isActive = btn.dataset.value === String(slider.value);
      var isCurrentLevel = btn.dataset.currentLevel === 'true';
      btn.classList.toggle('text-blue-800', isActive);
      btn.classList.toggle('font-semibold', isActive || isCurrentLevel);
      btn.classList.toggle('text-gray-500', !isActive && !isCurrentLevel);
      btn.classList.toggle('font-normal', !isActive && !isCurrentLevel);
      btn.classList.toggle('text-amber-600', !isActive && isCurrentLevel);
    });
  }

  function updateAllSliderLabels() {
    updateSliderLabels('collections-digital', 'collectionsDigital', 'collections-digital-amount', 'collections-digital-description');
    updateSliderLabels('collections-physical', 'collectionsPhysical', 'collections-physical-amount', 'collections-physical-description');
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
    updateAllSliderLabels();
  });

  // Run immediately to show result for initial (default) state
  // Safe to call here — script is at end of <body>, DOM is ready
  updateResult();
  updateAllSliderLabels();

  // Node button click handlers — snap slider to clicked value
  // Scoped via data-slider to prevent cross-slider interference
  document.querySelectorAll('[data-slider]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sliderId = btn.dataset.slider;
      var slider = document.getElementById(sliderId);
      slider.value = btn.dataset.value;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
}());
