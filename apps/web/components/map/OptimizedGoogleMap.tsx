'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { MAP_CONFIG } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { APPROVED_PLACES_WHITELIST } from '@/data/approved-places-whitelist'
import { MapPin, Coffee, Utensils, Wine, ShoppingBag, Activity, Store, TreePine, Music, Camera, Palette, Layers, Filter, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Place {
  id: string
  name: string
  latitude: number
  longitude: number
  category?: string
  rating?: number
  address?: string
  description?: string
  is_open_now?: boolean
  user_ratings_total?: number
  price_level?: number
  visited_by_amit?: boolean
  popular_rank?: number
}

interface MapProps {
  className?: string
  initialJourney?: string
  onPlaceSelect?: (place: Place) => void
}

// Category colors and icons
const CATEGORY_CONFIG = {
  'Cafe': { 
    color: '#F59E0B', 
    icon: Coffee,
    label: 'Cafes'
  },
  'Restaurant': { 
    color: '#10B981', 
    icon: Utensils,
    label: 'Restaurants'
  },
  'Bar': { 
    color: '#8B5CF6', 
    icon: Wine,
    label: 'Bars & Pubs'
  },
  'Shopping': { 
    color: '#3B82F6', 
    icon: ShoppingBag,
    label: 'Shopping'
  },
  'Activity': { 
    color: '#EF4444', 
    icon: Activity,
    label: 'Activities'
  },
  'Store': { 
    color: '#6366F1', 
    icon: Store,
    label: 'Stores'
  },
  'Park': { 
    color: '#059669', 
    icon: TreePine,
    label: 'Parks'
  },
  'Music': { 
    color: '#EC4899', 
    icon: Music,
    label: 'Music Venues'
  },
  'Art': { 
    color: '#F97316', 
    icon: Palette,
    label: 'Art & Culture'
  },
  'Photography': { 
    color: '#14B8A6', 
    icon: Camera,
    label: 'Photo Spots'
  },
  'default': { 
    color: '#6B7280', 
    icon: MapPin,
    label: 'Other Places'
  }
}

// Create optimized marker icon with caching
const markerIconCache = new Map<string, google.maps.Icon>()

function getMarkerIcon(category: string = 'default', isHighlighted: boolean = false): google.maps.Icon {
  const cacheKey = `${category}-${isHighlighted}`
  
  if (markerIconCache.has(cacheKey)) {
    return markerIconCache.get(cacheKey)!
  }
  
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.default
  const scale = isHighlighted ? 12 : 10
  
  const icon: google.maps.Icon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: config.color,
    fillOpacity: isHighlighted ? 1 : 0.8,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: scale
  }
  
  markerIconCache.set(cacheKey, icon)
  return icon
}

// Map Legend Component
function MapLegend({ 
  showAmitPlaces, 
  onToggle 
}: { 
  showAmitPlaces: boolean
  onToggle: () => void 
}) {
  return (
    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-[280px]">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full mb-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          showAmitPlaces 
            ? "bg-primary text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        {showAmitPlaces ? "Showing Amit's Places" : "Showing All Places"}
      </button>
      
      {/* Legend Items */}
      <div className="space-y-1 text-xs">
        <div className="font-semibold text-gray-700 mb-1">Categories</div>
        {Object.entries(CATEGORY_CONFIG).filter(([key]) => key !== 'default').map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: config.color }}
            />
            <span className="text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Performance tips overlay
function PerformanceTips() {
  return (
    <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-2 max-w-[200px] text-xs text-blue-700">
      <div className="font-semibold mb-1">Tips for best performance:</div>
      <ul className="space-y-0.5">
        <li>• Zoom in to load more places</li>
        <li>• Click markers for details</li>
        <li>• Use filters to refine</li>
      </ul>
    </div>
  )
}

export function OptimizedGoogleMap({ 
  className = '', 
  initialJourney,
  onPlaceSelect 
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [showAmitPlaces, setShowAmitPlaces] = useState(true)
  const [currentZoom, setCurrentZoom] = useState(MAP_CONFIG.DEFAULT_ZOOM)
  const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([])

  // Load places from Supabase
  const loadPlaces = useCallback(async () => {
    try {
      const supabase = createClient()
      
      // Build query based on toggle
      let query = supabase
        .from('places')
        .select('*')
      
      if (showAmitPlaces) {
        // Only show Amit's visited places
        query = query.in('name', APPROVED_PLACES_WHITELIST)
      } else {
        // Show popular places (limit to 50 initially for performance)
        query = query
          .order('rating', { ascending: false })
          .limit(50)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      // Add visited_by_amit flag and popular rank
      const processedPlaces = (data || []).map((place, index) => ({
        ...place,
        visited_by_amit: APPROVED_PLACES_WHITELIST.includes(place.name),
        popular_rank: index + 1
      }))
      
      setPlaces(processedPlaces)
    } catch (err) {
      console.error('Error loading places:', err)
      setError('Failed to load places')
    }
  }, [showAmitPlaces])

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!,
          version: 'weekly',
          libraries: ['places', 'geometry']
        })

        await loader.load()

        // Create map with optimized settings
        const map = new google.maps.Map(mapRef.current!, {
          center: MAP_CONFIG.CENTER,
          zoom: MAP_CONFIG.DEFAULT_ZOOM,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          
          // Optimize controls for mobile
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          
          // Restrict to Bangalore
          restriction: {
            latLngBounds: {
              north: MAP_CONFIG.BANGALORE_BOUNDS.north,
              south: MAP_CONFIG.BANGALORE_BOUNDS.south,
              east: MAP_CONFIG.BANGALORE_BOUNDS.east,
              west: MAP_CONFIG.BANGALORE_BOUNDS.west
            },
            strictBounds: false
          },
          
          // Performance optimizations
          gestureHandling: 'greedy',
          clickableIcons: false,
          
          // Custom map style for better visibility
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        googleMapRef.current = map
        
        // Create info window
        infoWindowRef.current = new google.maps.InfoWindow()
        
        // Listen to zoom changes for progressive loading
        map.addListener('zoom_changed', () => {
          const zoom = map.getZoom()
          if (zoom) {
            setCurrentZoom(zoom)
            
            // Load more places when zoomed in
            if (zoom >= 16 && !showAmitPlaces) {
              // TODO: Load additional places in viewport
            }
          }
        })
        
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to initialize Google Maps:', err)
        setError('Failed to load map')
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  // Load places when toggle changes
  useEffect(() => {
    loadPlaces()
  }, [showAmitPlaces, loadPlaces])

  // Update markers when places change
  useEffect(() => {
    if (!googleMapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current.clear()

    // Determine which places to show based on zoom
    const placesToShow = currentZoom >= 15 
      ? places 
      : places.slice(0, showAmitPlaces ? places.length : 30) // Show fewer markers when zoomed out

    // Add new markers
    placesToShow.forEach(place => {
      const marker = new google.maps.Marker({
        position: { lat: place.latitude, lng: place.longitude },
        map: googleMapRef.current!,
        title: place.name,
        icon: getMarkerIcon(place.category, place.visited_by_amit),
        animation: place.visited_by_amit ? google.maps.Animation.DROP : undefined,
        optimized: true, // Performance optimization
        zIndex: place.visited_by_amit ? 1000 : place.popular_rank || 100
      })

      // Add click listener for info window
      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div class="p-2 max-w-[200px]">
              <h3 class="font-semibold text-sm">${place.name}</h3>
              ${place.category ? `<p class="text-xs text-gray-600">${place.category}</p>` : ''}
              ${place.rating ? `<p class="text-xs">⭐ ${place.rating}</p>` : ''}
              ${place.visited_by_amit ? '<p class="text-xs text-primary font-medium">✓ Amit visited</p>' : ''}
              ${place.address ? `<p class="text-xs text-gray-500 mt-1">${place.address}</p>` : ''}
            </div>
          `)
          infoWindowRef.current.open(googleMapRef.current!, marker)
        }
        
        // Notify parent component
        if (onPlaceSelect) {
          onPlaceSelect(place)
        }
      })

      markersRef.current.set(place.id, marker)
    })

    setVisiblePlaces(placesToShow)
  }, [places, currentZoom, showAmitPlaces, onPlaceSelect])

  // Handle journey navigation from homepage
  useEffect(() => {
    if (!initialJourney || !googleMapRef.current) return

    // TODO: Load and display journey route
    console.log('Loading journey:', initialJourney)
  }, [initialJourney])

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-50", className)}>
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Google Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Map Legend */}
      {!isLoading && (
        <MapLegend 
          showAmitPlaces={showAmitPlaces}
          onToggle={() => setShowAmitPlaces(!showAmitPlaces)}
        />
      )}
      
      {/* Performance Tips (show briefly) */}
      {!isLoading && !showAmitPlaces && currentZoom < 15 && (
        <PerformanceTips />
      )}
      
      {/* Stats */}
      {!isLoading && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 text-xs">
          <div className="font-semibold">{visiblePlaces.length} places</div>
          <div className="text-gray-600">
            {showAmitPlaces ? "Amit's visited" : `Top ${visiblePlaces.length} popular`}
          </div>
        </div>
      )}
    </div>
  )
}