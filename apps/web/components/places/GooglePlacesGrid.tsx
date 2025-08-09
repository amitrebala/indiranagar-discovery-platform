'use client'

import { useEffect, useState } from 'react'
import { Star, MapPin, Clock, ExternalLink, TrendingUp, Search } from 'lucide-react'
import { PlaceCardSkeleton } from './PlaceCardSkeleton'
import Image from 'next/image'

interface GooglePlace {
  place_id: string
  name: string
  rating?: number
  user_ratings_total?: number
  vicinity?: string
  types?: string[]
  opening_hours?: {
    open_now?: boolean
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  price_level?: number
}

export function GooglePlacesGrid() {
  const [places, setPlaces] = useState<GooglePlace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchType, setSearchType] = useState<string>('restaurant')
  const [sortBy, setSortBy] = useState<'rating' | 'popularity'>('rating')

  // Indiranagar center coordinates (100 Feet Road area)
  const INDIRANAGAR_CENTER = {
    lat: 12.9783,
    lng: 77.6408
  }

  useEffect(() => {
    fetchGooglePlaces()
  }, [searchType])

  const fetchGooglePlaces = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/places/nearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: INDIRANAGAR_CENTER.lat,
          lng: INDIRANAGAR_CENTER.lng,
          radius: 2000, // 2km radius
          type: searchType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || `Failed to fetch places (${response.status})`)
      }

      const data = await response.json()
      
      if (data.status === 'OK' && data.results) {
        // Sort places by rating (highest first) and filter out those without ratings
        const sortedPlaces = data.results
          .filter((place: GooglePlace) => place.rating && place.rating > 0)
          .sort((a: GooglePlace, b: GooglePlace) => {
            if (sortBy === 'rating') {
              return (b.rating || 0) - (a.rating || 0)
            } else {
              return (b.user_ratings_total || 0) - (a.user_ratings_total || 0)
            }
          })
        
        setPlaces(sortedPlaces)
      } else {
        setPlaces([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load places')
    } finally {
      setLoading(false)
    }
  }

  const getPlacePhoto = (place: GooglePlace) => {
    if (place.photos && place.photos.length > 0) {
      const photoRef = place.photos[0].photo_reference
      return `/api/places/photo?photo_reference=${photoRef}&maxwidth=400`
    }
    return '/images/placeholder-place.jpg'
  }

  const getPriceLevel = (level?: number) => {
    if (!level) return null
    return '₹'.repeat(level)
  }

  const getPlaceCategory = (types?: string[]) => {
    if (!types || types.length === 0) return 'Place'
    
    const categoryMap: Record<string, string> = {
      restaurant: 'Restaurant',
      cafe: 'Café',
      bar: 'Bar',
      bakery: 'Bakery',
      food: 'Food',
      meal_delivery: 'Delivery',
      meal_takeaway: 'Takeaway',
      shopping_mall: 'Shopping',
      clothing_store: 'Fashion',
      park: 'Park',
      gym: 'Fitness',
      spa: 'Spa & Wellness',
      movie_theater: 'Entertainment',
      tourist_attraction: 'Attraction',
    }

    for (const type of types) {
      if (categoryMap[type]) {
        return categoryMap[type]
      }
    }
    
    return types[0].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full sm:w-48"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full sm:w-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </div>
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

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="restaurant">Restaurants</option>
          <option value="cafe">Cafés</option>
          <option value="bar">Bars & Pubs</option>
          <option value="bakery">Bakeries</option>
          <option value="shopping_mall">Shopping</option>
          <option value="park">Parks</option>
          <option value="gym">Fitness</option>
          <option value="spa">Spa & Wellness</option>
          <option value="movie_theater">Entertainment</option>
          <option value="tourist_attraction">Attractions</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as 'rating' | 'popularity')
            const sortedPlaces = [...places].sort((a, b) => {
              if (e.target.value === 'rating') {
                return (b.rating || 0) - (a.rating || 0)
              } else {
                return (b.user_ratings_total || 0) - (a.user_ratings_total || 0)
              }
            })
            setPlaces(sortedPlaces)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="rating">Sort by Rating</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Search className="w-4 h-4 mr-2" />
        Found {places.length} places in Indiranagar
      </div>

      {places.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No places found. Try selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {places.map((place) => (
            <div
              key={place.place_id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={getPlacePhoto(place)}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder-place.jpg'
                  }}
                />
                {place.opening_hours && (
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    place.opening_hours.open_now 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{place.name}</h3>
                
                {/* Rating and reviews */}
                {place.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium ml-1">{place.rating.toFixed(1)}</span>
                    </div>
                    {place.user_ratings_total && (
                      <span className="text-xs text-gray-500">
                        ({place.user_ratings_total.toLocaleString()} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Category and price */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {getPlaceCategory(place.types)}
                  </span>
                  {place.price_level && (
                    <span className="text-sm font-medium text-green-600">
                      {getPriceLevel(place.price_level)}
                    </span>
                  )}
                </div>

                {/* Address */}
                {place.vicinity && (
                  <div className="flex items-start gap-1 text-xs text-gray-600 mb-3">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{place.vicinity}</span>
                  </div>
                )}

                {/* View on Google Maps */}
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View on Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}