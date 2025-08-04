import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PlaceMarker } from '@/components/map/PlaceMarker'
import type { Place } from '@/lib/validations'

// Mock the map store
const mockSetSelectedPlace = vi.fn()
vi.mock('@/stores/mapStore', () => ({
  useMapStore: () => ({
    selectedPlace: null,
    setSelectedPlace: mockSetSelectedPlace,
  }),
}))

const mockPlace: Place = {
  id: '1',
  name: 'Test Restaurant',
  description: 'A great place to eat',
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

describe('PlaceMarker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders marker with place data', () => {
    render(<PlaceMarker place={mockPlace} />)
    
    expect(screen.getByTestId('marker')).toBeInTheDocument()
    expect(screen.getByTestId('popup')).toBeInTheDocument()
  })

  it('displays place information in popup', () => {
    render(<PlaceMarker place={mockPlace} />)
    
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    expect(screen.getByText('A great place to eat')).toBeInTheDocument()
    expect(screen.getByText('restaurant')).toBeInTheDocument()
    expect(screen.getByText('★ 4.5')).toBeInTheDocument()
  })

  it('calls setSelectedPlace when marker is clicked', () => {
    render(<PlaceMarker place={mockPlace} />)
    
    const marker = screen.getByTestId('marker')
    fireEvent.click(marker)
    
    expect(mockSetSelectedPlace).toHaveBeenCalledWith(mockPlace)
  })

  it('handles places without category gracefully', () => {
    const placeWithoutCategory = { ...mockPlace, category: null }
    
    render(<PlaceMarker place={placeWithoutCategory} />)
    
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    expect(screen.queryByText('restaurant')).not.toBeInTheDocument()
  })

  it('formats rating correctly', () => {
    const placeWithLowRating = { ...mockPlace, rating: 3.2 }
    
    render(<PlaceMarker place={placeWithLowRating} />)
    
    expect(screen.getByText('★ 3.2')).toBeInTheDocument()
  })
})