import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MobileNav } from '@/components/navigation/MobileNav'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

// Mock the navigation store
const mockCloseMobileMenu = vi.fn()
vi.mock('@/stores/navigationStore', () => ({
  useNavigationStore: () => ({
    isMobileMenuOpen: true,
    closeMobileMenu: mockCloseMobileMenu,
  }),
}))

describe('MobileNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders mobile navigation when open', () => {
    render(<MobileNav />)
    
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Map')).toBeInTheDocument()
    expect(screen.getByText('Places')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('does not render when menu is closed', () => {
    vi.mocked(require('@/stores/navigationStore').useNavigationStore).mockReturnValue({
      isMobileMenuOpen: false,
      closeMobileMenu: mockCloseMobileMenu,
    })
    
    render(<MobileNav />)
    
    expect(screen.queryByText('Menu')).not.toBeInTheDocument()
  })

  it('calls closeMobileMenu when close button is clicked', () => {
    render(<MobileNav />)
    
    const closeButton = screen.getByLabelText('Close menu')
    fireEvent.click(closeButton)
    
    expect(mockCloseMobileMenu).toHaveBeenCalledTimes(1)
  })

  it('calls closeMobileMenu when overlay is clicked', () => {
    render(<MobileNav />)
    
    const overlay = screen.getByRole('button', { hidden: true })
    fireEvent.click(overlay)
    
    expect(mockCloseMobileMenu).toHaveBeenCalledTimes(1)
  })

  it('highlights active navigation item', () => {
    vi.mocked(require('next/navigation').usePathname).mockReturnValue('/places')
    
    render(<MobileNav />)
    
    const placesLink = screen.getByRole('link', { name: /places/i })
    expect(placesLink).toHaveClass('bg-primary', 'text-white')
  })

  it('renders footer message', () => {
    render(<MobileNav />)
    
    expect(screen.getByText('Discover Indiranagar with local expertise')).toBeInTheDocument()
  })
})