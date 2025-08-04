import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InteractiveMap } from '@/components/map/InteractiveMap'

// Mock the map store
vi.mock('@/stores/mapStore', () => ({
  useMapStore: () => ({
    center: { lat: 12.9719, lng: 77.6412 },
    zoom: 15,
    places: [
      {
        id: '1',
        name: 'Test Place',
        latitude: 12.9719,
        longitude: 77.6412,
        rating: 4.5,
        category: 'restaurant',
        description: 'Test description',
      },
    ],
    isLoading: false,
    error: null,
    selectedPlace: null,
    setCenter: vi.fn(),
    setZoom: vi.fn(),
    setSelectedPlace: vi.fn(),
    fetchPlaces: vi.fn(),
  }),
}))

describe('InteractiveMap', () => {

  it('renders map container', () => {
    render(<InteractiveMap />)
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
  })

  it('renders tile layer', () => {
    render(<InteractiveMap />)
    
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument()
  })

  it('renders place markers when places are loaded', () => {
    render(<InteractiveMap />)
    
    expect(screen.getByTestId('marker')).toBeInTheDocument()
  })

  it('displays loading state correctly', () => {
    // Override the mock for this test
    vi.doMock('@/stores/mapStore', () => ({
      useMapStore: () => ({
        center: { lat: 12.9719, lng: 77.6412 },
        zoom: 15,
        places: [],
        isLoading: true,
        error: null,
        selectedPlace: null,
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        setSelectedPlace: vi.fn(),
        fetchPlaces: vi.fn(),
      }),
    }))

    render(<InteractiveMap />)
    
    expect(screen.getByText('Loading map...')).toBeInTheDocument()
  })

  it('displays error state correctly', () => {
    // Override the mock for this test
    vi.doMock('@/stores/mapStore', () => ({
      useMapStore: () => ({
        center: { lat: 12.9719, lng: 77.6412 },
        zoom: 15,
        places: [],
        isLoading: false,
        error: 'Failed to load places',
        selectedPlace: null,
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        setSelectedPlace: vi.fn(),
        fetchPlaces: vi.fn(),
      }),
    }))

    render(<InteractiveMap />)
    
    expect(screen.getByText('Error loading map: Failed to load places')).toBeInTheDocument()
  })
})