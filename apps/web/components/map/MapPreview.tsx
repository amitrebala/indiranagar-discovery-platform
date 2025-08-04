'use client'

import { useState, useEffect } from 'react'
import { Star, Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import type { Place } from '@/lib/validations'
import { getPlaceImageUrl } from '@/lib/supabase/storage'

interface MapPreviewProps {
  place: Place | null
  position: { x: number; y: number } | null
  isVisible: boolean
}

export function MapPreview({ place, position, isVisible }: MapPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    if (place?.primary_image && !imageUrl) {
      setImageLoading(true)
      getPlaceImageUrl(place.primary_image)
        .then(url => {
          setImageUrl(url)
        })
        .catch(error => {
          console.warn(`Failed to load preview image for ${place.name}:`, error)
        })
        .finally(() => {
          setImageLoading(false)
        })
    } else if (!place) {
      setImageUrl(null)
    }
  }, [place?.primary_image, imageUrl, place])

  if (!isVisible || !place || !position) {
    return null
  }

  const getCategoryColor = (category?: string | null) => {
    if (!category) return 'bg-primary text-white'
    
    switch (category.toLowerCase()) {
      case 'restaurant': return 'bg-red-500 text-white'
      case 'cafe': return 'bg-green-700 text-white'
      case 'activity': return 'bg-yellow-400 text-black'
      default: return 'bg-primary text-white'
    }
  }

  const getWeatherSuitabilityIcon = (conditions?: string[] | null) => {
    if (!conditions || conditions.length === 0) return null
    
    const hasOutdoor = conditions.includes('sunny')
    const hasIndoor = conditions.includes('rainy') || conditions.includes('cloudy')
    
    if (hasOutdoor && hasIndoor) return '🌤️'
    if (hasOutdoor) return '☀️'
    if (hasIndoor) return '🏠'
    return '🌦️'
  }

  return (
    <div 
      className="fixed z-[1000] bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-none max-w-xs"
      style={{ 
        left: position.x, 
        top: position.y - 140,
        transform: 'translateX(-50%)'
      }}
    >
      {/* Image thumbnail */}
      <div className="relative w-full h-20 mb-3 rounded-lg overflow-hidden bg-gray-100">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={place.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* Category badge */}
        {place.category && (
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(place.category)}`}>
            {place.category}
          </div>
        )}
      </div>

      {/* Place info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-sm text-gray-900 leading-tight flex-1 pr-2">
            {place.name}
          </h4>
          
          {/* Rating */}
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full shrink-0">
            <Star size={10} className="text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-yellow-700">
              {place.rating ? place.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed">
          {place.description.length > 80 
            ? `${place.description.slice(0, 80)}...` 
            : place.description
          }
        </p>

        {/* Additional info row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {/* Best time to visit */}
            {place.best_time_to_visit && (
              <div className="flex items-center gap-1 text-gray-500">
                <Clock size={10} />
                <span>{place.best_time_to_visit}</span>
              </div>
            )}
            
            {/* Weather suitability */}
            {place.weather_suitability && place.weather_suitability.length > 0 && (
              <div className="flex items-center gap-1 text-gray-500">
                <span>{getWeatherSuitabilityIcon(place.weather_suitability)}</span>
                <span>{place.weather_suitability.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* View details hint */}
        <div className="text-xs text-primary border-t border-gray-100 pt-2 text-center">
          Click marker for details
        </div>
      </div>

      {/* Arrow pointing down */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
      </div>
    </div>
  )
}

// Hook for managing map preview state
export function useMapPreview() {
  const [previewPlace, setPreviewPlace] = useState<Place | null>(null)
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)

  const showPreview = (place: Place, position: { x: number; y: number }) => {
    setPreviewPlace(place)
    setPreviewPosition(position)
    setIsPreviewVisible(true)
  }

  const hidePreview = () => {
    setIsPreviewVisible(false)
    // Delay clearing the place and position to allow for fade out animation
    setTimeout(() => {
      setPreviewPlace(null)
      setPreviewPosition(null)
    }, 150)
  }

  return {
    previewPlace,
    previewPosition,
    isPreviewVisible,
    showPreview,
    hidePreview
  }
}