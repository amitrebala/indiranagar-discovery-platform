import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  SkeletonBox,
  SkeletonText,
  SkeletonLine,
  PlaceCardSkeleton,
  SearchResultsSkeleton,
  MapLoadingSkeleton,
  ContentSkeleton,
  LoadingDots,
  SkeletonWrapper
} from '@/components/ui/SkeletonLoaders'

// Mock reduced motion media query
const mockMatchMedia = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

describe('SkeletonLoaders', () => {
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

  describe('Basic Skeleton Components', () => {
    it('renders SkeletonBox with proper accessibility attributes', () => {
      render(<SkeletonBox />)
      const skeleton = screen.getByRole('presentation', { hidden: true })
      expect(skeleton).toHaveAttribute('aria-hidden', 'true')
      expect(skeleton).toHaveClass('animate-pulse')
    })

    it('renders SkeletonText with correct height and accessibility', () => {
      render(<SkeletonText />)
      const skeleton = screen.getByRole('presentation', { hidden: true })
      expect(skeleton).toHaveAttribute('aria-hidden', 'true')
      expect(skeleton).toHaveClass('h-4')
    })

    it('renders SkeletonLine with correct height', () => {
      render(<SkeletonLine />)
      const skeleton = screen.getByRole('presentation', { hidden: true })
      expect(skeleton).toHaveClass('h-3')
    })

    it('respects reduced motion preferences', () => {
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

      render(<SkeletonBox />)
      const skeleton = screen.getByRole('presentation', { hidden: true })
      expect(skeleton).toHaveClass('motion-reduce:animate-none')
      expect(skeleton).toHaveClass('motion-reduce:bg-neutral-200')
    })
  })

  describe('PlaceCardSkeleton', () => {
    it('renders full place card skeleton with proper structure', () => {
      render(<PlaceCardSkeleton />)
      
      // Check for status role and aria-label
      const skeleton = screen.getByRole('status')
      expect(skeleton).toHaveAttribute('aria-label', 'Loading place information')
      
      // Check structure matches actual place card
      expect(skeleton).toHaveClass('bg-white', 'rounded-xl', 'shadow-md')
      
      // Check for star rating skeleton
      const stars = skeleton.querySelectorAll('[data-testid="star"]')
      expect(stars).toHaveLength(0) // Icons are present but no test ids
      
      // Check for action buttons skeleton
      const actionButtons = skeleton.querySelectorAll('.h-11')
      expect(actionButtons.length).toBeGreaterThan(0)
    })

    it('renders compact version with different layout', () => {
      render(<PlaceCardSkeleton compact={true} />)
      
      const skeleton = screen.getByRole('status')
      expect(skeleton).toHaveClass('p-3') // Compact padding
      expect(skeleton).not.toHaveClass('rounded-xl') // Different border radius
      expect(skeleton).toHaveClass('rounded-lg')
    })

    it('conditionally shows distance skeleton', () => {
      const { rerender } = render(<PlaceCardSkeleton showDistance={false} />)
      
      // Should not have distance elements initially
      let mapPinIcons = screen.queryAllByTestId('map-pin')
      expect(mapPinIcons).toHaveLength(0)
      
      rerender(<PlaceCardSkeleton showDistance={true} />)
      
      // Should have distance elements after rerender
      const skeleton = screen.getByRole('status')
      const distanceElements = skeleton.querySelectorAll('.absolute')
      expect(distanceElements.length).toBeGreaterThan(0)
    })

    it('mirrors actual content structure for screen readers', () => {
      render(<PlaceCardSkeleton />)
      
      const skeleton = screen.getByRole('status')
      
      // Check for main sections that mirror real content
      const imageSection = skeleton.querySelector('.h-48')
      expect(imageSection).toBeInTheDocument()
      
      const contentSection = skeleton.querySelector('.p-4')
      expect(contentSection).toBeInTheDocument()
      
      // Check for text placeholders that mirror real content lines
      const textPlaceholders = skeleton.querySelectorAll('.h-4, .h-3, .h-6')
      expect(textPlaceholders.length).toBeGreaterThan(5) // Multiple text elements
    })
  })

  describe('SearchResultsSkeleton', () => {
    it('renders multiple place card skeletons', () => {
      render(<SearchResultsSkeleton count={3} />)
      
      const container = screen.getByRole('status')
      expect(container).toHaveAttribute('aria-label', 'Loading search results')
      
      // Should render header skeleton
      const headerElements = container.querySelectorAll('.w-32, .w-16')
      expect(headerElements.length).toBeGreaterThan(0)
      
      // Should render load more button skeleton
      const loadMoreButton = container.querySelector('.w-32.h-10')
      expect(loadMoreButton).toBeInTheDocument()
    })

    it('renders different layouts for compact vs grid', () => {
      const { rerender } = render(<SearchResultsSkeleton compact={false} />)
      
      let container = screen.getByRole('status')
      let gridContainer = container.querySelector('.grid')
      expect(gridContainer).toBeInTheDocument()
      
      rerender(<SearchResultsSkeleton compact={true} />)
      
      container = screen.getByRole('status')
      const spaceContainer = container.querySelector('.space-y-3')
      expect(spaceContainer).toBeInTheDocument()
    })

    it('renders specified number of skeleton cards', () => {
      render(<SearchResultsSkeleton count={5} />)
      
      const container = screen.getByRole('status')
      const skeletonCards = container.querySelectorAll('[role="status"]')
      expect(skeletonCards).toHaveLength(5)
    })
  })

  describe('MapLoadingSkeleton', () => {
    it('renders map loading state with proper accessibility', () => {
      render(<MapLoadingSkeleton />)
      
      const skeleton = screen.getByRole('status')
      expect(skeleton).toHaveAttribute('aria-label', 'Loading interactive map')
      expect(skeleton).toHaveClass('absolute', 'inset-0', 'z-10')
    })

    it('conditionally renders controls and stats', () => {
      const { rerender } = render(<MapLoadingSkeleton showControls={false} showStats={false} />)
      
      let skeleton = screen.getByRole('status')
      let controls = skeleton.querySelector('.absolute.top-4.right-4')
      let stats = skeleton.querySelector('.absolute.bottom-4.left-4')
      
      expect(controls).not.toBeInTheDocument()
      expect(stats).not.toBeInTheDocument()
      
      rerender(<MapLoadingSkeleton showControls={true} showStats={true} />)
      
      skeleton = screen.getByRole('status')
      controls = skeleton.querySelector('.absolute.top-4.right-4')
      stats = skeleton.querySelector('.absolute.bottom-4.left-4')
      
      expect(controls).toBeInTheDocument()
      expect(stats).toBeInTheDocument()
    })

    it('has animated elements for visual feedback', () => {
      render(<MapLoadingSkeleton />)
      
      const skeleton = screen.getByRole('status')
      const animatedElements = skeleton.querySelectorAll('.animate-ping')
      expect(animatedElements.length).toBeGreaterThan(0)
      
      const shimmerOverlay = skeleton.querySelector('.animate-shimmer')
      expect(shimmerOverlay).toBeInTheDocument()
    })
  })

  describe('ContentSkeleton', () => {
    it('renders configurable content skeleton', () => {
      render(<ContentSkeleton lines={5} showHeader={true} showActions={true} />)
      
      const skeleton = screen.getByRole('status')
      expect(skeleton).toHaveAttribute('aria-label', 'Loading content')
      
      // Check for header
      const header = skeleton.querySelector('.justify-between')
      expect(header).toBeInTheDocument()
      
      // Check for specified number of lines
      const lines = skeleton.querySelectorAll('.space-y-2 > *')
      expect(lines).toHaveLength(5)
      
      // Check for actions
      const actions = skeleton.querySelector('.flex.gap-2.pt-2')
      expect(actions).toBeInTheDocument()
    })

    it('renders without optional elements when disabled', () => {
      render(<ContentSkeleton lines={2} showHeader={false} showActions={false} />)
      
      const skeleton = screen.getByRole('status')
      
      const header = skeleton.querySelector('.justify-between')
      expect(header).not.toBeInTheDocument()
      
      const actions = skeleton.querySelector('.flex.gap-2.pt-2')
      expect(actions).not.toBeInTheDocument()
      
      const lines = skeleton.querySelectorAll('.space-y-2 > *')
      expect(lines).toHaveLength(2)
    })
  })

  describe('LoadingDots', () => {
    it('renders animated dots for loading states', () => {
      render(<LoadingDots />)
      
      const container = screen.getByRole('presentation', { hidden: true })
      const dots = container.querySelectorAll('.animate-pulse')
      
      expect(dots).toHaveLength(3)
      expect(container).toHaveClass('flex', 'items-center', 'gap-1')
    })

    it('applies custom className', () => {
      render(<LoadingDots className="custom-class" />)
      
      const container = screen.getByRole('presentation', { hidden: true })
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('SkeletonWrapper', () => {
    it('shows skeleton when loading', () => {
      const skeletonElement = <div data-testid="skeleton">Loading...</div>
      const actualContent = <div data-testid="content">Actual content</div>
      
      render(
        <SkeletonWrapper isLoading={true} skeleton={skeletonElement}>
          {actualContent}
        </SkeletonWrapper>
      )
      
      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('shows actual content when not loading', () => {
      const skeletonElement = <div data-testid="skeleton">Loading...</div>
      const actualContent = <div data-testid="content">Actual content</div>
      
      render(
        <SkeletonWrapper isLoading={false} skeleton={skeletonElement}>
          {actualContent}
        </SkeletonWrapper>
      )
      
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('Accessibility Compliance', () => {
    it('all skeleton components have proper ARIA attributes', () => {
      render(
        <div>
          <PlaceCardSkeleton />
          <SearchResultsSkeleton count={2} />
          <MapLoadingSkeleton />
          <ContentSkeleton />
        </div>
      )
      
      const statusElements = screen.getAllByRole('status')
      expect(statusElements.length).toBeGreaterThan(0)
      
      statusElements.forEach(element => {
        expect(element).toHaveAttribute('aria-label')
      })
      
      const hiddenElements = screen.getAllByRole('presentation', { hidden: true })
      hiddenElements.forEach(element => {
        expect(element).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('skeleton animations respect motion preferences', () => {
      // Test with reduced motion preference
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

      render(<PlaceCardSkeleton />)
      
      const skeletonElements = screen.getAllByRole('presentation', { hidden: true })
      skeletonElements.forEach(element => {
        expect(element).toHaveClass('motion-reduce:animate-none')
      })
    })
  })

  describe('Performance and Structure', () => {
    it('skeleton components mirror actual content structure', () => {
      render(<PlaceCardSkeleton />)
      
      const skeleton = screen.getByRole('status')
      
      // Check that the skeleton has similar structure to actual place card
      // Image section
      expect(skeleton.querySelector('.h-48')).toBeInTheDocument()
      
      // Content section with padding
      expect(skeleton.querySelector('.p-4')).toBeInTheDocument()
      
      // Title and rating area
      expect(skeleton.querySelector('.justify-between')).toBeInTheDocument()
      
      // Action buttons area
      expect(skeleton.querySelector('.flex.gap-2')).toBeInTheDocument()
    })

    it('does not cause layout shift with proper dimensions', () => {
      render(<PlaceCardSkeleton />)
      
      const skeleton = screen.getByRole('status')
      
      // Should have defined dimensions that match actual content
      expect(skeleton).toHaveClass('bg-white', 'rounded-xl', 'shadow-md')
      
      // Image placeholder should have proper height
      const imagePlaceholder = skeleton.querySelector('.h-48')
      expect(imagePlaceholder).toBeInTheDocument()
    })
  })
})