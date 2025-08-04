import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PlaceCardSkeleton } from '@/components/places/PlaceCardSkeleton'

describe('PlaceCardSkeleton', () => {
  it('renders skeleton loading state', () => {
    const { container } = render(<PlaceCardSkeleton />)
    
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('bg-white')
    expect(skeleton).toHaveClass('rounded-xl')
  })

  it('has proper skeleton structure', () => {
    const { container } = render(<PlaceCardSkeleton />)
    
    // Check for image placeholder
    const imagePlaceholder = container.querySelector('[class*="aspect-[4/3]"]')
    expect(imagePlaceholder).toBeInTheDocument()
    
    // Check for content placeholders
    const contentPlaceholders = container.querySelectorAll('.bg-gray-200')
    expect(contentPlaceholders.length).toBeGreaterThan(0)
  })

  it('has correct semantic structure', () => {
    const { container } = render(<PlaceCardSkeleton />)
    
    // Should have main container
    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer).toBeInTheDocument()
    
    // Should have padding container
    const paddingContainer = container.querySelector('.p-4')
    expect(paddingContainer).toBeInTheDocument()
    
    // Should have space-y-3 for spacing
    const spacedContainer = container.querySelector('.space-y-3')
    expect(spacedContainer).toBeInTheDocument()
  })
})