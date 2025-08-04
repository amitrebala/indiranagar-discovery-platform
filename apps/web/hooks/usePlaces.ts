import { useEffect } from 'react'
import { useMapStore } from '@/stores/mapStore'
import { API_ROUTES } from '@/lib/constants'
import type { Place } from '@/lib/validations'

interface PlacesResponse {
  places: Place[]
  pagination: {
    limit: number
    offset: number
    total: number | null
  }
}

export function usePlaces() {
  const { 
    places, 
    isLoading, 
    error, 
    setPlaces, 
    setLoading, 
    setError 
  } = useMapStore()

  const fetchPlaces = async (category?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      params.append('limit', '200') // Get more places for map display
      
      const url = `${API_ROUTES.PLACES}?${params.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch places: ${response.statusText}`)
      }
      
      const data: PlacesResponse = await response.json()
      setPlaces(data.places)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch places'
      setError(errorMessage)
      console.error('Error fetching places:', err)
    } finally {
      setLoading(false)
    }
  }

  const refetchPlaces = () => {
    fetchPlaces()
  }

  // Auto-fetch places on hook mount
  useEffect(() => {
    if (places.length === 0 && !isLoading && !error) {
      fetchPlaces()
    }
  }, [])

  return {
    places,
    isLoading,
    error,
    fetchPlaces,
    refetchPlaces
  }
}