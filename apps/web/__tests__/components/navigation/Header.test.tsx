import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Header } from '@/components/navigation/Header'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: () => ({ push: mockPush }),
}))

// Mock the navigation store
const mockToggleMobileMenu = vi.fn()
vi.mock('@/stores/navigationStore', () => ({
  useNavigationStore: () => ({
    toggleMobileMenu: mockToggleMobileMenu,
  }),
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the header with logo and brand', () => {
    render(<Header />)
    
    expect(screen.getByText('Indiranagar Discovery')).toBeInTheDocument()
    expect(screen.getByText('Personal place recommendations')).toBeInTheDocument()
  })

  it('renders navigation items on desktop', () => {
    render(<Header />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Map')).toBeInTheDocument()
    expect(screen.getByText('Places')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders mobile menu button', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('calls toggleMobileMenu when mobile menu button is clicked', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    fireEvent.click(mobileMenuButton)
    
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1)
  })

  it('highlights active navigation item', () => {
    vi.mocked(require('next/navigation').usePathname).mockReturnValue('/map')
    
    render(<Header />)
    
    const mapLink = screen.getByRole('link', { name: /map/i })
    expect(mapLink).toHaveClass('bg-primary', 'text-white')
  })

  it('has proper accessibility attributes', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    
    const navigation = screen.getByRole('navigation')
    expect(navigation).toBeInTheDocument()
  })
})