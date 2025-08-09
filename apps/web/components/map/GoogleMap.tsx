'use client'

import React, { useEffect, useRef, useCallback, useState, useContext } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { MAP_CONFIG } from '@/lib/constants'

interface GoogleMapProps {
  className?: string
  onMapLoad?: (map: google.maps.Map) => void
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void
  center?: { lat: number; lng: number }
  zoom?: number
  children?: React.ReactNode
}

interface GoogleMapContextType {
  map: google.maps.Map | null
  isLoaded: boolean
}

export const GoogleMapContext = React.createContext<GoogleMapContextType>({
  map: null,
  isLoaded: false
})

export function GoogleMap({
  className = '',
  onMapLoad,
  onBoundsChanged,
  center = MAP_CONFIG.CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  children
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loaderRef = useRef<Loader | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || map) return

    const initMap = async () => {
      try {
        // Get API key from environment
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
        if (!apiKey) {
          throw new Error('Google Maps API key not found')
        }

        // Initialize loader if not already done
        if (!loaderRef.current) {
          loaderRef.current = new Loader({
            apiKey,
            version: 'weekly',
            libraries: ['places', 'geometry']
          })
        }

        // Load Google Maps
        await loaderRef.current.load()

        // Create map instance
        const mapInstance = new google.maps.Map(mapRef.current!, {
          center,
          zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          
          // Map controls
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          
          // Restrict to Bangalore bounds
          restriction: {
            latLngBounds: {
              north: MAP_CONFIG.BANGALORE_BOUNDS.north,
              south: MAP_CONFIG.BANGALORE_BOUNDS.south,
              east: MAP_CONFIG.BANGALORE_BOUNDS.east,
              west: MAP_CONFIG.BANGALORE_BOUNDS.west
            },
            strictBounds: false
          },
          
          // Zoom limits
          minZoom: MAP_CONFIG.MIN_ZOOM,
          maxZoom: MAP_CONFIG.MAX_ZOOM,
          
          // Styling
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'simplified' }]
            },
            {
              featureType: 'road',
              elementType: 'labels',
              stylers: [{ visibility: 'simplified' }]
            }
          ]
        })

        // Set up event listeners
        if (onBoundsChanged) {
          mapInstance.addListener('bounds_changed', () => {
            const bounds = mapInstance.getBounds()
            if (bounds) {
              onBoundsChanged(bounds)
            }
          })
        }

        setMap(mapInstance)
        setIsLoaded(true)
        
        // Notify parent component
        if (onMapLoad) {
          onMapLoad(mapInstance)
        }

      } catch (err) {
        console.error('Failed to initialize Google Maps:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
      }
    }

    initMap()
  }, [center, zoom, onMapLoad, onBoundsChanged, map])

  // Handle map center/zoom changes
  useEffect(() => {
    if (map && (center || zoom)) {
      map.setCenter(center)
      map.setZoom(zoom)
    }
  }, [map, center, zoom])

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-neutral-50`}>
        <div className="text-center p-6">
          <div className="text-red-500 mb-2">⚠️ Map Error</div>
          <div className="text-sm text-neutral-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <GoogleMapContext.Provider value={{ map, isLoaded }}>
      <div className={`relative ${className}`}>
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-neutral-600">Loading Google Maps...</p>
            </div>
          </div>
        )}
        
        {/* Render children (markers, overlays, etc.) */}
        {isLoaded && children}
      </div>
    </GoogleMapContext.Provider>
  )
}

// Hook to access Google Maps context
export function useGoogleMap() {
  const context = useContext(GoogleMapContext)
  if (!context) {
    throw new Error('useGoogleMap must be used within a GoogleMap component')
  }
  return context
}