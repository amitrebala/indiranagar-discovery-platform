import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  LoadingButton,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  DangerButton
} from '@/components/ui/LoadingButton'
import { HapticPattern } from '@/hooks/useHapticFeedback'

// Mock the haptic feedback hook
const mockTriggerHaptic = vi.fn().mockResolvedValue(true)
vi.mock('@/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerHaptic: mockTriggerHaptic,
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

describe('LoadingButton', () => {
  beforeEach(() => {
    mockTriggerHaptic.mockClear()
  })

  describe('Basic Rendering', () => {
    it('renders button with children', () => {
      render(<LoadingButton>Click me</LoadingButton>)
      
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('applies default variant and size classes', () => {
      render(<LoadingButton>Default Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-600', 'text-white')
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm', 'min-h-[44px]')
    })

    it('applies custom className', () => {
      render(<LoadingButton className="custom-class">Custom</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('renders primary variant correctly', () => {
      render(<LoadingButton variant="primary">Primary</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-600', 'text-white', 'hover:bg-primary-700')
    })

    it('renders secondary variant correctly', () => {
      render(<LoadingButton variant="secondary">Secondary</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary-600', 'text-white', 'hover:bg-secondary-700')
    })

    it('renders outline variant correctly', () => {
      render(<LoadingButton variant="outline">Outline</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'border-primary-600', 'text-primary-600')
    })

    it('renders ghost variant correctly', () => {
      render(<LoadingButton variant="ghost">Ghost</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary-600', 'hover:bg-primary-50')
    })

    it('renders danger variant correctly', () => {
      render(<LoadingButton variant="danger">Danger</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-error-600', 'text-white', 'hover:bg-error-700')
    })
  })

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<LoadingButton size="sm">Small</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm', 'min-h-[36px]')
    })

    it('renders medium size correctly', () => {
      render(<LoadingButton size="md">Medium</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm', 'min-h-[44px]')
    })

    it('renders large size correctly', () => {
      render(<LoadingButton size="lg">Large</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3', 'text-base', 'min-h-[52px]')
    })
  })

  describe('Loading States', () => {
    it('shows loading spinner when loading', () => {
      render(<LoadingButton loading={true}>Loading Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
      
      // Check for loading spinner
      const spinner = button.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('shows loading text when provided', () => {
      render(
        <LoadingButton loading={true} loadingText="Saving...">
          Save
        </LoadingButton>
      )
      
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      expect(screen.queryByText('Save')).not.toBeInTheDocument()
    })

    it('shows loading dots when spinner type is dots', () => {
      render(
        <LoadingButton loading={true} spinnerType="dots">
          Dots Loading
        </LoadingButton>
      )
      
      const button = screen.getByRole('button')
      const dotsContainer = button.querySelector('.flex.items-center.gap-1')
      expect(dotsContainer).toBeInTheDocument()
    })

    it('shows pulse animation when spinner type is pulse', () => {
      render(
        <LoadingButton loading={true} spinnerType="pulse">
          Pulse Loading
        </LoadingButton>
      )
      
      const button = screen.getByRole('button')
      const pulseElement = button.querySelector('.animate-pulse')
      expect(pulseElement).toBeInTheDocument()
    })

    it('is disabled when loading', () => {
      render(<LoadingButton loading={true}>Loading</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('cursor-wait')
    })

    it('dims content when loading', () => {
      render(<LoadingButton loading={true}>Loading Content</LoadingButton>)
      
      const button = screen.getByRole('button')
      const contentSpan = button.querySelector('span')
      expect(contentSpan).toHaveClass('opacity-70')
    })
  })

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<LoadingButton disabled={true}>Disabled</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-60')
    })

    it('is disabled when loading even if disabled prop is false', () => {
      render(<LoadingButton loading={true} disabled={false}>Loading</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Haptic Feedback', () => {
    it('triggers default haptic pattern on click', () => {
      const onClick = vi.fn()
      
      render(<LoadingButton onClick={onClick}>Haptic Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockTriggerHaptic).toHaveBeenCalledWith('light')
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('triggers custom haptic pattern on click', () => {
      const onClick = vi.fn()
      
      render(
        <LoadingButton onClick={onClick} hapticPattern={HapticPattern.MEDIUM}>
          Custom Haptic
        </LoadingButton>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockTriggerHaptic).toHaveBeenCalledWith('medium')
    })

    it('triggers selection haptic on touch start', () => {
      const onTouchStart = vi.fn()
      
      render(
        <LoadingButton onTouchStart={onTouchStart}>
          Touch Button
        </LoadingButton>
      )
      
      const button = screen.getByRole('button')
      fireEvent.touchStart(button)
      
      expect(mockTriggerHaptic).toHaveBeenCalledWith('selection')
      expect(onTouchStart).toHaveBeenCalledTimes(1)
    })

    it('does not trigger haptic when disabled', () => {
      const onClick = vi.fn()
      
      render(
        <LoadingButton onClick={onClick} disabled={true}>
          Disabled Haptic
        </LoadingButton>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockTriggerHaptic).not.toHaveBeenCalled()
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<LoadingButton>Accessible Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'false')
      expect(button).toHaveAttribute('aria-live', 'polite')
    })

    it('updates ARIA attributes when loading', () => {
      render(<LoadingButton loading={true}>Loading Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('supports focus management', () => {
      render(<LoadingButton>Focusable Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2')
    })

    it('has minimum touch target size', () => {
      render(<LoadingButton size="sm">Small Touch Target</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('min-h-[36px]')
    })
  })

  describe('Visual Feedback', () => {
    it('has active state scaling', () => {
      render(<LoadingButton>Active Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('active:scale-95')
    })

    it('respects reduced motion preferences', () => {
      render(<LoadingButton>Motion Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('motion-reduce:transform-none')
    })

    it('has smooth transitions', () => {
      render(<LoadingButton>Smooth Button</LoadingButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('transition-all', 'duration-200')
    })
  })

  describe('Forwarded Ref', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn()
      
      render(<LoadingButton ref={ref}>Ref Button</LoadingButton>)
      
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
    })
  })

  describe('Event Handling', () => {
    it('handles onClick events', () => {
      const onClick = vi.fn()
      
      render(<LoadingButton onClick={onClick}>Click Handler</LoadingButton>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(expect.any(Object))
    })

    it('handles onTouchStart events', () => {
      const onTouchStart = vi.fn()
      
      render(<LoadingButton onTouchStart={onTouchStart}>Touch Handler</LoadingButton>)
      
      const button = screen.getByRole('button')
      fireEvent.touchStart(button)
      
      expect(onTouchStart).toHaveBeenCalledTimes(1)
    })

    it('passes through other HTML button props', () => {
      render(
        <LoadingButton
          type="submit"
          form="test-form"
          data-testid="custom-button"
        >
          HTML Props
        </LoadingButton>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('data-testid', 'custom-button')
    })
  })
})

describe('Specialized Button Variants', () => {
  describe('PrimaryButton', () => {
    it('renders as primary variant', () => {
      render(<PrimaryButton>Primary</PrimaryButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-600', 'text-white')
    })

    it('accepts all LoadingButton props except variant', () => {
      const onClick = vi.fn()
      
      render(
        <PrimaryButton 
          onClick={onClick} 
          loading={true} 
          size="lg"
        >
          Primary Loading
        </PrimaryButton>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('px-6', 'py-3')
    })
  })

  describe('SecondaryButton', () => {
    it('renders as secondary variant', () => {
      render(<SecondaryButton>Secondary</SecondaryButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary-600', 'text-white')
    })
  })

  describe('OutlineButton', () => {
    it('renders as outline variant', () => {
      render(<OutlineButton>Outline</OutlineButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'border-primary-600', 'text-primary-600')
    })
  })

  describe('GhostButton', () => {
    it('renders as ghost variant', () => {
      render(<GhostButton>Ghost</GhostButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary-600', 'hover:bg-primary-50')
    })
  })

  describe('DangerButton', () => {
    it('renders as danger variant', () => {
      render(<DangerButton>Danger</DangerButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-error-600', 'text-white')
    })
  })
})

describe('Performance and Edge Cases', () => {
  it('handles rapid loading state changes', () => {
    const { rerender } = render(<LoadingButton loading={false}>Button</LoadingButton>)
    
    // Rapidly toggle loading state
    rerender(<LoadingButton loading={true}>Button</LoadingButton>)
    rerender(<LoadingButton loading={false}>Button</LoadingButton>)
    rerender(<LoadingButton loading={true}>Button</LoadingButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('handles empty children gracefully', () => {
    render(<LoadingButton>{''}</LoadingButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('handles complex children with React elements', () => {
    render(
      <LoadingButton>
        <span>Icon</span>
        <strong>Bold Text</strong>
      </LoadingButton>
    )
    
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Bold Text')).toBeInTheDocument()
  })

  it('maintains button semantics with screen readers', () => {
    render(<LoadingButton loading={true} loadingText="Processing...">Submit</LoadingButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })
})

describe('Integration with Form Elements', () => {
  it('works correctly in form context', () => {
    const onSubmit = vi.fn(e => e.preventDefault())
    
    render(
      <form onSubmit={onSubmit}>
        <LoadingButton type="submit">Submit Form</LoadingButton>
      </form>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('respects form validation states', () => {
    render(
      <form>
        <LoadingButton type="submit" disabled={true}>
          Submit Disabled
        </LoadingButton>
      </form>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})

describe('Theme Integration', () => {
  it('uses design system colors for variants', () => {
    render(
      <div>
        <LoadingButton variant="primary">Primary</LoadingButton>
        <LoadingButton variant="danger">Danger</LoadingButton>
      </div>
    )
    
    const primaryButton = screen.getByRole('button', { name: /primary/i })
    const dangerButton = screen.getByRole('button', { name: /danger/i })
    
    expect(primaryButton).toHaveClass('bg-primary-600')
    expect(dangerButton).toHaveClass('bg-error-600')
  })

  it('applies consistent focus ring colors', () => {
    render(
      <div>
        <LoadingButton variant="primary">Primary</LoadingButton>
        <LoadingButton variant="outline">Outline</LoadingButton>
      </div>
    )
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-offset-2')
    })
  })
})