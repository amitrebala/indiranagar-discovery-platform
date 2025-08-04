'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Place, PlaceImage } from '@/lib/supabase/types'
import { MapPin, Star, Clock, CheckCircle, ImageIcon, Camera, ExternalLink } from 'lucide-react'
import { usePlaceImage } from '@/hooks/usePlaceImage'

interface PlaceCardEnhancedProps {
  place: Place & { place_images?: PlaceImage[] }
  showAttribution?: boolean
}

export function PlaceCardEnhanced({ place, showAttribution = true }: PlaceCardEnhancedProps) {
  const [manualImageError, setManualImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Use the new image discovery hook
  const { 
    imageUrl: discoveredImageUrl, 
    thumbnailUrl,
    attribution, 
    status: discoveryStatus,
    isFromCache 
  } = usePlaceImage(place)
  
  // Generate slug from place name
  const slug = place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  // Get primary image from database if available
  const primaryImage = place.place_images?.find(img => img.is_primary) || place.place_images?.[0]
  
  // Determine which image to use (prioritize manual uploads)
  const imageUrl = primaryImage && !manualImageError 
    ? getImageUrl(primaryImage.storage_path) 
    : discoveredImageUrl
  
  const isLoading = !primaryImage && discoveryStatus === 'loading'
  const hasImage = imageUrl && imageUrl !== '/images/placeholder-place.jpg'
  
  // Use proxy for external images that need optimization
  const proxiedImageUrl = imageUrl && needsProxy(imageUrl)
    ? `/api/images/proxy?url=${encodeURIComponent(imageUrl)}&w=800&q=85&f=webp`
    : imageUrl
  
  return (
    <Link
      href={`/places/${slug}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image or Placeholder */}
      <div className="aspect-[4/3] relative overflow-hidden">
        {isLoading ? (
          /* Loading state */
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-16 h-16 text-orange-300 animate-pulse" />
              <span className="text-xs text-gray-500">Discovering images...</span>
            </div>
          </div>
        ) : hasImage ? (
          <>
            {/* Gradient placeholder shown while image loads */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-orange-300 animate-pulse" />
              </div>
            )}
            
            {/* Actual image */}
            <Image
              src={proxiedImageUrl!}
              alt={primaryImage?.caption || place.name}
              fill
              className={`object-cover group-hover:scale-105 transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                if (primaryImage) {
                  setManualImageError(true)
                }
              }}
              loading="lazy"
              unoptimized={!needsOptimization(proxiedImageUrl!)}
            />
            
            {/* Image overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Attribution badge */}
            {showAttribution && attribution && !primaryImage && (
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white bg-black/50 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>Photo by {attribution.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{attribution.source}</span>
                  {attribution.url && (
                    <ExternalLink className="w-3 h-3" />
                  )}
                </div>
              </div>
            )}
            
            {/* Cache indicator */}
            {isFromCache && (
              <div className="absolute top-2 left-2 bg-blue-500/80 text-white px-2 py-1 rounded text-xs">
                Cached
              </div>
            )}
          </>
        ) : (
          /* Fallback gradient placeholder */
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-orange-300" />
          </div>
        )}
        
        {/* Verified badge */}
        {place.has_amit_visited && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm bg-opacity-90">
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

// Helper function to get image URL from storage path
function getImageUrl(storagePath: string): string {
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath
  }
  
  if (storagePath.startsWith('places/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/place-images/${storagePath}`
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/place-images/${storagePath}`
}

// Helper function to determine if image needs proxy
function needsProxy(url: string): boolean {
  if (!url.startsWith('http')) return false
  
  try {
    const urlObj = new URL(url)
    const trustedDomains = [
      'supabase.co',
      'images.unsplash.com',
    ]
    
    return !trustedDomains.some(domain => 
      urlObj.hostname.includes(domain)
    )
  } catch {
    return false
  }
}

// Helper function to determine if Next.js image optimization should be used
function needsOptimization(url: string): boolean {
  return !url.includes('/api/images/proxy')
}