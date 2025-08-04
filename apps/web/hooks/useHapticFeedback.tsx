'use client'

import { useCallback, useEffect, useState } from 'react'

// Haptic feedback patterns
export enum HapticPattern {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  SELECTION = 'selection',
  IMPACT = 'impact'
}

// Haptic feedback intensities for different patterns
const HAPTIC_INTENSITIES = {
  [HapticPattern.LIGHT]: 10,
  [HapticPattern.MEDIUM]: 25,
  [HapticPattern.HEAVY]: 50,
  [HapticPattern.SUCCESS]: 15,
  [HapticPattern.ERROR]: 40,
  [HapticPattern.WARNING]: 30,
  [HapticPattern.SELECTION]: 5,
  [HapticPattern.IMPACT]: 60
}

// Haptic feedback durations (in milliseconds)
const HAPTIC_DURATIONS = {
  [HapticPattern.LIGHT]: 50,
  [HapticPattern.MEDIUM]: 100,
  [HapticPattern.HEAVY]: 150,
  [HapticPattern.SUCCESS]: 75,
  [HapticPattern.ERROR]: 200,
  [HapticPattern.WARNING]: 125,
  [HapticPattern.SELECTION]: 25,
  [HapticPattern.IMPACT]: 175
}

// Custom vibration patterns for complex feedback
const VIBRATION_PATTERNS = {
  [HapticPattern.SUCCESS]: [50, 50, 50],
  [HapticPattern.ERROR]: [100, 50, 100, 50, 100],
  [HapticPattern.WARNING]: [75, 25, 75],
  [HapticPattern.IMPACT]: [25, 25, 50, 25, 75]
}

interface HapticCapabilities {
  vibrationAPI: boolean
  webVibrationAPI: boolean
  reducedMotion: boolean
  touchSupport: boolean
}

interface UseHapticFeedbackOptions {
  respectReducedMotion?: boolean
  fallbackToVisual?: boolean
  debugMode?: boolean
}

interface HapticFeedbackReturn {
  triggerHaptic: (pattern: HapticPattern) => Promise<boolean>
  isSupported: boolean
  capabilities: HapticCapabilities
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
}

export function useHapticFeedback(options: UseHapticFeedbackOptions = {}): HapticFeedbackReturn {
  const {
    respectReducedMotion = true,
    fallbackToVisual = false,
    debugMode = false
  } = options

  const [capabilities, setCapabilities] = useState<HapticCapabilities>({
    vibrationAPI: false,
    webVibrationAPI: false,
    reducedMotion: false,
    touchSupport: false
  })

  const [isEnabled, setIsEnabled] = useState<boolean>(true)

  // Detect haptic capabilities on mount
  useEffect(() => {
    const detectCapabilities = () => {
      const newCapabilities: HapticCapabilities = {
        vibrationAPI: 'vibrate' in navigator,
        webVibrationAPI: 'vibrate' in navigator && typeof navigator.vibrate === 'function',
        reducedMotion: false,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
      }

      // Check for reduced motion preference
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        newCapabilities.reducedMotion = mediaQuery.matches

        // Listen for changes in reduced motion preference
        const handleMotionChange = (event: MediaQueryListEvent) => {
          setCapabilities(prev => ({
            ...prev,
            reducedMotion: event.matches
          }))
        }

        mediaQuery.addEventListener('change', handleMotionChange)
        
        // Cleanup listener
        return () => {
          mediaQuery.removeEventListener('change', handleMotionChange)
        }
      }

      setCapabilities(newCapabilities)
    }

    detectCapabilities()
  }, [])

  // Load user preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('haptic-feedback-enabled')
      if (stored !== null) {
        setIsEnabled(JSON.parse(stored))
      }
    }
  }, [])

  // Save user preference to localStorage
  const setEnabledWithStorage = useCallback((enabled: boolean) => {
    setIsEnabled(enabled)
    if (typeof window !== 'undefined') {
      localStorage.setItem('haptic-feedback-enabled', JSON.stringify(enabled))
    }
  }, [])

  // Check if haptic feedback should be triggered
  const shouldTriggerHaptic = useCallback((): boolean => {
    if (!isEnabled) return false
    if (respectReducedMotion && capabilities.reducedMotion) return false
    if (!capabilities.touchSupport) return false
    return capabilities.vibrationAPI || capabilities.webVibrationAPI
  }, [isEnabled, respectReducedMotion, capabilities])

  // Trigger haptic feedback with fallbacks
  const triggerHaptic = useCallback(async (pattern: HapticPattern): Promise<boolean> => {
    if (debugMode) {
      console.log(`[Haptic] Attempting to trigger pattern: ${pattern}`)
    }

    if (!shouldTriggerHaptic()) {
      if (debugMode) {
        console.log('[Haptic] Haptic feedback disabled or not supported')
      }
      return false
    }

    try {
      // Try modern Vibration API first
      if (capabilities.webVibrationAPI && navigator.vibrate) {
        let vibrationPattern: number | number[]

        // Use custom patterns for complex feedback
        if (VIBRATION_PATTERNS[pattern]) {
          vibrationPattern = VIBRATION_PATTERNS[pattern]
        } else {
          // Use simple duration-based vibration
          vibrationPattern = HAPTIC_DURATIONS[pattern] || 50
        }

        const success = navigator.vibrate(vibrationPattern)
        
        if (debugMode) {
          console.log(`[Haptic] Vibration API result: ${success}`)
        }

        return success
      }

      // Fallback to basic vibration
      if (capabilities.vibrationAPI && 'vibrate' in navigator) {
        const duration = HAPTIC_DURATIONS[pattern] || 50
        const success = (navigator as any).vibrate(duration)
        
        if (debugMode) {
          console.log(`[Haptic] Basic vibration result: ${success}`)
        }

        return success
      }

      if (debugMode) {
        console.log('[Haptic] No vibration API available')
      }

      return false
    } catch (error) {
      if (debugMode) {
        console.error('[Haptic] Error triggering haptic feedback:', error)
      }
      return false
    }
  }, [shouldTriggerHaptic, capabilities, debugMode])

  // Convenience methods for common patterns
  const triggerLight = useCallback(() => triggerHaptic(HapticPattern.LIGHT), [triggerHaptic])
  const triggerMedium = useCallback(() => triggerHaptic(HapticPattern.MEDIUM), [triggerHaptic])
  const triggerHeavy = useCallback(() => triggerHaptic(HapticPattern.HEAVY), [triggerHaptic])
  const triggerSuccess = useCallback(() => triggerHaptic(HapticPattern.SUCCESS), [triggerHaptic])
  const triggerError = useCallback(() => triggerHaptic(HapticPattern.ERROR), [triggerHaptic])
  const triggerWarning = useCallback(() => triggerHaptic(HapticPattern.WARNING), [triggerHaptic])
  const triggerSelection = useCallback(() => triggerHaptic(HapticPattern.SELECTION), [triggerHaptic])
  const triggerImpact = useCallback(() => triggerHaptic(HapticPattern.IMPACT), [triggerHaptic])

  const isSupported = capabilities.vibrationAPI || capabilities.webVibrationAPI

  return {
    triggerHaptic,
    isSupported,
    capabilities,
    isEnabled,
    setEnabled: setEnabledWithStorage,
    // Convenience methods
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerError,
    triggerWarning,
    triggerSelection,
    triggerImpact
  } as HapticFeedbackReturn & {
    triggerLight: () => Promise<boolean>
    triggerMedium: () => Promise<boolean>
    triggerHeavy: () => Promise<boolean>
    triggerSuccess: () => Promise<boolean>
    triggerError: () => Promise<boolean>
    triggerWarning: () => Promise<boolean>
    triggerSelection: () => Promise<boolean>
    triggerImpact: () => Promise<boolean>
  }
}

// Hook for button haptic feedback
export function useButtonHaptic(pattern: HapticPattern = HapticPattern.LIGHT) {
  const { triggerHaptic, isSupported } = useHapticFeedback()

  const handlePress = useCallback((event?: React.MouseEvent | React.TouchEvent) => {
    // Only trigger on touch events or when no event is provided
    if (!event || event.type === 'touchstart' || event.type === 'touchend') {
      triggerHaptic(pattern)
    }
  }, [triggerHaptic, pattern])

  return {
    onPress: handlePress,
    isSupported
  }
}

// Hook for form haptic feedback
export function useFormHaptic() {
  const { triggerSuccess, triggerError, triggerWarning, triggerSelection } = useHapticFeedback()

  return {
    onFieldFocus: () => triggerSelection(),
    onFieldChange: () => triggerSelection(),
    onValidationError: () => triggerError(),
    onValidationWarning: () => triggerWarning(),
    onFormSubmitSuccess: () => triggerSuccess(),
    onFormSubmitError: () => triggerError()
  }
}

// Context provider for global haptic settings
import React, { createContext, useContext } from 'react'

interface HapticContextValue {
  isGloballyEnabled: boolean
  setGloballyEnabled: (enabled: boolean) => void
  globalCapabilities: HapticCapabilities
}

const HapticContext = createContext<HapticContextValue | null>(null)

interface HapticProviderProps {
  children: React.ReactNode
  defaultEnabled?: boolean
}

export function HapticProvider({ children, defaultEnabled = true }: HapticProviderProps) {
  const { isEnabled, setEnabled, capabilities } = useHapticFeedback()

  const contextValue: HapticContextValue = {
    isGloballyEnabled: isEnabled,
    setGloballyEnabled: setEnabled,
    globalCapabilities: capabilities
  }

  return (
    <HapticContext.Provider value={contextValue}>
      {children}
    </HapticContext.Provider>
  )
}

export function useHapticContext(): HapticContextValue {
  const context = useContext(HapticContext)
  if (!context) {
    throw new Error('useHapticContext must be used within a HapticProvider')
  }
  return context
}