import { useState, useEffect } from 'react'
import type { Place } from '@/lib/validations'

interface UseFeaturedPlacesReturn {
  places: Place[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useFeaturedPlaces(): UseFeaturedPlacesReturn {
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedPlaces = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/places?featured=true&limit=5&has_amit_visited=true')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch featured places: ${response.status}`)
      }
      
      const data = await response.json()
      setPlaces(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Error fetching featured places: ${errorMessage}`)
      console.error('Featured places fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeaturedPlaces()
  }, [])

  const refetch = () => {
    fetchFeaturedPlaces()
  }

  return {
    places,
    isLoading,
    error,
    refetch
  }
}