'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Place } from '@/lib/supabase/types'
import { MapPin, Star, Clock, CheckCircle } from 'lucide-react'
import { PlaceCardSkeleton } from './PlaceCardSkeleton'

interface PlacesGridProps {
  searchTerm: string
  selectedCategory: string
}

export function PlacesGrid({ searchTerm, selectedCategory }: PlacesGridProps) {
  const [places, setPlaces] = useState<Place[]>([])
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
        .select('*')
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

function PlaceCard({ place }: { place: Place }) {
  // Generate slug from place name
  const slug = place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  return (
    <Link
      href={`/places/${slug}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Placeholder image - could be replaced with actual images */}
      <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-green-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-orange-300" />
        </div>
        {place.has_amit_visited && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {place.name}
        </h3>
        
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {place.description}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {place.category || 'Uncategorized'}
          </span>
          
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{place.rating}</span>
          </div>
        </div>
        
        {place.best_time_to_visit && (
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{place.best_time_to_visit}</span>
          </div>
        )}
      </div>
    </Link>
  )
}