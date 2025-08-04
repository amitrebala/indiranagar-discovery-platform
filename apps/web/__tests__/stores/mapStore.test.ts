import { act, renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMapStore } from '@/stores/mapStore'
import type { Place } from '@/lib/validations'

// Mock fetch
global.fetch = vi.fn()

const mockPlace: Place = {
  id: '1',
  name: 'Test Place',
  description: 'Test description',
  latitude: 12.9719,
  longitude: 77.6412,
  rating: 4.5,
  category: 'restaurant',
  weather_suitability: null,
  accessibility_info: null,
  best_time_to_visit: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('mapStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    useMapStore.setState({
      center: { lat: 12.9719, lng: 77.6412 },
      zoom: 15,
      selectedPlace: null,
      places: [],
      isLoading: false,
      error: null,
    })
  })

  it('has correct initial state', () => {
    const { result } = renderHook(() => useMapStore())
    
    expect(result.current.center).toEqual({ lat: 12.9719, lng: 77.6412 })
    expect(result.current.zoom).toBe(15)
    expect(result.current.selectedPlace).toBeNull()
    expect(result.current.places).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('can set center', () => {
    const { result } = renderHook(() => useMapStore())
    
    act(() => {
      result.current.setCenter({ lat: 13.0, lng: 77.0 })
    })
    
    expect(result.current.center).toEqual({ lat: 13.0, lng: 77.0 })
  })

  it('can set zoom level', () => {
    const { result } = renderHook(() => useMapStore())
    
    act(() => {
      result.current.setZoom(18)
    })
    
    expect(result.current.zoom).toBe(18)
  })

  it('can set selected place', () => {
    const { result } = renderHook(() => useMapStore())
    
    act(() => {
      result.current.setSelectedPlace(mockPlace)
    })
    
    expect(result.current.selectedPlace).toEqual(mockPlace)
  })

  it('can clear selected place', () => {
    const { result } = renderHook(() => useMapStore())
    
    // First set a place
    act(() => {
      result.current.setSelectedPlace(mockPlace)
    })
    
    // Then clear it
    act(() => {
      result.current.setSelectedPlace(null)
    })
    
    expect(result.current.selectedPlace).toBeNull()
  })

  it('fetches places successfully', async () => {
    const mockPlaces = [mockPlace]
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlaces,
    })

    const { result } = renderHook(() => useMapStore())
    
    await act(async () => {
      await result.current.fetchPlaces()
    })
    
    expect(result.current.places).toEqual(mockPlaces)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles fetch error correctly', async () => {
    const errorMessage = 'Failed to fetch places'
    ;(fetch as any).mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useMapStore())
    
    await act(async () => {
      await result.current.fetchPlaces()
    })
    
    expect(result.current.places).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(`Error fetching places: ${errorMessage}`)
  })

  it('handles non-ok response correctly', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() => useMapStore())
    
    await act(async () => {
      await result.current.fetchPlaces()
    })
    
    expect(result.current.places).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Failed to fetch places: 500')
  })

  it('sets loading state during fetch', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    ;(fetch as any).mockReturnValueOnce(promise)

    const { result } = renderHook(() => useMapStore())
    
    // Start the fetch
    act(() => {
      result.current.fetchPlaces()
    })
    
    // Should be loading
    expect(result.current.isLoading).toBe(true)
    
    // Resolve the promise
    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => [mockPlace],
      })
    })
    
    // Should no longer be loading
    expect(result.current.isLoading).toBe(false)
  })
})