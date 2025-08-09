'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { GoogleMap } from './GoogleMap'
import { GoogleMapMarker, getCategoryMarkerIcon } from './GoogleMapMarker'
import { MapSearchBar } from './MapSearchBar'
import { MapCategoryFilters } from './MapCategoryFilters'
import { MapLoadingSkeleton } from '@/components/ui/SkeletonLoaders'
import { useMapStore } from '@/stores/mapStore'
import { placesDataService } from '@/lib/services/places-data-service'
import { MAP_CONFIG } from '@/lib/constants'
import { Loader2, MapPin, RefreshCw, Filter } from 'lucide-react'

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

interface PlaceSearchOptions {
  categories?: string[]
  keyword?: string
  openNow?: boolean
  minRating?: number
  maxResults?: number
}

// Error state component
function MapError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="absolute inset-0 bg-neutral-50 flex items-center justify-center z-10">
      <div className="text-center p-6 max-w-sm">
        <MapPin className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-error mb-2">
          Failed to load map
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  )
}

// Enhanced map controls component
function EnhancedMapControls({ 
  showFilters,
  toggleFilters,
  onRefreshPlaces
}: {
  showFilters: boolean
  toggleFilters: () => void
  onRefreshPlaces: () => void
}) {
  const { resetMapView } = useMapStore()

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto map-controls">
      <button
        onClick={toggleFilters}
        className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors ${
          showFilters
            ? 'bg-blue-500 text-white'
            : 'bg-white text-blue-500 border border-blue-500/20'
        }`}
        title={showFilters ? 'Hide filters' : 'Show filters'}
      >
        <Filter size={16} />
      </button>
      
      <button
        onClick={resetMapView}
        className="px-3 py-2 bg-white text-primary border border-primary/20 rounded-lg shadow-lg text-sm font-medium hover:bg-primary/5 transition-colors"
        title="Reset map view"
      >
        Reset View
      </button>
      
      <button
        onClick={onRefreshPlaces}
        className="px-3 py-2 bg-white text-primary border border-primary/20 rounded-lg shadow-lg text-sm font-medium hover:bg-primary/5 transition-colors"
        title="Refresh places"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  )
}

interface GoogleMapsInteractiveMapProps {
  className?: string
}

export function GoogleMapsInteractiveMap({ className = '' }: GoogleMapsInteractiveMapProps) {
  // State
  const [places, setPlaces] = useState<EnhancedPlaceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState<EnhancedPlaceData[]>([])
  const [map, setMap] = useState<google.maps.Map | null>(null)
  
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showOpenNow, setShowOpenNow] = useState(false)
  const [minRating, setMinRating] = useState<number | undefined>()
  
  // Map store
  const { setMapView, setBounds, setMapReady } = useMapStore()

  // Load places based on viewport bounds
  const loadViewportPlaces = useCallback(async (bounds: google.maps.LatLngBounds, options: PlaceSearchOptions = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const boundsObj = {
        north: bounds.getNorthEast().lat(),
        south: bounds.getSouthWest().lat(),
        east: bounds.getNorthEast().lng(),
        west: bounds.getSouthWest().lng()
      }

      const viewportPlaces = await placesDataService.getViewportPlaces(boundsObj, {
        categories: options.categories?.length ? options.categories : undefined,
        keyword: options.keyword,
        openNow: options.openNow,
        minRating: options.minRating,
        maxResults: 100
      })
      
      setPlaces(viewportPlaces)
    } catch (err) {
      console.error('Error loading viewport places:', err)
      setError('Failed to load places in this area')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle map load
  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
    setMapReady(true)
    
    // Update store with initial map state
    const center = mapInstance.getCenter()
    const zoom = mapInstance.getZoom()
    const bounds = mapInstance.getBounds()
    
    if (center) setMapView(center, zoom || MAP_CONFIG.DEFAULT_ZOOM)
    if (bounds) setBounds(bounds)
  }, [setMapView, setBounds, setMapReady])

  // Handle bounds changed
  const handleBoundsChanged = useCallback((bounds: google.maps.LatLngBounds) => {
    setBounds(bounds)
    
    const options: PlaceSearchOptions = {
      categories: selectedCategories,
      openNow: showOpenNow,
      minRating: minRating
    }
    
    // Debounce viewport loading
    const timeoutId = setTimeout(() => {
      loadViewportPlaces(bounds, options)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [selectedCategories, showOpenNow, minRating, loadViewportPlaces, setBounds])

  // Handle place selection from search
  const handlePlaceSelect = (place: EnhancedPlaceData) => {
    if (map) {
      map.setCenter({ lat: place.latitude, lng: place.longitude })
      map.setZoom(17)
      setSearchResults([])
    }
  }

  // Handle search results
  const handleSearchResults = (results: EnhancedPlaceData[]) => {
    setSearchResults(results)
  }

  // Handle filter changes
  useEffect(() => {
    if (map) {
      const bounds = map.getBounds()
      if (bounds) {
        loadViewportPlaces(bounds, {
          categories: selectedCategories,
          openNow: showOpenNow,
          minRating: minRating
        })
      }
    }
  }, [selectedCategories, showOpenNow, minRating, map, loadViewportPlaces])

  // Handle retry
  const handleRetry = () => {
    setMapError(null)
    setError(null)
    window.location.reload()
  }
  
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const refreshPlaces = () => {
    placesDataService.clearCache()
    if (map) {
      const bounds = map.getBounds()
      if (bounds) {
        handleBoundsChanged(bounds)
      }
    }
  }

  const resetMapView = () => {
    if (map) {
      map.setCenter(MAP_CONFIG.CENTER)
      map.setZoom(MAP_CONFIG.DEFAULT_ZOOM)
    }
  }

  if (mapError) {
    return (
      <div className={`relative ${className}`}>
        <MapError error={mapError} onRetry={handleRetry} />
      </div>
    )
  }

  const displayPlaces = searchResults.length > 0 ? searchResults : places

  return (
    <div className={`relative ${className}`}>
      {/* Search bar overlay */}
      <div className="absolute top-4 left-4 right-20 z-10 pointer-events-none">
        <div className="max-w-md pointer-events-auto">
          <MapSearchBar 
            onPlaceSelect={handlePlaceSelect}
            onSearchResults={handleSearchResults}
          />
        </div>
      </div>

      {/* Category filters overlay */}
      {showFilters && (
        <div className="absolute top-20 left-4 right-20 z-10 pointer-events-none">
          <div className="max-w-2xl pointer-events-auto">
            <MapCategoryFilters
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              showOpenNow={showOpenNow}
              onOpenNowChange={setShowOpenNow}
              minRating={minRating}
              onMinRatingChange={setMinRating}
            />
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute top-4 left-4 right-16 z-10 bg-blue-500/10 border border-blue-500/20 text-blue-700 p-3 rounded-lg text-sm">
          <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
          Loading places...
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute top-4 left-4 right-16 z-10 bg-error/10 border border-error/20 text-error p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {/* Map controls */}
      <div className="absolute inset-0 pointer-events-none map-ui-overlay">
        <EnhancedMapControls 
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          onRefreshPlaces={refreshPlaces}
        />
      </div>
      
      {/* Stats display */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none map-stats">
        <div className="space-y-1">
          <div className="text-neutral-600">
            {displayPlaces.length} places discovered
          </div>
          {selectedCategories.length > 0 && (
            <div className="text-blue-600 text-xs">
              {selectedCategories.length} categories selected
            </div>
          )}
        </div>
      </div>
      
      {/* Google Map */}
      <GoogleMap
        className="w-full h-full"
        center={MAP_CONFIG.CENTER}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        onMapLoad={handleMapLoad}
        onBoundsChanged={handleBoundsChanged}
      >
        {/* Place markers */}
        {displayPlaces.map((place) => (
          <GoogleMapMarker
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            title={place.name}
            icon={getCategoryMarkerIcon(place.category)}
            onClick={() => {
              // Handle marker click - could show info window or navigate to place
              console.log('Clicked place:', place.name)
            }}
          />
        ))}
      </GoogleMap>
    </div>
  )
}