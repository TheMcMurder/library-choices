/**
 * GA4 analytics event wrapper.
 * Guards all calls with typeof window.gtag === 'function' so this module
 * is safe to import in Node.js test environments and before the GA4 snippet loads.
 */

/**
 * Internal fire-and-forget wrapper.
 *
 * @param {string} eventName - GA4 event name
 * @param {Object} [params]  - event parameters
 */
function fireEvent(eventName, params) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params || {});
  }
}

/**
 * Track a staffing level selection.
 *
 * @param {string} levelId - staffing level ID (e.g. '44hr-pt')
 * @param {string} label   - human-readable label (e.g. 'Standard')
 */
export function trackStaffingSelected(levelId, label) {
  fireEvent('staffing_selected', { level_id: levelId, label: label });
}

/**
 * Track a digital collections slider change.
 *
 * @param {number} valueDollars - resolved dollar amount for the selected tier
 */
export function trackDigitalSliderChanged(valueDollars) {
  fireEvent('digital_slider_changed', { value_dollars: valueDollars });
}

/**
 * Track a physical collections slider change.
 *
 * @param {number} valueDollars - resolved dollar amount for the selected tier
 */
export function trackPhysicalSliderChanged(valueDollars) {
  fireEvent('physical_slider_changed', { value_dollars: valueDollars });
}

/**
 * Track a city participation toggle.
 *
 * @param {string}  cityId    - city identifier (e.g. 'providence')
 * @param {string}  cityLabel - human-readable city name (e.g. 'Providence')
 * @param {boolean} checked   - true = city added, false = city removed
 */
export function trackCityToggled(cityId, cityLabel, checked) {
  fireEvent('city_toggled', { city_id: cityId, city_label: cityLabel, checked: checked });
}

/**
 * Track when the formula breakdown popover is opened.
 */
export function trackBreakdownOpened() {
  fireEvent('breakdown_opened', {});
}

/**
 * Track when a shared URL is loaded (URL contains encoded scenario params).
 */
export function trackSharedUrlLoaded() {
  fireEvent('shared_url_loaded', { params_detected: true });
}
