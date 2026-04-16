// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  trackStaffingSelected,
  trackDigitalSliderChanged,
  trackPhysicalSliderChanged,
  trackCityToggled,
  trackBreakdownOpened,
  trackSharedUrlLoaded,
} from '../src/js/lib/analytics.js';

describe('analytics wrapper', () => {
  beforeEach(() => {
    window.gtag = vi.fn();
  });

  afterEach(() => {
    delete window.gtag;
  });

  describe('trackStaffingSelected', () => {
    it('calls gtag with staffing_selected event and correct params', () => {
      trackStaffingSelected('44hr-pt', 'Standard');
      expect(window.gtag).toHaveBeenCalledWith('event', 'staffing_selected', {
        level_id: '44hr-pt',
        label: 'Standard',
      });
    });

    it('does not throw when window.gtag is undefined', () => {
      delete window.gtag;
      expect(() => trackStaffingSelected('44hr-pt', 'Standard')).not.toThrow();
    });
  });

  describe('trackDigitalSliderChanged', () => {
    it('calls gtag with digital_slider_changed event and value_dollars', () => {
      trackDigitalSliderChanged(55000);
      expect(window.gtag).toHaveBeenCalledWith('event', 'digital_slider_changed', {
        value_dollars: 55000,
      });
    });

    it('does not throw when window.gtag is undefined', () => {
      delete window.gtag;
      expect(() => trackDigitalSliderChanged(55000)).not.toThrow();
    });
  });

  describe('trackPhysicalSliderChanged', () => {
    it('calls gtag with physical_slider_changed event and value_dollars', () => {
      trackPhysicalSliderChanged(10000);
      expect(window.gtag).toHaveBeenCalledWith('event', 'physical_slider_changed', {
        value_dollars: 10000,
      });
    });

    it('does not throw when window.gtag is undefined', () => {
      delete window.gtag;
      expect(() => trackPhysicalSliderChanged(10000)).not.toThrow();
    });
  });

  describe('trackCityToggled', () => {
    it('calls gtag with city_toggled event and correct params', () => {
      trackCityToggled('providence', 'Providence', true);
      expect(window.gtag).toHaveBeenCalledWith('event', 'city_toggled', {
        city_id: 'providence',
        city_label: 'Providence',
        checked: true,
      });
    });

    it('does not throw when window.gtag is undefined', () => {
      delete window.gtag;
      expect(() => trackCityToggled('providence', 'Providence', true)).not.toThrow();
    });
  });

  describe('trackBreakdownOpened', () => {
    it('calls gtag with breakdown_opened event and empty params', () => {
      trackBreakdownOpened();
      expect(window.gtag).toHaveBeenCalledWith('event', 'breakdown_opened', {});
    });

    it('does not throw when window.gtag is undefined', () => {
      delete window.gtag;
      expect(() => trackBreakdownOpened()).not.toThrow();
    });
  });

  describe('trackSharedUrlLoaded', () => {
    it('calls gtag with shared_url_loaded event and params_detected: true', () => {
      trackSharedUrlLoaded();
      expect(window.gtag).toHaveBeenCalledWith('event', 'shared_url_loaded', {
        params_detected: true,
      });
    });

    it('does not throw when window.gtag is undefined', () => {
      delete window.gtag;
      expect(() => trackSharedUrlLoaded()).not.toThrow();
    });
  });

  describe('fireEvent guard', () => {
    it('does not call gtag when it is not a function (is a string)', () => {
      window.gtag = 'not-a-function';
      trackStaffingSelected('44hr-pt', 'Standard');
      // No assertion on calls since gtag is not a function — just verify no throw
    });
  });
});
