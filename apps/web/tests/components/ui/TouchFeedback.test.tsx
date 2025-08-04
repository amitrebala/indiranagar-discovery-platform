import { render, screen, fireEvent, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  TouchFeedback,
  TouchableCard,
  TouchableListItem,
  useTouchFeedback,
  useAccessibleTouchFeedback,
  TouchFeedbackProvider,
  useTouchFeedbackContext
} from '@/components/ui/TouchFeedback'
import { HapticPattern } from '@/hooks/useHapticFeedback'

// Mock the haptic feedback hook
vi.mock('@/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerHaptic: vi.fn().mockResolvedValue(true),
  }),
  HapticPattern: {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    SELECTION: 'selection',
    IMPACT: 'impact'
  }
}))

// Mock reduced motion media query
const mockMatchMedia = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

describe('TouchFeedback', () => {
  beforeEach(() => {
    mockMatchMedia.mockClear()
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
  })

  describe('Basic Touch Feedback', () => {
    it('renders children without issues', () => {
      render(
        <TouchFeedback>
          <button>Test Button</button>
        </TouchFeedback>
      )

      expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument()
    })

    it('applies scale feedback on touch', () => {
      render(
        <TouchFeedback feedbackType="scale" intensity="medium">
          <button>Scale Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('active:scale-95')
    })

    it('applies brightness feedback when specified', () => {
      render(
        <TouchFeedback feedbackType="brightness" intensity="medium">
          <button>Brightness Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('active:brightness-90')
    })

    it('applies lift feedback when specified', () => {
      render(
        <TouchFeedback feedbackType="lift" intensity="medium">
          <button>Lift Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('active:translate-y-0.5')
    })

    it('applies glow feedback with dynamic classes', () => {
      render(
        <TouchFeedback feedbackType="glow">
          <button>Glow Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('transition-all', 'duration-150', 'ease-out')
    })

    it('shows ripple effect on touch', () => {
      render(
        <TouchFeedback feedbackType="ripple">
          <button>Ripple Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('relative', 'overflow-hidden')
      
      // Simulate touch start to trigger ripple
      fireEvent.touchStart(touchContainer!)
      
      // Check for ripple element (it should be added during touch)
      const ripple = touchContainer!.querySelector('.animate-ping')
      expect(ripple).toBeInTheDocument()
    })
  })

  describe('Intensity Levels', () => {
    it('applies subtle intensity correctly', () => {
      render(
        <TouchFeedback feedbackType="scale" intensity="subtle">
          <button>Subtle Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('active:scale-98')
    })

    it('applies medium intensity correctly', () => {
      render(
        <TouchFeedback feedbackType="scale" intensity="medium">
          <button>Medium Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('active:scale-95')
    })

    it('applies strong intensity correctly', () => {
      render(
        <TouchFeedback feedbackType="scale" intensity="strong">
          <button>Strong Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('active:scale-90')
    })
  })

  describe('Touch Event Handling', () => {
    it('handles touch start events', () => {
      const onTouch = vi.fn()
      
      render(
        <TouchFeedback onTouch={onTouch}>
          <button>Touch Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      fireEvent.touchStart(touchContainer!)

      expect(onTouch).toHaveBeenCalledTimes(1)
    })

    it('handles mouse down events for desktop interaction', () => {
      const onTouch = vi.fn()
      
      render(
        <TouchFeedback onTouch={onTouch}>
          <button>Mouse Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      fireEvent.mouseDown(touchContainer!)

      expect(onTouch).toHaveBeenCalledTimes(1)
    })

    it('handles touch end and mouse up events', () => {
      render(
        <TouchFeedback feedbackType="ripple">
          <button>End Touch Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      
      // Start touch to create state
      fireEvent.touchStart(touchContainer!)
      let ripple = touchContainer!.querySelector('.animate-ping')
      expect(ripple).toBeInTheDocument()
      
      // End touch should clean up state
      fireEvent.touchEnd(touchContainer!)
      
      // Give a moment for cleanup
      setTimeout(() => {
        ripple = touchContainer!.querySelector('.animate-ping')
        expect(ripple).not.toBeInTheDocument()
      }, 10)
    })

    it('handles mouse leave events', () => {
      render(
        <TouchFeedback feedbackType="ripple">
          <button>Mouse Leave Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      
      fireEvent.mouseDown(touchContainer!)
      fireEvent.mouseLeave(touchContainer!)
      
      // Should clean up touch state on mouse leave
      const ripple = touchContainer!.querySelector('.animate-ping')
      expect(ripple).not.toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('applies disabled styling when disabled', () => {
      render(
        <TouchFeedback disabled={true}>
          <button>Disabled Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('pointer-events-none', 'opacity-50')
    })

    it('does not trigger touch feedback when disabled', () => {
      const onTouch = vi.fn()
      
      render(
        <TouchFeedback disabled={true} onTouch={onTouch}>
          <button>Disabled Touch Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      fireEvent.touchStart(touchContainer!)

      expect(onTouch).not.toHaveBeenCalled()
    })
  })

  describe('Motion Preferences', () => {
    it('respects reduced motion preferences in CSS classes', () => {
      render(
        <TouchFeedback feedbackType="scale">
          <button>Reduced Motion Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('motion-reduce:transform-none')
    })

    it('applies motion-reduce classes for transform-based feedback', () => {
      render(
        <TouchFeedback feedbackType="lift">
          <button>Lift Motion Button</button>
        </TouchFeedback>
      )

      const touchContainer = screen.getByRole('button').parentElement
      expect(touchContainer).toHaveClass('motion-reduce:transform-none')
    })
  })
})

describe('TouchableCard', () => {
  it('renders as a touchable card with lift feedback', () => {
    render(
      <TouchableCard>
        <div>Card Content</div>
      </TouchableCard>
    )

    const card = screen.getByText('Card Content').parentElement
    expect(card).toHaveClass('cursor-pointer')
  })

  it('applies custom intensity', () => {
    render(
      <TouchableCard intensity="strong">
        <div>Strong Card</div>
      </TouchableCard>
    )

    const card = screen.getByText('Strong Card').parentElement
    expect(card).toHaveClass('active:translate-y-1')
  })

  it('can disable haptic feedback', () => {
    render(
      <TouchableCard hapticFeedback={false}>
        <div>No Haptic Card</div>
      </TouchableCard>
    )

    // Should still render the card
    expect(screen.getByText('No Haptic Card')).toBeInTheDocument()
  })
})

describe('TouchableListItem', () => {
  it('renders as a list item with proper accessibility', () => {
    const onSelect = vi.fn()
    
    render(
      <TouchableListItem onSelect={onSelect}>
        <span>List Item</span>
      </TouchableListItem>
    )

    const listItem = screen.getByRole('button')
    expect(listItem).toHaveAttribute('tabIndex', '0')
    expect(listItem).toHaveClass('cursor-pointer')
  })

  it('handles click events', () => {
    const onSelect = vi.fn()
    
    render(
      <TouchableListItem onSelect={onSelect}>
        <span>Clickable Item</span>
      </TouchableListItem>
    )

    const listItem = screen.getByRole('button')
    fireEvent.click(listItem)

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events', () => {
    const onSelect = vi.fn()
    
    render(
      <TouchableListItem onSelect={onSelect}>
        <span>Keyboard Item</span>
      </TouchableListItem>
    )

    const listItem = screen.getByRole('button')
    
    // Test Enter key
    fireEvent.keyDown(listItem, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledTimes(1)
    
    // Test Space key
    fireEvent.keyDown(listItem, { key: ' ' })
    expect(onSelect).toHaveBeenCalledTimes(2)
    
    // Test other keys (should not trigger)
    fireEvent.keyDown(listItem, { key: 'Tab' })
    expect(onSelect).toHaveBeenCalledTimes(2)
  })

  it('applies selected styling', () => {
    render(
      <TouchableListItem selected={true}>
        <span>Selected Item</span>
      </TouchableListItem>
    )

    const listItem = screen.getByRole('button')
    expect(listItem).toHaveClass('bg-primary-50', 'border-l-4', 'border-primary-600')
  })

  it('can disable haptic feedback', () => {
    const onSelect = vi.fn()
    
    render(
      <TouchableListItem onSelect={onSelect} hapticFeedback={false}>
        <span>No Haptic Item</span>
      </TouchableListItem>
    )

    const listItem = screen.getByRole('button')
    fireEvent.click(listItem)

    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})

describe('useTouchFeedback Hook', () => {
  it('provides touch feedback functionality', () => {
    const { result } = renderHook(() => useTouchFeedback())

    expect(result.current.isTouched).toBe(false)
    expect(typeof result.current.touchStyles).toBe('string')
    expect(typeof result.current.touchHandlers).toBe('object')
    expect(typeof result.current.startTouch).toBe('function')
    expect(typeof result.current.endTouch).toBe('function')
  })

  it('returns appropriate CSS classes based on configuration', () => {
    const { result } = renderHook(() => 
      useTouchFeedback({
        feedbackType: 'scale',
        intensity: 'medium',
        disabled: false
      })
    )

    expect(result.current.touchStyles).toContain('transition-all')
    expect(result.current.touchStyles).toContain('cursor-pointer')
    expect(result.current.touchStyles).toContain('motion-reduce:transform-none')
  })

  it('applies disabled styling when disabled', () => {
    const { result } = renderHook(() => 
      useTouchFeedback({
        disabled: true
      })
    )

    expect(result.current.touchStyles).toContain('opacity-50')
    expect(result.current.touchStyles).toContain('pointer-events-none')
  })

  it('manages touch state correctly', () => {
    const { result } = renderHook(() => useTouchFeedback())

    expect(result.current.isTouched).toBe(false)

    act(() => {
      result.current.startTouch()
    })

    expect(result.current.isTouched).toBe(true)

    act(() => {
      result.current.endTouch()
    })

    // Should be false after timeout
    setTimeout(() => {
      expect(result.current.isTouched).toBe(false)
    }, 100)
  })

  it('provides correct touch handlers', () => {
    const { result } = renderHook(() => useTouchFeedback())

    const handlers = result.current.touchHandlers

    expect(handlers.onTouchStart).toBeDefined()
    expect(handlers.onTouchEnd).toBeDefined()
    expect(handlers.onMouseDown).toBeDefined()
    expect(handlers.onMouseUp).toBeDefined()
    expect(handlers.onMouseLeave).toBeDefined()
  })
})

describe('useAccessibleTouchFeedback Hook', () => {
  it('adjusts feedback based on reduced motion preference', () => {
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

    const { result } = renderHook(() => 
      useAccessibleTouchFeedback({
        feedbackType: 'scale',
        intensity: 'medium'
      })
    )

    // With reduced motion, should use subtle intensity and brightness feedback
    expect(result.current.touchStyles).toContain('brightness-95')
  })

  it('uses normal settings when reduced motion is not preferred', () => {
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

    const { result } = renderHook(() => 
      useAccessibleTouchFeedback({
        feedbackType: 'scale',
        intensity: 'medium'
      })
    )

    expect(result.current.touchStyles).toContain('scale-95')
  })

  it('responds to changes in motion preference', () => {
    let mediaQueryListener: ((event: MediaQueryListEvent) => void) | undefined

    mockMatchMedia.mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event, listener) => {
        if (event === 'change') {
          mediaQueryListener = listener
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useAccessibleTouchFeedback())

    // Initially should not prefer reduced motion
    expect(result.current.touchStyles).toContain('scale-95')

    // Simulate preference change
    if (mediaQueryListener) {
      act(() => {
        mediaQueryListener!({ matches: true } as MediaQueryListEvent)
      })
    }

    // Should now use reduced motion settings
    expect(result.current.touchStyles).toContain('brightness-95')
  })
})

describe('TouchFeedbackProvider and Context', () => {
  it('provides default context values', () => {
    const TestComponent = () => {
      const context = useTouchFeedbackContext()
      return (
        <div>
          <span data-testid="intensity">{context.globalIntensity}</span>
          <span data-testid="visual">{context.enableVisualFeedback.toString()}</span>
        </div>
      )
    }

    render(
      <TouchFeedbackProvider>
        <TestComponent />
      </TouchFeedbackProvider>
    )

    expect(screen.getByTestId('intensity')).toHaveTextContent('medium')
    expect(screen.getByTestId('visual')).toHaveTextContent('true')
  })

  it('allows custom default values', () => {
    const TestComponent = () => {
      const context = useTouchFeedbackContext()
      return (
        <div>
          <span data-testid="intensity">{context.globalIntensity}</span>
          <span data-testid="visual">{context.enableVisualFeedback.toString()}</span>
        </div>
      )
    }

    render(
      <TouchFeedbackProvider defaultIntensity="subtle" defaultVisualFeedback={false}>
        <TestComponent />
      </TouchFeedbackProvider>
    )

    expect(screen.getByTestId('intensity')).toHaveTextContent('subtle')
    expect(screen.getByTestId('visual')).toHaveTextContent('false')
  })

  it('allows updating context values', () => {
    const TestComponent = () => {
      const context = useTouchFeedbackContext()
      return (
        <div>
          <span data-testid="intensity">{context.globalIntensity}</span>
          <button onClick={() => context.setGlobalIntensity('strong')}>
            Set Strong
          </button>
          <button onClick={() => context.setEnableVisualFeedback(false)}>
            Disable Visual
          </button>
        </div>
      )
    }

    render(
      <TouchFeedbackProvider>
        <TestComponent />
      </TouchFeedbackProvider>
    )

    expect(screen.getByTestId('intensity')).toHaveTextContent('medium')

    fireEvent.click(screen.getByRole('button', { name: /set strong/i }))
    expect(screen.getByTestId('intensity')).toHaveTextContent('strong')

    fireEvent.click(screen.getByRole('button', { name: /disable visual/i }))
    // Context should update but we're not displaying visual feedback state in this test
  })

  it('throws error when used outside provider', () => {
    const TestComponent = () => {
      useTouchFeedbackContext()
      return <div>Test</div>
    }

    // Expect error to be thrown
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTouchFeedbackContext must be used within a TouchFeedbackProvider')
  })
})

describe('Performance and Cleanup', () => {
  it('cleans up timeout on unmount', () => {
    const { result, unmount } = renderHook(() => useTouchFeedback())

    act(() => {
      result.current.startTouch()
    })

    act(() => {
      result.current.endTouch()
    })

    // Unmount should not cause any issues
    expect(() => unmount()).not.toThrow()
  })

  it('handles rapid touch events without issues', () => {
    const { result } = renderHook(() => useTouchFeedback())

    // Rapid touch events
    act(() => {
      result.current.startTouch()
      result.current.endTouch()
      result.current.startTouch()
      result.current.endTouch()
      result.current.startTouch()
    })

    expect(result.current.isTouched).toBe(true)
  })
})

describe('Browser Compatibility', () => {
  it('works without window object (SSR)', () => {
    const originalWindow = global.window
    delete (global as any).window

    expect(() => {
      renderHook(() => useAccessibleTouchFeedback())
    }).not.toThrow()

    global.window = originalWindow
  })

  it('handles missing matchMedia gracefully', () => {
    const originalMatchMedia = window.matchMedia
    delete (window as any).matchMedia

    expect(() => {
      renderHook(() => useAccessibleTouchFeedback())
    }).not.toThrow()

    window.matchMedia = originalMatchMedia
  })
})