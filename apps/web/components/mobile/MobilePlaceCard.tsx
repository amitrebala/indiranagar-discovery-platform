'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Clock, Phone, Share2, Heart, CloudRain } from 'lucide-react'
import { Place } from '@/lib/validations'

interface MobilePlaceCardProps {
  place: Place & {
    primary_image?: string
    distance?: number
    estimated_time?: number
  }
  onFavorite?: (placeId: string) => void
  onShare?: (place: Place) => void
  isFavorited?: boolean
  showDistance?: boolean
  compact?: boolean
}

export default function MobilePlaceCard({ 
  place, 
  onFavorite,
  onShare,
  isFavorited = false,
  showDistance = false,
  compact = false
}: MobilePlaceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - Math.ceil(rating)

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-3 h-3 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-3 h-3 text-gray-300" />
        ))}
      </div>
    )
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare?.(place)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite?.(place.id)
  }

  if (compact) {
    return (
      <Link href={`/places/${place.id}`}>
        <div className="mobile-place-card-compact bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex gap-3">
            {/* Image */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <div className={`w-full h-full bg-gray-200 rounded-lg ${!imageLoaded && !imageError ? 'animate-pulse' : ''}`}>
                {place.primary_image && !imageError ? (
                  <Image
                    src={place.primary_image}
                    alt={place.name}
                    fill
                    className={`object-cover rounded-lg ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                  {place.name}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  {renderStars(place.rating)}
                  <span className="text-xs text-gray-600">({place.rating})</span>
                </div>
              </div>
              
              {place.category && (
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-1">
                  {place.category}
                </span>
              )}
              
              <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                {place.description}
              </p>

              {showDistance && place.distance && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{place.distance}m away</span>
                  {place.estimated_time && (
                    <>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{place.estimated_time}min walk</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/places/${place.id}`}>
      <div className="mobile-place-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Image Section */}
        <div className="relative h-48">
          <div className={`w-full h-full bg-gray-200 ${!imageLoaded && !imageError ? 'animate-pulse' : ''}`}>
            {place.primary_image && !imageError ? (
              <Image
                src={place.primary_image}
                alt={place.name}
                fill
                className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Overlay Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Category Badge */}
          {place.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-black/70 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                {place.category}
              </span>
            </div>
          )}

          {/* Distance Badge */}
          {showDistance && place.distance && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/70 text-white rounded-full text-xs backdrop-blur-sm">
                <MapPin className="w-3 h-3" />
                <span>{place.distance}m</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Rating */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1 mr-2">
              {place.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {renderStars(place.rating)}
              <span className="text-sm text-gray-600 ml-1">
                {place.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
            {place.description}
          </p>

          {/* Weather Suitability */}
          {place.weather_suitability && place.weather_suitability.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {place.weather_suitability.slice(0, 3).map((condition) => (
                <div
                  key={condition}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                >
                  <CloudRain className="w-3 h-3" />
                  <span className="capitalize">{condition}</span>
                </div>
              ))}
            </div>
          )}

          {/* Best Time to Visit */}
          {place.best_time_to_visit && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="line-clamp-1">{place.best_time_to_visit}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}