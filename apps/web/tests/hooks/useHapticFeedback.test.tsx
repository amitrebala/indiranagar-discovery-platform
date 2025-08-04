import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useHapticFeedback, HapticPattern, useButtonHaptic, useFormHaptic } from '@/hooks/useHapticFeedback'

// Mock navigator.vibrate
const mockVibrate = vi.fn()
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: mockVibrate,
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia for reduced motion
const mockMatchMedia = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

// Mock maxTouchPoints for touch support detection
Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  value: 0,
})

describe('useHapticFeedback', () => {
  beforeEach(() => {
    mockVibrate.mockClear()
    mockVibrate.mockReturnValue(true)
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    mockMatchMedia.mockClear()
    
    // Default matchMedia implementation
    mockMatchMedia.mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    
    // Reset touch support
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 1,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Capability Detection', () => {
    it('detects vibration API support correctly', () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      expect(result.current.capabilities.vibrationAPI).toBe(true)
      expect(result.current.capabilities.webVibrationAPI).toBe(true)
      expect(result.current.isSupported).toBe(true)
    })

    it('detects touch support correctly', () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 2,
      })
      
      const { result } = renderHook(() => useHapticFeedback())
      
      expect(result.current.capabilities.touchSupport).toBe(true)
    })

    it('detects reduced motion preference', () => {
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      const { result } = renderHook(() => useHapticFeedback())
      
      expect(result.current.capabilities.reducedMotion).toBe(true)
    })

    it('handles systems without vibration API', () => {
      // Remove vibrate method
      Object.defineProperty(navigator, 'vibrate', {
        writable: true,
        value: undefined,
      })
      
      const { result } = renderHook(() => useHapticFeedback())
      
      expect(result.current.capabilities.vibrationAPI).toBe(false)
      expect(result.current.capabilities.webVibrationAPI).toBe(false)
      expect(result.current.isSupported).toBe(false)
    })
  })

  describe('Haptic Pattern Triggering', () => {
    it('triggers light haptic pattern correctly', async () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      await act(async () => {
        const success = await result.current.triggerHaptic(HapticPattern.LIGHT)
        expect(success).toBe(true)
      })
      
      expect(mockVibrate).toHaveBeenCalledWith(50) // Light pattern duration
    })

    it('triggers medium haptic pattern correctly', async () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      await act(async () => {
        await result.current.triggerHaptic(HapticPattern.MEDIUM)
      })
      
      expect(mockVibrate).toHaveBeenCalledWith(100) // Medium pattern duration
    })

    it('triggers heavy haptic pattern correctly', async () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      await act(async () => {
        await result.current.triggerHaptic(HapticPattern.HEAVY)
      })
      
      expect(mockVibrate).toHaveBeenCalledWith(150) // Heavy pattern duration
    })

    it('triggers complex vibration patterns for special cases', async () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      await act(async () => {
        await result.current.triggerHaptic(HapticPattern.SUCCESS)
      })
      
      expect(mockVibrate).toHaveBeenCalledWith([50, 50, 50]) // Success pattern
    })

    it('triggers error pattern with correct vibration', async () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      await act(async () => {
        await result.current.triggerHaptic(HapticPattern.ERROR)
      })
      
      expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100, 50, 100]) // Error pattern
    })
  })

  describe('Accessibility and Preferences', () => {
    it('respects reduced motion preference when enabled', async () => {
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      const { result } = renderHook(() => useHapticFeedback({ respectReducedMotion: true }))
      
      await act(async () => {
        const success = await result.current.triggerHaptic(HapticPattern.LIGHT)
        expect(success).toBe(false) // Should not trigger
      })
      
      expect(mockVibrate).not.toHaveBeenCalled()
    })

    it('ignores reduced motion when respectReducedMotion is false', async () => {
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      const { result } = renderHook(() => useHapticFeedback({ respectReducedMotion: false }))
      
      await act(async () => {
        const success = await result.current.triggerHaptic(HapticPattern.LIGHT)
        expect(success).toBe(true) // Should trigger despite reduced motion
      })
      
      expect(mockVibrate).toHaveBeenCalled()
    })

    it('does not trigger haptic feedback on non-touch devices', async () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 0,
      })
      
      // Also mock the 'ontouchstart' property to be false
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        value: undefined,
      })
      
      const { result } = renderHook(() => useHapticFeedback())
      
      await act(async () => {
        const success = await result.current.triggerHaptic(HapticPattern.LIGHT)
        expect(success).toBe(false)
      })
      
      expect(mockVibrate).not.toHaveBeenCalled()
    })
  })

  describe('User Preferences and Storage', () => {
    it('loads enabled state from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('false')
      
      const { result } = renderHook(() => useHapticFeedback())
      
      expect(result.current.isEnabled).toBe(false)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('haptic-feedback-enabled')
    })

    it('saves enabled state to localStorage', () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      act(() => {
        result.current.setEnabled(false)
      })
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('haptic-feedback-enabled', 'false')
      expect(result.current.isEnabled).toBe(false)
    })

    it('does not trigger haptic feedback when disabled by user', async () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      act(() => {
        result.current.setEnabled(false)
      })
      
      await act(async () => {
        const success = await result.current.triggerHaptic(HapticPattern.LIGHT)
        expect(success).toBe(false)
      })
      
      expect(mockVibrate).not.toHaveBeenCalled()
    })
  })

  describe('Debug Mode', () => {
    it('logs debug information when debug mode is enabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const { result } = renderHook(() => useHapticFeedback({ debugMode: true }))
      
      await act(async () => {
        await result.current.triggerHaptic(HapticPattern.LIGHT)
      })
      
      expect(consoleSpy).toHaveBeenCalledWith('[Haptic] Attempting to trigger pattern: light')
      expect(consoleSpy).toHaveBeenCalledWith('[Haptic] Vibration API result: true')
      
      consoleSpy.mockRestore()
    })

    it('logs when haptic feedback is disabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const { result } = renderHook(() => useHapticFeedback({ debugMode: true }))
      
      act(() => {
        result.current.setEnabled(false)
      })
      
      await act(async () => {
        await result.current.triggerHaptic(HapticPattern.LIGHT)
      })
      
      expect(consoleSpy).toHaveBeenCalledWith('[Haptic] Haptic feedback disabled or not supported')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('handles vibration API errors gracefully', async () => {
      mockVibrate.mockImplementation(() => {
        throw new Error('Vibration failed')
      })
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const { result } = renderHook(() => useHapticFeedback({ debugMode: true }))
      
      await act(async () => {
        const success = await result.current.triggerHaptic(HapticPattern.LIGHT)
        expect(success).toBe(false)
      })
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('[Haptic] Error triggering haptic feedback:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })

    it('returns false when vibration API returns false', async () => {
      mockVibrate.mockReturnValue(false)
      
      const { result } = renderHook(() => useHapticFeedback())
      
      await act(async () => {
        const success = await result.current.triggerHaptic(HapticPattern.LIGHT)
        expect(success).toBe(false)
      })
    })
  })

  describe('Convenience Methods', () => {
    it('provides convenience methods for common patterns', async () => {
      const { result } = renderHook(() => useHapticFeedback())
      
      // Test that convenience methods exist and work
      expect(typeof result.current.triggerLight).toBe('function')
      expect(typeof result.current.triggerMedium).toBe('function')
      expect(typeof result.current.triggerHeavy).toBe('function')
      expect(typeof result.current.triggerSuccess).toBe('function')
      expect(typeof result.current.triggerError).toBe('function')
      
      await act(async () => {
        await result.current.triggerLight()
      })
      
      expect(mockVibrate).toHaveBeenCalledWith(50)
    })
  })
})

describe('useButtonHaptic', () => {
  beforeEach(() => {
    mockVibrate.mockClear()
    mockVibrate.mockReturnValue(true)
  })

  it('provides haptic feedback for button interactions', async () => {
    const { result } = renderHook(() => useButtonHaptic(HapticPattern.MEDIUM))
    
    await act(async () => {
      result.current.onPress()
    })
    
    expect(mockVibrate).toHaveBeenCalledWith(100) // Medium pattern
  })

  it('only triggers on touch events when event is provided', async () => {
    const { result } = renderHook(() => useButtonHaptic())
    
    const mouseEvent = new MouseEvent('click')
    const touchEvent = new TouchEvent('touchstart')
    
    await act(async () => {
      result.current.onPress(mouseEvent as any)
    })
    
    expect(mockVibrate).not.toHaveBeenCalled()
    
    await act(async () => {
      result.current.onPress(touchEvent as any)
    })
    
    expect(mockVibrate).toHaveBeenCalled()
  })
})

describe('useFormHaptic', () => {
  beforeEach(() => {
    mockVibrate.mockClear()
    mockVibrate.mockReturnValue(true)
  })

  it('provides different haptic feedback for form interactions', async () => {
    const { result } = renderHook(() => useFormHaptic())
    
    // Test field focus (selection pattern)
    await act(async () => {
      await result.current.onFieldFocus()
    })
    
    expect(mockVibrate).toHaveBeenCalledWith(25) // Selection pattern
    
    mockVibrate.mockClear()
    
    // Test validation error (error pattern)
    await act(async () => {
      await result.current.onValidationError()
    })
    
    expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100, 50, 100]) // Error pattern
    
    mockVibrate.mockClear()
    
    // Test form submit success (success pattern)
    await act(async () => {
      await result.current.onFormSubmitSuccess()
    })
    
    expect(mockVibrate).toHaveBeenCalledWith([50, 50, 50]) // Success pattern
  })
})

describe('Reduced Motion Integration', () => {
  it('responds to changes in reduced motion preference', () => {
    const mockListener = vi.fn()
    const mockAddEventListener = vi.fn((event, listener) => {
      if (event === 'change') {
        mockListener.mockImplementation(listener)
      }
    })
    
    mockMatchMedia.mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    
    const { result } = renderHook(() => useHapticFeedback())
    
    expect(result.current.capabilities.reducedMotion).toBe(false)
    
    // Simulate reduced motion preference change
    act(() => {
      mockListener({ matches: true })
    })
    
    expect(result.current.capabilities.reducedMotion).toBe(true)
  })
})

describe('Browser Compatibility', () => {
  it('works in server-side rendering environments', () => {
    // Mock window as undefined (SSR environment)
    const originalWindow = global.window
    delete (global as any).window
    
    expect(() => {
      renderHook(() => useHapticFeedback())
    }).not.toThrow()
    
    // Restore window
    global.window = originalWindow
  })

  it('handles missing localStorage gracefully', () => {
    const originalLocalStorage = window.localStorage
    delete (window as any).localStorage
    
    expect(() => {
      const { result } = renderHook(() => useHapticFeedback())
      
      act(() => {
        result.current.setEnabled(false)
      })
    }).not.toThrow()
    
    // Restore localStorage
    window.localStorage = originalLocalStorage
  })
})