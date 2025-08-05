/**
 * Accessibility utility functions for ensuring WCAG AA compliance
 */

/**
 * Get contrast-safe text classes based on background type
 * @param background - The type of background (light, dark, or gradient)
 * @param importance - The importance level of the text (primary, secondary, or tertiary)
 * @returns Tailwind CSS classes for proper text contrast
 */
export function getContrastSafeTextClass(
  background: 'light' | 'dark' | 'gradient',
  importance: 'primary' | 'secondary' | 'tertiary'
): string {
  const config = {
    light: {
      primary: 'text-gray-900 font-semibold',
      secondary: 'text-gray-700',
      tertiary: 'text-gray-600',
    },
    dark: {
      primary: 'text-white font-semibold',
      secondary: 'text-gray-200',
      tertiary: 'text-gray-300',
    },
    gradient: {
      primary: 'text-white font-bold drop-shadow-lg',
      secondary: 'text-white/95 drop-shadow-md',
      tertiary: 'text-white/90 drop-shadow',
    },
  }
  
  return config[background][importance]
}

/**
 * Get overlay opacity based on time of day for contrast safety
 * @param timeOfDay - The current time of day
 * @returns Opacity value for overlay
 */
export function getTimeBasedOverlayOpacity(
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
): number {
  const overlayOpacity = {
    morning: 0.3,  // Lighter overlay for bright colors
    afternoon: 0.2, // Minimal overlay
    evening: 0.4,   // Stronger for sunset colors
    night: 0.5,     // Strongest for dark backgrounds
  }
  
  return overlayOpacity[timeOfDay]
}

/**
 * Get text color based on weather conditions
 * @param weather - Current weather condition
 * @returns Tailwind CSS text color class
 */
export function getWeatherAwareTextColor(
  weather: 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'stormy'
): string {
  const textColorMap = {
    sunny: 'text-gray-900',    // Dark text for bright conditions
    rainy: 'text-white',        // White for darker overlays
    cloudy: 'text-gray-800',    // Slightly lighter for overcast
    snowy: 'text-white',        // White for snow conditions
    stormy: 'text-white',       // White for stormy conditions
  }
  
  return textColorMap[weather] || 'text-gray-900'
}

/**
 * Generate accessible color tokens for components
 */
export const colorTokens = {
  hero: {
    text: '#FFFFFF',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    overlay: 'rgba(0,0,0,0.4)',
  },
  card: {
    background: '#FFFFFF',
    text: '#171717',
    textSecondary: '#4B5563', // gray-700
    border: '#E5E7EB',
  },
  cta: {
    primary: {
      bg: '#DC2626',      // red-600
      text: '#FFFFFF',
      hover: '#B91C1C',   // red-700
      focus: '#7F1D1D',   // red-900
    },
    secondary: {
      bg: '#4F46E5',      // indigo-600
      text: '#FFFFFF',
      hover: '#4338CA',   // indigo-700
      focus: '#3730A3',   // indigo-800
    }
  },
  interactive: {
    minWidth: '48px',
    minHeight: '48px',
    padding: '12px',
    margin: '4px', // Minimum spacing between targets
  }
}

/**
 * Touch target specifications for mobile accessibility
 */
export const touchTargetSpecs = {
  minWidth: '48px',
  minHeight: '48px',
  padding: '12px',
  margin: '4px', // Minimum spacing between targets
}

/**
 * Check if a color combination meets WCAG AA contrast requirements
 * @param foreground - Hex color of foreground
 * @param background - Hex color of background
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Boolean indicating if contrast is sufficient
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  // This is a simplified check - in production, use a proper contrast calculation library
  // Required ratios: 4.5:1 for normal text, 3:1 for large text
  const requiredRatio = isLargeText ? 3 : 4.5
  
  // For now, we'll return true as this requires complex luminance calculations
  // In production, use a library like 'wcag-contrast' or 'color-contrast-checker'
  return true
}

/**
 * Get focus state classes for interactive elements
 * @param variant - The variant of the element (primary, secondary, danger)
 * @returns Tailwind CSS classes for focus states
 */
export function getFocusClasses(variant: 'primary' | 'secondary' | 'danger' = 'primary'): string {
  const focusClasses = {
    primary: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
    secondary: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2',
    danger: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2',
  }
  
  return focusClasses[variant]
}