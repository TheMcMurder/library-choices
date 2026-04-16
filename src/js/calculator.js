// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/value
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed

import { calculatePerHousehold } from './lib/calculator-helpers.js';
import { trackStaffingSelected, trackDigitalSliderChanged, trackPhysicalSliderChanged, trackCityToggled, trackBreakdownOpened } from './lib/analytics.js';

var form = document.getElementById('configurator');

function getStaffingCost() {
  var checked = form.querySelector('input[name="staffing"]:checked');
  return checked ? parseInt(checked.dataset.cost, 10) : 0;
}

function getDigitalCost() {
  var el = document.getElementById('collections-digital');
  if (!el) return 0;
  var idx = parseInt(el.value, 10);
  var opts = window.LIBRARY_DATA.collectionsDigital.options;
  if (idx < 0 || idx >= opts.length) return 0;
  return opts[idx].value;
}

function getPhysicalCost() {
  var el = document.getElementById('collections-physical');
  if (!el) return 0;
  var idx = parseInt(el.value, 10);
  var opts = window.LIBRARY_DATA.collectionsPhysical.options;
  if (idx < 0 || idx >= opts.length) return 0;
  return opts[idx].value;
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
    breakdownDetail.innerHTML = '';
    return;
  }

  var staffingCost = getStaffingCost();
  var digitalCost = getDigitalCost();
  var physicalCost = getPhysicalCost();
  var perHousehold = calculatePerHousehold(staffingCost, digitalCost, physicalCost, totalHouseholds);
  var totalCost = staffingCost + digitalCost + physicalCost;

  // Collapsed bar: two-line display
  resultAmount.innerHTML =
    '<span class="block text-2xl font-semibold">$' + perHousehold.toFixed(2) + '/household/year</span>' +
    '<span class="block text-sm text-blue-200">$' + totalCost.toLocaleString('en-US') + ' total</span>';
  resultAmount.className = '';

  // Popover: accounting-style formula table
  breakdownDetail.innerHTML =
    '<table class="w-full"><tbody>' +
    '<tr><td class="text-right pr-3 tabular-nums">$' + staffingCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Hours Open</td></tr>' +
    '<tr><td class="text-right pr-3 tabular-nums">$' + digitalCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Digital</td></tr>' +
    '<tr><td class="text-right pr-3 tabular-nums">$' + physicalCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Physical</td></tr>' +
    '</tbody><tfoot>' +
    '<tr><td colspan="2" class="pt-1 pb-1"><hr class="border-blue-700" /></td></tr>' +
    '<tr><td class="text-right pr-3 tabular-nums font-semibold">$' + totalCost.toLocaleString('en-US') + '</td><td class="font-semibold">Total</td></tr>' +
    '<tr><td colspan="2" class="pt-1 text-blue-200">$' + totalCost.toLocaleString('en-US') + ' \u00f7 ' + totalHouseholds.toLocaleString('en-US') + ' households = $' + perHousehold.toFixed(2) + '/year</td></tr>' +
    '</tfoot></table>';
}

function updateSliderLabels(sliderId, dataKey, amountId, descriptionId) {
  var slider = document.getElementById(sliderId);
  var idx = parseInt(slider.value, 10);
  var options = window.LIBRARY_DATA[dataKey].options;
  var node = options[idx];
  if (!node) return;
  document.getElementById(amountId).textContent = '$' + node.value.toLocaleString('en-US');
  document.getElementById(descriptionId).textContent = node.description;
  slider.setAttribute('aria-valuetext', node.value.toLocaleString('en-US') + ' dollars \u2014 ' + node.description);
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
  if (isHidden) trackBreakdownOpened();
});

document.addEventListener('click', function (e) {
  if (!breakdownDetail.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
    breakdownDetail.hidden = true;
    toggleBtn.setAttribute('aria-label', 'Show cost breakdown');
  }
});

// Single delegated listener covers all three control types
form.addEventListener('change', function (e) {
  updateResult();
  if (e.target.matches('input[name="staffing"]')) {
    var level = window.LIBRARY_DATA.staffingLevels.find(function (l) { return l.id === e.target.value; });
    if (level) trackStaffingSelected(e.target.value, level.label);
  }
  if (e.target.id === 'collections-digital') {
    var idx = parseInt(e.target.value, 10);
    var opts = window.LIBRARY_DATA.collectionsDigital.options;
    if (opts[idx]) trackDigitalSliderChanged(opts[idx].value);
  }
  if (e.target.id === 'collections-physical') {
    var idx = parseInt(e.target.value, 10);
    var opts = window.LIBRARY_DATA.collectionsPhysical.options;
    if (opts[idx]) trackPhysicalSliderChanged(opts[idx].value);
  }
  if (e.target.matches('input[name="cities"]')) {
    var city = window.LIBRARY_DATA.cities.find(function (c) { return c.id === e.target.value; });
    if (city) trackCityToggled(e.target.value, city.label, e.target.checked);
  }
});

// Input event fires on every slider move (including during drag) — ensures live updates
form.addEventListener('input', function () {
  updateResult();
  updateAllSliderLabels();
});

// Run immediately to show result for initial (default) state
// Module scripts are deferred — DOM is ready when they execute
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
