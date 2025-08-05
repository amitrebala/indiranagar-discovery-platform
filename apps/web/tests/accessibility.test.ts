import { describe, it, expect } from 'vitest'
import {
  getContrastSafeTextClass,
  getTimeBasedOverlayOpacity,
  getWeatherAwareTextColor,
  touchTargetSpecs,
  getFocusClasses,
  colorTokens,
} from '@/lib/utils/accessibility'

describe('Accessibility Utilities', () => {
  describe('getContrastSafeTextClass', () => {
    it('should return correct classes for light background', () => {
      expect(getContrastSafeTextClass('light', 'primary')).toBe('text-gray-900 font-semibold')
      expect(getContrastSafeTextClass('light', 'secondary')).toBe('text-gray-700')
      expect(getContrastSafeTextClass('light', 'tertiary')).toBe('text-gray-600')
    })

    it('should return correct classes for dark background', () => {
      expect(getContrastSafeTextClass('dark', 'primary')).toBe('text-white font-semibold')
      expect(getContrastSafeTextClass('dark', 'secondary')).toBe('text-gray-200')
      expect(getContrastSafeTextClass('dark', 'tertiary')).toBe('text-gray-300')
    })

    it('should return correct classes for gradient background', () => {
      expect(getContrastSafeTextClass('gradient', 'primary')).toBe('text-white font-bold drop-shadow-lg')
      expect(getContrastSafeTextClass('gradient', 'secondary')).toBe('text-white/95 drop-shadow-md')
      expect(getContrastSafeTextClass('gradient', 'tertiary')).toBe('text-white/90 drop-shadow')
    })
  })

  describe('getTimeBasedOverlayOpacity', () => {
    it('should return correct opacity for different times of day', () => {
      expect(getTimeBasedOverlayOpacity('morning')).toBe(0.3)
      expect(getTimeBasedOverlayOpacity('afternoon')).toBe(0.2)
      expect(getTimeBasedOverlayOpacity('evening')).toBe(0.4)
      expect(getTimeBasedOverlayOpacity('night')).toBe(0.5)
    })
  })

  describe('getWeatherAwareTextColor', () => {
    it('should return correct text color for weather conditions', () => {
      expect(getWeatherAwareTextColor('sunny')).toBe('text-gray-900')
      expect(getWeatherAwareTextColor('rainy')).toBe('text-white')
      expect(getWeatherAwareTextColor('cloudy')).toBe('text-gray-800')
      expect(getWeatherAwareTextColor('snowy')).toBe('text-white')
      expect(getWeatherAwareTextColor('stormy')).toBe('text-white')
    })
  })

  describe('touchTargetSpecs', () => {
    it('should have correct minimum dimensions for WCAG compliance', () => {
      expect(touchTargetSpecs.minWidth).toBe('48px')
      expect(touchTargetSpecs.minHeight).toBe('48px')
      expect(touchTargetSpecs.padding).toBe('12px')
      expect(touchTargetSpecs.margin).toBe('4px')
    })
  })

  describe('getFocusClasses', () => {
    it('should return correct focus classes for different variants', () => {
      const primaryClasses = getFocusClasses('primary')
      expect(primaryClasses).toContain('focus-visible:outline-primary-600')
      expect(primaryClasses).toContain('focus:ring-primary-600')

      const secondaryClasses = getFocusClasses('secondary')
      expect(secondaryClasses).toContain('focus-visible:outline-gray-600')
      expect(secondaryClasses).toContain('focus:ring-gray-600')

      const dangerClasses = getFocusClasses('danger')
      expect(dangerClasses).toContain('focus-visible:outline-red-600')
      expect(dangerClasses).toContain('focus:ring-red-600')
    })
  })

  describe('colorTokens', () => {
    it('should have correct color tokens for hero section', () => {
      expect(colorTokens.hero.text).toBe('#FFFFFF')
      expect(colorTokens.hero.textShadow).toBe('0 2px 4px rgba(0,0,0,0.5)')
      expect(colorTokens.hero.overlay).toBe('rgba(0,0,0,0.4)')
    })

    it('should have correct color tokens for CTAs', () => {
      expect(colorTokens.cta.primary.bg).toBe('#DC2626')
      expect(colorTokens.cta.primary.text).toBe('#FFFFFF')
      expect(colorTokens.cta.primary.hover).toBe('#B91C1C')
      expect(colorTokens.cta.primary.focus).toBe('#7F1D1D')
    })

    it('should have correct interactive element specifications', () => {
      expect(colorTokens.interactive.minWidth).toBe('48px')
      expect(colorTokens.interactive.minHeight).toBe('48px')
      expect(colorTokens.interactive.padding).toBe('12px')
      expect(colorTokens.interactive.margin).toBe('4px')
    })
  })
})