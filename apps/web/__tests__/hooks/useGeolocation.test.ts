import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGeolocation } from '@/hooks/useGeolocation'

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('has correct initial state', () => {
    const { result } = renderHook(() => useGeolocation())
    
    expect(result.current.coordinates).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(typeof result.current.getCurrentPosition).toBe('function')
  })

  it('successfully gets current position', async () => {
    const mockPosition = {
      coords: {
        latitude: 12.9719,
        longitude: 77.6412,
      },
    }

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())
    
    act(() => {
      result.current.getCurrentPosition()
    })
    
    expect(result.current.coordinates).toEqual({
      lat: 12.9719,
      lng: 77.6412,
    })
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('handles permission denied error', async () => {
    const mockError = {
      code: 1, // PERMISSION_DENIED
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    }

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())
    
    act(() => {
      result.current.getCurrentPosition()
    })
    
    expect(result.current.coordinates).toBeNull()
    expect(result.current.error).toBe('Location access denied by user')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles position unavailable error', async () => {
    const mockError = {
      code: 2, // POSITION_UNAVAILABLE
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    }

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())
    
    act(() => {
      result.current.getCurrentPosition()
    })
    
    expect(result.current.coordinates).toBeNull()
    expect(result.current.error).toBe('Location information unavailable')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles timeout error', async () => {
    const mockError = {
      code: 3, // TIMEOUT
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    }

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())
    
    act(() => {
      result.current.getCurrentPosition()
    })
    
    expect(result.current.coordinates).toBeNull()
    expect(result.current.error).toBe('Location request timed out')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles unknown error', async () => {
    const mockError = {
      code: 999, // Unknown error
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    }

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())
    
    act(() => {
      result.current.getCurrentPosition()
    })
    
    expect(result.current.coordinates).toBeNull()
    expect(result.current.error).toBe('Failed to get location')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles unsupported geolocation', () => {
    // Temporarily remove geolocation support
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
    })

    const { result } = renderHook(() => useGeolocation())
    
    act(() => {
      result.current.getCurrentPosition() 
    })
    
    expect(result.current.coordinates).toBeNull()
    expect(result.current.error).toBe('Geolocation is not supported by this browser')
    expect(result.current.isLoading).toBe(false)

    // Restore geolocation for other tests
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    })
  })

  it('sets loading state during position request', () => {
    let callback: () => void

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
      callback = () => success({
        coords: { latitude: 12.9719, longitude: 77.6412 }
      })
    })

    const { result } = renderHook(() => useGeolocation())
    
    act(() => {
      result.current.getCurrentPosition()
    })
    
    // Should be loading immediately after calling
    expect(result.current.isLoading).toBe(true)
    
    // Complete the request
    act(() => {
      callback()
    })
    
    expect(result.current.isLoading).toBe(false)
  })

  it('uses custom options', () => {
    const customOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 30000,
    }

    const { result } = renderHook(() => useGeolocation(customOptions))
    
    act(() => {
      result.current.getCurrentPosition()
    })
    
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining(customOptions)
    )
  })
})