'use client'

import { useEffect, useState } from 'react'
import { Star, Clock, DollarSign, Phone, Globe, MapPin } from 'lucide-react'
import { googlePlacesService } from '@/lib/services/google-places'
import { PlaceDetails } from '@/lib/services/google-places'
import Image from 'next/image'

interface GooglePlacesEnhancedProps {
  placeId?: string
  googlePlaceId?: string
  placeName?: string
  placeAddress?: string
  showPhotos?: boolean
  showReviews?: boolean
  showHours?: boolean
  className?: string
}

export function GooglePlacesEnhanced({
  placeId,
  googlePlaceId,
  placeName,
  placeAddress,
  showPhotos = true,
  showReviews = true,
  showHours = true,
  className = ''
}: GooglePlacesEnhancedProps) {
  const [details, setDetails] = useState<PlaceDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!googlePlaceId && (!placeName || !placeAddress)) return

      setLoading(true)
      try {
        let placeDetails: PlaceDetails | null = null

        if (googlePlaceId) {
          placeDetails = await googlePlacesService.getPlaceDetails(googlePlaceId)
        } else if (placeName) {
          // Try to find the place using name and address
          const query = `${placeName} ${placeAddress || ''} Indiranagar Bangalore`
          placeDetails = await googlePlacesService.findPlaceFromText(query)
          
          if (placeDetails?.place_id) {
            // Get full details
            placeDetails = await googlePlacesService.getPlaceDetails(placeDetails.place_id)
          }
        }

        setDetails(placeDetails)
      } catch (error) {
        console.error('Error fetching place details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [googlePlaceId, placeName, placeAddress])

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (!details) {
    return null
  }

  const getPriceLevelDisplay = (level?: number) => {
    if (!level) return null
    return Array(level).fill('₹').join('')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Photos Gallery */}
      {showPhotos && details.photos && details.photos.length > 0 && (
        <div className="space-y-2">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={googlePlacesService.getPhotoUrl(
                details.photos[selectedPhotoIndex].photo_reference,
                800
              )}
              alt={details.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {details.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {details.photos.slice(0, 5).map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                    selectedPhotoIndex === index ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <Image
                    src={googlePlacesService.getPhotoUrl(photo.photo_reference, 200)}
                    alt={`${details.name} photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-3">
        {/* Rating and Reviews */}
        {details.rating && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{details.rating}</span>
            </div>
            {details.user_ratings_total && (
              <span className="text-gray-500 text-sm">
                ({details.user_ratings_total} reviews)
              </span>
            )}
            {details.price_level && (
              <span className="text-gray-700 font-medium">
                {getPriceLevelDisplay(details.price_level)}
              </span>
            )}
          </div>
        )}

        {/* Business Status and Hours */}
        {showHours && details.opening_hours && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className={`text-sm ${
              details.opening_hours.open_now ? 'text-green-600' : 'text-red-600'
            }`}>
              {googlePlacesService.formatOpeningHours(details.opening_hours)}
            </span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {details.formatted_phone_number && (
            <a
              href={`tel:${details.international_phone_number || details.formatted_phone_number}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">{details.formatted_phone_number}</span>
            </a>
          )}
          {details.website && (
            <a
              href={details.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">Visit Website</span>
            </a>
          )}
          {details.formatted_address && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span className="text-sm">{details.formatted_address}</span>
            </div>
          )}
        </div>

        {/* Editorial Summary */}
        {details.editorial_summary?.overview && (
          <p className="text-gray-700 text-sm leading-relaxed">
            {details.editorial_summary.overview}
          </p>
        )}
      </div>

      {/* Opening Hours Details */}
      {showHours && details.opening_hours?.weekday_text && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Opening Hours
          </h3>
          <div className="space-y-1">
            {details.opening_hours.weekday_text.map((day, index) => {
              const isToday = new Date().getDay() === (index === 6 ? 0 : index + 1)
              return (
                <div
                  key={index}
                  className={`text-sm ${isToday ? 'font-semibold text-orange-600' : 'text-gray-600'}`}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reviews */}
      {showReviews && details.reviews && details.reviews.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Recent Reviews</h3>
          <div className="space-y-3">
            {details.reviews.slice(0, 3).map((review, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{review.author_name}</span>
                  <div className="flex items-center gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{review.text}</p>
                <span className="text-xs text-gray-500">
                  {review.relative_time_description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Place Types */}
      {details.types && details.types.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {details.types
            .filter(type => !type.includes('point_of_interest') && !type.includes('establishment'))
            .slice(0, 5)
            .map(type => (
              <span
                key={type}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {type.replace(/_/g, ' ')}
              </span>
            ))}
        </div>
      )}
    </div>
  )
}