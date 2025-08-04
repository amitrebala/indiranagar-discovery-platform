'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Clock, Phone, Share2, Heart, CloudRain } from 'lucide-react'
import { Place } from '@/lib/validations'
import { useHapticFeedback, HapticPattern } from '@/hooks/useHapticFeedback'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { TouchFeedback } from '@/components/ui/TouchFeedback'
import { OptimizedImage } from '@/components/ui/OptimizedImage'

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
  isLoadingFavorite?: boolean
  isLoadingShare?: boolean
}

export default function MobilePlaceCard({ 
  place, 
  onFavorite,
  onShare,
  isFavorited = false,
  showDistance = false,
  compact = false,
  isLoadingFavorite = false,
  isLoadingShare = false
}: MobilePlaceCardProps) {
  const { triggerHaptic } = useHapticFeedback({ respectReducedMotion: true })

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
    
    // Trigger haptic feedback for share action
    triggerHaptic(HapticPattern.LIGHT)
    
    onShare?.(place)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Trigger different haptic patterns based on action
    if (isFavorited) {
      triggerHaptic(HapticPattern.LIGHT) // Removing from favorites
    } else {
      triggerHaptic(HapticPattern.SUCCESS) // Adding to favorites
    }
    
    onFavorite?.(place.id)
  }

  if (compact) {
    return (
      <Link 
        href={`/places/${place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
        className="focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 rounded-lg"
        aria-label={`View details for ${place.name}`}
      >
        <div className="mobile-place-card-compact bg-white rounded-lg shadow-sm border border-neutral-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex gap-3">
            {/* Image */}
            <div className="relative w-16 h-16 flex-shrink-0">
              {place.primary_image ? (
                <OptimizedImage
                  src={place.primary_image}
                  alt={place.name}
                  width={64}
                  height={64}
                  priority="low"
                  isAboveFold={false}
                  className="object-cover rounded-lg"
                  errorFallback={
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-neutral-400" aria-hidden="true" />
                    </div>
                  }
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-neutral-400" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-neutral-900 text-sm line-clamp-1">
                  {place.name}
                </h3>
                <div className="flex items-center gap-1 ml-2" role="img" aria-label={`${place.rating} out of 5 stars`}>
                  {renderStars(place.rating)}
                  <span className="text-xs text-neutral-600" aria-hidden="true">({place.rating})</span>
                </div>
              </div>
              
              {place.category && (
                <span className="inline-block px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-medium mb-1">
                  {place.category}
                </span>
              )}
              
              <p className="text-neutral-600 text-xs line-clamp-2 leading-relaxed">
                {place.description}
              </p>

              {showDistance && place.distance && (
                <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  <span>{place.distance}m away</span>
                  {place.estimated_time && (
                    <>
                      <span aria-hidden="true">•</span>
                      <Clock className="w-3 h-3" aria-hidden="true" />
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
    <Link 
      href={`/places/${place.id}`}
      className="focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 rounded-xl"
      aria-label={`View details for ${place.name} - ${place.rating} stars`}
    >
      <div className="mobile-place-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Image Section */}
        <div className="relative h-48">
          {place.primary_image ? (
            <OptimizedImage
              src={place.primary_image}
              alt={place.name}
              width={400}
              height={192}
              priority="medium"
              isAboveFold={false}
              className="object-cover"
              style={{ width: '100%', height: '100%' }}
              errorFallback={
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-neutral-400" aria-hidden="true" />
                </div>
              }
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-neutral-400" aria-hidden="true" />
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <TouchFeedback feedbackType="scale" intensity="medium" hapticPattern={HapticPattern.SELECTION}>
              <LoadingButton
                onClick={handleFavorite}
                loading={isLoadingFavorite}
                variant={isFavorited ? 'danger' : 'ghost'}
                size="sm"
                className={`min-w-[44px] min-h-[44px] rounded-full backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isFavorited 
                    ? 'bg-error-600 text-white focus:ring-error-300' 
                    : 'bg-white/80 text-neutral-700 hover:bg-white focus:ring-primary-600'
                }`}
                aria-label={isFavorited ? `Remove ${place.name} from favorites` : `Add ${place.name} to favorites`}
                aria-pressed={isFavorited}
                hapticPattern={isFavorited ? HapticPattern.LIGHT : HapticPattern.SUCCESS}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} aria-hidden="true" />
              </LoadingButton>
            </TouchFeedback>
            
            <TouchFeedback feedbackType="scale" intensity="medium" hapticPattern={HapticPattern.SELECTION}>
              <LoadingButton
                onClick={handleShare}
                loading={isLoadingShare}
                variant="ghost"
                size="sm"
                className="min-w-[44px] min-h-[44px] rounded-full bg-white/80 backdrop-blur-sm text-neutral-700 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                aria-label={`Share ${place.name}`}
                hapticPattern={HapticPattern.LIGHT}
              >
                <Share2 className="w-4 h-4" aria-hidden="true" />
              </LoadingButton>
            </TouchFeedback>
          </div>

          {/* Category Badge */}
          {place.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-neutral-800/70 text-white rounded-full text-xs font-medium backdrop-blur-sm" role="text">
                {place.category}
              </span>
            </div>
          )}

          {/* Distance Badge */}
          {showDistance && place.distance && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-neutral-800/70 text-white rounded-full text-xs backdrop-blur-sm" role="text">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                <span>{place.distance}m away</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Rating */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-neutral-900 text-lg line-clamp-2 flex-1 mr-2">
              {place.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0" role="img" aria-label={`${place.rating.toFixed(1)} out of 5 stars`}>
              {renderStars(place.rating)}
              <span className="text-sm text-neutral-600 ml-1" aria-hidden="true">
                {place.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-neutral-700 text-sm leading-relaxed mb-3 line-clamp-2">
            {place.description}
          </p>

          {/* Weather Suitability */}
          {place.weather_suitability && place.weather_suitability.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3" role="list" aria-label="Weather suitability">
              {place.weather_suitability.slice(0, 3).map((condition) => (
                <div
                  key={condition}
                  className="flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs"
                  role="listitem"
                >
                  <CloudRain className="w-3 h-3" aria-hidden="true" />
                  <span className="capitalize">{condition}</span>
                </div>
              ))}
            </div>
          )}

          {/* Best Time to Visit */}
          {place.best_time_to_visit && (
            <div className="flex items-center gap-1 text-sm text-neutral-600 mb-3">
              <Clock className="w-4 h-4 text-success-600" aria-hidden="true" />
              <span className="line-clamp-1">{place.best_time_to_visit}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <LoadingButton 
              variant="primary"
              size="md"
              className="flex-1"
              aria-label={`Contact ${place.name}`}
              hapticPattern={HapticPattern.MEDIUM}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>Contact</span>
            </LoadingButton>
            
            <LoadingButton 
              variant="outline"
              size="md"
              className="flex-1"
              aria-label={`Get directions to ${place.name}`}
              hapticPattern={HapticPattern.MEDIUM}
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Directions</span>
            </LoadingButton>
          </div>
        </div>
      </div>
    </Link>
  )
}