'use client'

import { Marker, Popup, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { renderToString } from 'react-dom/server'
import { MapPin, Star, Clock, Phone, Globe, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useMapStore } from '@/stores/mapStore'
import { placesDataService } from '@/lib/services/places-data-service'
import { getCategoryColor, getCategoryIcon } from './MapCategoryFilters'

interface EnhancedPlaceData {
  id: string
  name: string
  description?: string
  latitude: number
  longitude: number
  category?: string
  rating?: number
  address?: string
  phone?: string
  website?: string
  photos?: string[]
  is_open_now?: boolean
  current_opening_hours?: string
  user_ratings_total?: number
  price_level?: number
  google_place_id?: string
}

interface EnhancedPlaceMarkerProps {
  place: EnhancedPlaceData
  size?: 'small' | 'medium' | 'large'
  showLiveStatus?: boolean
}

function PlaceMarkerIcon({ 
  place, 
  isSelected, 
  size = 'medium', 
  showLiveStatus = true 
}: { 
  place: EnhancedPlaceData
  isSelected: boolean
  size?: 'small' | 'medium' | 'large'
  showLiveStatus?: boolean
}) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10', 
    large: 'w-12 h-12'
  }
  
  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }

  const categoryColor = getCategoryColor(place.category || 'other')
  const categoryIcon = getCategoryIcon(place.category || 'other')

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Main marker circle */}
      <div className={`
        ${sizeClasses[size]} rounded-full border-2 border-white shadow-lg
        ${categoryColor} text-white flex items-center justify-center
        ${isSelected ? 'scale-110 shadow-xl' : 'hover:scale-105'}
        transition-all duration-200
      `}>
        {place.photos && place.photos.length > 0 ? (
          <div className="w-full h-full rounded-full overflow-hidden">
            <img 
              src={place.photos[0]} 
              alt={place.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none'
                const iconContainer = e.currentTarget.nextElementSibling as HTMLElement
                if (iconContainer) iconContainer.style.display = 'flex'
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              {categoryIcon}
            </div>
          </div>
        ) : (
          <div className={iconSizes[size]}>
            {categoryIcon}
          </div>
        )}
      </div>

      {/* Live status indicator */}
      {showLiveStatus && place.is_open_now !== undefined && (
        <div className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white
          ${place.is_open_now ? 'bg-green-500' : 'bg-red-500'}
        `} />
      )}

      {/* Rating badge */}
      {place.rating && place.rating >= 4.0 && (
        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 
                        text-xs font-bold px-1 rounded-full border border-white
                        min-w-[16px] text-center">
          {place.rating.toFixed(1)}
        </div>
      )}
    </div>
  )
}

function PlacePopupContent({ place }: { place: EnhancedPlaceData }) {
  const [liveStatus, setLiveStatus] = useState<{
    isOpen: boolean
    status: string
  } | null>(null)

  useEffect(() => {
    // Fetch live status if we have Google Place ID
    if (place.google_place_id) {
      placesDataService.getPlacesLiveStatus([place.id])
        .then(statusMap => {
          const status = statusMap.get(place.id)
          if (status) {
            setLiveStatus(status)
          }
        })
        .catch(console.error)
    }
  }, [place.id, place.google_place_id])

  const renderRating = (rating?: number) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="font-medium">{rating.toFixed(1)}</span>
        {place.user_ratings_total && (
          <span className="text-gray-500 text-sm">({place.user_ratings_total})</span>
        )}
      </div>
    )
  }

  const renderPriceLevel = (priceLevel?: number) => {
    if (!priceLevel) return null
    
    return (
      <div className="flex items-center gap-1">
        <DollarSign className="w-4 h-4 text-green-600" />
        <span className="text-gray-700">
          {'$'.repeat(priceLevel)}
        </span>
      </div>
    )
  }

  const openingStatus = liveStatus || place.is_open_now !== undefined ? {
    isOpen: liveStatus?.isOpen ?? place.is_open_now ?? false,
    status: liveStatus?.status ?? place.current_opening_hours ?? 'Hours not available'
  } : null

  return (
    <div className="max-w-sm">
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-semibold text-lg text-gray-900 leading-tight">
          {place.name}
        </h3>
        {place.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 
                           bg-gray-100 rounded-full mt-1">
            {place.category}
          </span>
        )}
      </div>

      {/* Photos */}
      {place.photos && place.photos.length > 0 && (
        <div className="mb-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {place.photos.slice(0, 3).map((photo, index) => (
              <div key={index} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                <img
                  src={photo}
                  alt={`${place.name} photo ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => window.open(photo, '_blank')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating and Price */}
      <div className="flex items-center justify-between mb-3">
        {renderRating(place.rating)}
        {renderPriceLevel(place.price_level)}
      </div>

      {/* Opening Status */}
      {openingStatus && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            {openingStatus.isOpen ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className={`font-medium ${
              openingStatus.isOpen ? 'text-green-700' : 'text-red-600'
            }`}>
              {openingStatus.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {openingStatus.status}
          </div>
        </div>
      )}

      {/* Description */}
      {place.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {place.description}
        </p>
      )}

      {/* Contact Info */}
      <div className="space-y-2">
        {place.address && (
          <div className="text-sm text-gray-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
            <span>{place.address}</span>
          </div>
        )}
        
        {place.phone && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a href={`tel:${place.phone}`} className="text-blue-600 hover:underline">
              {place.phone}
            </a>
          </div>
        )}
        
        {place.website && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <a 
              href={place.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              Visit website
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`
            window.open(url, '_blank')
          }}
          className="flex-1 px-3 py-2 text-sm font-medium text-primary bg-primary/10 
                     rounded-lg hover:bg-primary/20 transition-colors"
        >
          Directions
        </button>
        
        {place.google_place_id && (
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/place/?q=place_id:${place.google_place_id}`
              window.open(url, '_blank')
            }}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                       rounded-lg hover:bg-gray-200 transition-colors"
          >
            View on Google
          </button>
        )}
      </div>
    </div>
  )
}

export function EnhancedPlaceMarker({ 
  place, 
  size = 'medium',
  showLiveStatus = true 
}: EnhancedPlaceMarkerProps) {
  const { selectedPlace, setSelectedPlace } = useMapStore()
  const map = useMap()
  const isSelected = selectedPlace?.id === place.id

  const markerIcon = divIcon({
    html: renderToString(
      <PlaceMarkerIcon 
        place={place} 
        isSelected={isSelected} 
        size={size}
        showLiveStatus={showLiveStatus}
      />
    ),
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })

  const handleMarkerClick = () => {
    setSelectedPlace(place)
    map.setView([place.latitude, place.longitude], Math.max(map.getZoom(), 16))
  }

  return (
    <Marker
      position={[place.latitude, place.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: handleMarkerClick
      }}
    >
      <Popup
        closeButton={true}
        maxWidth={320}
        className="place-popup"
      >
        <PlacePopupContent place={place} />
      </Popup>
    </Marker>
  )
}