import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useNavigationStore } from '@/stores/navigationStore'

describe('navigationStore', () => {
  beforeEach(() => {
    // Reset store state
    useNavigationStore.setState({
      isMobileMenuOpen: false,
      activeSection: 'home',
    })
  })

  it('has correct initial state', () => {
    const { result } = renderHook(() => useNavigationStore())
    
    expect(result.current.isMobileMenuOpen).toBe(false)
    expect(result.current.activeSection).toBe('home')
  })

  it('can toggle mobile menu', () => {
    const { result } = renderHook(() => useNavigationStore())
    
    act(() => {
      result.current.toggleMobileMenu()
    })
    
    expect(result.current.isMobileMenuOpen).toBe(true)
    
    act(() => {
      result.current.toggleMobileMenu()
    })
    
    expect(result.current.isMobileMenuOpen).toBe(false)
  })

  it('can close mobile menu', () => {
    const { result } = renderHook(() => useNavigationStore())
    
    // First open the menu
    act(() => {
      result.current.toggleMobileMenu()
    })
    
    expect(result.current.isMobileMenuOpen).toBe(true)
    
    // Then close it
    act(() => {
      result.current.closeMobileMenu()
    })
    
    expect(result.current.isMobileMenuOpen).toBe(false)
  })

  it('can set active section', () => {
    const { result } = renderHook(() => useNavigationStore())
    
    act(() => {
      result.current.setActiveSection('map')
    })
    
    expect(result.current.activeSection).toBe('map')
    
    act(() => {
      result.current.setActiveSection('places')
    })
    
    expect(result.current.activeSection).toBe('places')
  })
})