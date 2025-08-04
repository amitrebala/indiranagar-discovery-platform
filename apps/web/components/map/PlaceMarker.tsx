'use client'

import { Marker, Popup, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { renderToString } from 'react-dom/server'
import { MapPin, Star, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Place } from '@/lib/validations'
import { useMapStore } from '@/stores/mapStore'
import { getPlaceImageUrl } from '@/lib/supabase/storage'
import { MAP_CONFIG } from '@/lib/constants'

interface PlaceMarkerProps {
  place: Place
  size?: 'small' | 'medium' | 'large'
}

function PhotoMarkerIcon({ place, isSelected, size = 'medium', imageUrl }: { 
  place: Place; 
  isSelected: boolean; 
  size?: 'small' | 'medium' | 'large';
  imageUrl?: string;
}) {
  const rating = place.rating || 0
  const sizeClasses = {
    small: 'w-9 h-9', // 36px
    medium: 'w-12 h-12', // 48px  
    large: 'w-16 h-16' // 64px
  }
  
  const categoryColors = {
    restaurant: 'border-red-500',
    cafe: 'border-green-700', 
    activity: 'border-yellow-400',
    default: 'border-primary'
  }
  
  const borderColor = place.category ? 
    (categoryColors[place.category.toLowerCase() as keyof typeof categoryColors] || categoryColors.default) : 
    categoryColors.default
  
  return (
    <div 
      className={`
        relative ${sizeClasses[size]} rounded-full border-2 shadow-lg overflow-hidden
        ${isSelected 
          ? `${borderColor} scale-110 border-4` 
          : `${borderColor} hover:scale-105`
        }
        ${rating >= 4.5 ? 'border-yellow-400 border-3' : ''}
        transition-all duration-200 bg-white
      `}
    >
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt={place.name}
          fill
          className="object-cover"
          loading="lazy"
          sizes="60px"
        />
      ) : (
        <div className={`w-full h-full bg-primary flex items-center justify-center`}>
          <MapPin 
            size={size === 'small' ? 12 : size === 'medium' ? 16 : 20} 
            className="text-white" 
          />
        </div>
      )}
      
      {/* Category indicator */}
      {place.category && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200">
          <div className={`w-2 h-2 rounded-full ${
            place.category.toLowerCase() === 'restaurant' ? 'bg-red-500' :
            place.category.toLowerCase() === 'cafe' ? 'bg-green-700' :
            place.category.toLowerCase() === 'activity' ? 'bg-yellow-400' :
            'bg-primary'
          }`} />
        </div>
      )}
      
      {/* High rating indicator */}
      {rating >= 4.5 && (
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
          <Star size={8} className="text-black fill-current" />
        </div>
      )}
      
      {/* Amit visited indicator */}
      {place.has_amit_visited && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
          <CheckCircle size={12} className="text-white fill-current" />
        </div>
      )}
    </div>
  )
}

// Unused for now, but keeping for future enhancement
/*
function MarkerIcon({ place, isSelected }: { place: Place; isSelected: boolean }) {
  const rating = place.rating || 0
  
  return (
    <div 
      className={`
        relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg
        ${isSelected 
          ? 'bg-accent border-primary scale-110' 
          : 'bg-primary border-white hover:scale-105'
        }
        transition-all duration-200
      `}
    >
      <MapPin 
        size={16} 
        className={`${isSelected ? 'text-primary' : 'text-white'}`} 
      />
      {rating >= 4.0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
          <Star size={8} className="text-primary fill-current" />
        </div>
      )}
    </div>
  )
}
*/

export function PlaceMarker({ place, size = 'medium' }: PlaceMarkerProps) {
  const { selectedPlace, selectPlace, zoom } = useMapStore()
  const isSelected = selectedPlace?.id === place.id
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  // const [imageLoading, setImageLoading] = useState(false)
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null)
  const map = useMap()
  
  // Determine marker size based on zoom level
  const dynamicSize = zoom >= 16 ? 'large' : zoom >= 14 ? 'medium' : 'small'
  const markerSize = size || dynamicSize
  
  // Load place image URL
  useEffect(() => {
    if (place.primary_image && !imageUrl) {
      // setImageLoading(true)
      getPlaceImageUrl(place.primary_image)
        .then(url => {
          setImageUrl(url)
        })
        .catch(error => {
          console.warn(`Failed to load image for place ${place.name}:`, error)
        })
        .finally(() => {
          // setImageLoading(false)
        })
    }
  }, [place.primary_image, imageUrl, place.name])
  
  // Create custom marker icon with photo
  const customIcon = divIcon({
    html: renderToString(
      <PhotoMarkerIcon 
        place={place} 
        isSelected={isSelected} 
        size={markerSize}
        imageUrl={imageUrl || undefined}
      />
    ),
    className: 'photo-marker',
    iconSize: markerSize === 'small' ? [36, 36] : markerSize === 'medium' ? [48, 48] : [64, 64],
    iconAnchor: markerSize === 'small' ? [18, 18] : markerSize === 'medium' ? [24, 24] : [32, 32],
    popupAnchor: [0, markerSize === 'small' ? -18 : markerSize === 'medium' ? -24 : -32],
  })

  const handleMarkerClick = () => {
    selectPlace(place)
    
    // Check if place is outside Indiranagar bounds
    const { INDIRANAGAR_BOUNDS } = MAP_CONFIG
    const isOutsideIndiranagar = 
      place.latitude < INDIRANAGAR_BOUNDS.south ||
      place.latitude > INDIRANAGAR_BOUNDS.north ||
      place.longitude < INDIRANAGAR_BOUNDS.west ||
      place.longitude > INDIRANAGAR_BOUNDS.east
    
    // If outside Indiranagar, expand the map view
    if (isOutsideIndiranagar && map) {
      map.setView([place.latitude, place.longitude], MAP_CONFIG.EXPANDED_ZOOM, {
        animate: true,
        duration: 0.5
      })
    }
  }
  
  const handleMarkerMouseOver = () => {
    setHoveredPlace(place)
  }
  
  const handleMarkerMouseOut = () => {
    setHoveredPlace(null)
  }

  return (
    <Marker
      position={[place.latitude, place.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: handleMarkerClick,
        mouseover: handleMarkerMouseOver,
        mouseout: handleMarkerMouseOut,
      }}
    >
      <Popup>
        <div className="min-w-[200px] p-2">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-primary text-sm pr-2">
              {place.name}
            </h3>
            <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-full">
              <Star size={12} className="text-primary fill-current" />
              <span className="text-xs font-medium text-primary">
                {place.rating?.toFixed(1) || 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            {place.category && (
              <span className="inline-block bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full">
                {place.category}
              </span>
            )}
            {place.has_amit_visited && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                <CheckCircle size={10} />
                Verified
              </span>
            )}
          </div>
          
          <p className="text-neutral-600 text-xs leading-relaxed mb-3">
            {place.description.length > 120 
              ? `${place.description.slice(0, 120)}...` 
              : place.description
            }
          </p>
          
          {place.best_time_to_visit && (
            <div className="text-xs text-neutral-500 mb-2">
              <strong>Best time:</strong> {place.best_time_to_visit}
            </div>
          )}
          
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <span>
              {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
            </span>
            <a 
              href={`/places/${place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="text-primary hover:text-primary/80 font-medium"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              View Details →
            </a>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}