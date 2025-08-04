'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Place, PlaceImage } from '@/lib/supabase/types'
import { PlaceCard } from './PlaceCard'
import { PlaceCardSkeleton } from './PlaceCardSkeleton'

interface PlacesGridProps {
  searchTerm: string
  selectedCategory: string
}

export function PlacesGrid({ searchTerm, selectedCategory }: PlacesGridProps) {
  const [places, setPlaces] = useState<(Place & { place_images?: PlaceImage[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('places')
        .select(`
          *,
          place_images (*)
        `)
        .eq('has_amit_visited', true)
        .order('rating', { ascending: false })

      if (error) throw error
      setPlaces(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load places')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading places: {error}</p>
      </div>
    )
  }

  // Filter places based on search and category
  const filteredPlaces = places.filter((place) => {
    const matchesSearch = searchTerm === '' || 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || 
      place.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (filteredPlaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          {searchTerm || selectedCategory !== 'All' 
            ? 'No places match your filters. Try adjusting your search.'
            : 'No places found. Check back soon!'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredPlaces.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  )
}