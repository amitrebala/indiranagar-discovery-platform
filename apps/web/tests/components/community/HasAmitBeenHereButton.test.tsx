import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import HasAmitBeenHereButton from '@/components/community/HasAmitBeenHereButton'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock hooks
vi.mock('@/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({ vibrate: vi.fn() }),
  HapticPattern: {
    Light: [10],
    Medium: [20],
    Heavy: [30],
  },
}))

// Mock UI components
vi.mock('@/components/ui/FloatingEmojis', () => ({
  default: () => null,
}))

vi.mock('@/components/ui/CelebrationOverlay', () => ({
  default: () => null,
}))

// Mock Zustand stores
vi.mock('@/stores/amitButtonStore', () => ({
  useAmitButtonStore: () => ({
    isExpanded: false,
    filterActive: false,
    toggleFilter: vi.fn(),
  }),
}))

vi.mock('@/stores/mapStore', () => ({
  useMapStore: () => ({}),
}))

describe('HasAmitBeenHereButton', () => {
  it('should render the floating button', () => {
    render(<HasAmitBeenHereButton />)
    
    const button = screen.getByRole('button', { name: /ask amit a question/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('fixed', 'bottom-6', 'right-6')
  })

  it('should display different text on mobile and desktop', () => {
    render(<HasAmitBeenHereButton />)
    
    // Desktop text (hidden on small screens)
    expect(screen.getByText('Has Amit Been Here?')).toBeInTheDocument()
    
    // Mobile text (hidden on large screens)
    expect(screen.getByText('Ask Amit')).toBeInTheDocument()
  })

  it('should open modal when clicked', () => {
    render(<HasAmitBeenHereButton />)
    
    const button = screen.getByRole('button', { name: /ask amit a question/i })
    fireEvent.click(button)
    
    // Check if modal is opened (SuggestionForm should be rendered)
    expect(screen.getByText('Ask Amit Anything')).toBeInTheDocument()
  })

  it('should close modal when close button is clicked', () => {
    render(<HasAmitBeenHereButton />)
    
    // Open modal
    const button = screen.getByRole('button', { name: /ask amit a question/i })
    fireEvent.click(button)
    
    // Modal should be open
    expect(screen.getByText('Ask Amit Anything')).toBeInTheDocument()
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: /close modal/i })
    fireEvent.click(closeButton)
    
    // Modal should be closed
    expect(screen.queryByText('Ask Amit Anything')).not.toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    render(<HasAmitBeenHereButton />)
    
    const button = screen.getByRole('button', { name: /ask amit a question/i })
    
    expect(button).toHaveClass(
      'bg-gradient-to-r',
      'from-blue-600',
      'to-purple-600',
      'text-white',
      'rounded-full',
      'shadow-lg'
    )
  })
})