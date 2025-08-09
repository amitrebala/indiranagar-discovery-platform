'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L, { LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { EnhancedPlaceMarker } from './EnhancedPlaceMarker'
import { MapSearchBar } from './MapSearchBar'
import { MapCategoryFilters } from './MapCategoryFilters'
import { JourneyCollection } from './JourneyRouteVisualization'
import { MapPreview, useMapPreview } from './MapPreview'
import { MapLoadingSkeleton } from '@/components/ui/SkeletonLoaders'
import { MapLegend } from './MapLegend'
import { useMapStore } from '@/stores/mapStore'
import { placesDataService } from '@/lib/services/places-data-service'
import { MAP_CONFIG } from '@/lib/constants'
import { getMarkerSizeForZoom } from '@/lib/map/markers'
import { createJourneyRoute } from '@/lib/map/journeys'
import { Loader2, MapPin, RefreshCw, Route, Filter, Search } from 'lucide-react'
import type { JourneyRoute } from './JourneyRouteVisualization'

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

// Component to handle map events and viewport-based loading
function MapEventHandler({ onViewportChange }: { onViewportChange: (bounds: any) => void }) {
  const { setMapView, setBounds, setMapReady } = useMapStore()
  
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      const bounds = map.getBounds()
      
      setMapView(center, zoom)
      setBounds(bounds)
      
      // Notify parent component about viewport change for place loading
      onViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      })
    },
    zoomend: () => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      setMapView(center, zoom)
    },
  })

  useEffect(() => {
    if (map) {
      setMapReady(true)
      setBounds(map.getBounds())
      
      // Initial viewport load
      const bounds = map.getBounds()
      onViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      })
    }
  }, [map, setMapReady, setBounds, onViewportChange])

  return null
}

// Component to handle map bounds restrictions
function MapBoundsHandler() {
  const map = useMap()

  useEffect(() => {
    const bounds = new LatLngBounds(
      [MAP_CONFIG.BANGALORE_BOUNDS.south, MAP_CONFIG.BANGALORE_BOUNDS.west],
      [MAP_CONFIG.BANGALORE_BOUNDS.north, MAP_CONFIG.BANGALORE_BOUNDS.east]
    )
    
    map.setMaxBounds(bounds)
    map.setMinZoom(MAP_CONFIG.MIN_ZOOM)
    map.setMaxZoom(MAP_CONFIG.MAX_ZOOM)
  }, [map])

  return null
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
  showJourneys, 
  toggleJourneys,
  onJourneySelect,
  showFilters,
  toggleFilters,
  onRefreshPlaces
}: {
  showJourneys: boolean
  toggleJourneys: () => void
  onJourneySelect: (journey: JourneyRoute | null) => void
  showFilters: boolean
  toggleFilters: () => void
  onRefreshPlaces: () => void
}) {
  const { showClusters, toggleClusters, resetMapView } = useMapStore()

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
        onClick={toggleClusters}
        className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors ${
          showClusters
            ? 'bg-primary text-white'
            : 'bg-white text-primary border border-primary/20'
        }`}
        title={showClusters ? 'Disable clustering' : 'Enable clustering'}
      >
        Clusters
      </button>
      
      <button
        onClick={toggleJourneys}
        className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors ${
          showJourneys
            ? 'bg-secondary text-white'
            : 'bg-white text-secondary border border-secondary/20'
        }`}
        title={showJourneys ? 'Hide journey routes' : 'Show journey routes'}
      >
        <Route size={16} className="mr-1" />
        Routes
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

interface EnhancedInteractiveMapProps {
  className?: string
}

export function EnhancedInteractiveMap({ className = '' }: EnhancedInteractiveMapProps) {
  // State
  const [places, setPlaces] = useState<EnhancedPlaceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [showJourneys, setShowJourneys] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState<JourneyRoute | null>(null)
  const [sampleJourneys, setSampleJourneys] = useState<JourneyRoute[]>([])
  const [searchResults, setSearchResults] = useState<EnhancedPlaceData[]>([])
  
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showOpenNow, setShowOpenNow] = useState(false)
  const [minRating, setMinRating] = useState<number | undefined>()
  
  // Map store
  const { isMapReady, zoom } = useMapStore()
  const mapRef = useRef<L.Map | null>(null)
  
  // Map preview
  const {
    previewPlace,
    previewPosition,
    isPreviewVisible,
    showPreview,
    hidePreview
  } = useMapPreview()

  // Debounced viewport loading
  const loadViewportPlaces = useCallback(async (bounds: any, options: PlaceSearchOptions = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const viewportPlaces = await placesDataService.getViewportPlaces(bounds, {
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

  // Handle viewport changes (with debouncing)
  const handleViewportChange = useCallback((bounds: any) => {
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
  }, [selectedCategories, showOpenNow, minRating, loadViewportPlaces])

  // Handle place selection from search
  const handlePlaceSelect = (place: EnhancedPlaceData) => {
    if (mapRef.current) {
      mapRef.current.setView([place.latitude, place.longitude], 17)
      setSearchResults([])
    }
  }

  // Handle search results
  const handleSearchResults = (results: EnhancedPlaceData[]) => {
    setSearchResults(results)
  }

  // Handle filter changes
  useEffect(() => {
    if (mapRef.current && isMapReady) {
      const bounds = mapRef.current.getBounds()
      const boundsObj = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      }
      loadViewportPlaces(boundsObj, {
        categories: selectedCategories,
        openNow: showOpenNow,
        minRating: minRating
      })
    }
  }, [selectedCategories, showOpenNow, minRating, isMapReady, loadViewportPlaces])

  // Handle retry
  const handleRetry = () => {
    setMapError(null)
    setError(null)
    window.location.reload()
  }
  
  const toggleJourneys = () => {
    setShowJourneys(!showJourneys)
  }
  
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }
  
  const handleJourneySelect = (journey: JourneyRoute | null) => {
    setSelectedJourney(journey)
  }

  const refreshPlaces = () => {
    placesDataService.clearCache()
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds()
      handleViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      })
    }
  }
  
  // Create sample journeys from available places
  useEffect(() => {
    if (places.length >= 2 && sampleJourneys.length === 0) {
      const coffeePlaces = places.filter(p => 
        p.category?.toLowerCase().includes('cafe') || 
        p.name.toLowerCase().includes('coffee')
      ).slice(0, 3)
      
      const foodPlaces = places.filter(p => 
        p.category?.toLowerCase().includes('restaurant') ||
        (p.rating && p.rating >= 4.0)
      ).slice(0, 4)
      
      const journeys: JourneyRoute[] = []
      
      if (coffeePlaces.length >= 2) {
        journeys.push(createJourneyRoute(
          'morning-coffee-crawl',
          'Morning Coffee Crawl',
          coffeePlaces,
          {
            description: 'Start your day with the best coffee spots in Indiranagar',
            difficulty: 'easy',
            theme: 'morning-coffee'
          }
        ))
      }
      
      if (foodPlaces.length >= 2) {
        journeys.push(createJourneyRoute(
          'evening-food-walk',
          'Evening Food Walk',
          foodPlaces.slice(0, 3),
          {
            description: 'Explore the culinary delights as the sun sets',
            difficulty: 'moderate',
            theme: 'evening-food'
          }
        ))
      }
      
      setSampleJourneys(journeys)
    }
  }, [places, sampleJourneys.length])

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
      {(!isMapReady || isLoading) && (
        <MapLoadingSkeleton showControls={true} showStats={true} />
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
          showJourneys={showJourneys}
          toggleJourneys={toggleJourneys}
          onJourneySelect={handleJourneySelect}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          onRefreshPlaces={refreshPlaces}
        />
        
        <MapLegend />
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
          {showJourneys && sampleJourneys.length > 0 && (
            <div className="text-secondary text-xs">
              {sampleJourneys.length} journey routes available
            </div>
          )}
          {selectedJourney && (
            <div className="text-primary text-xs font-medium">
              Following: {selectedJourney.name}
            </div>
          )}
        </div>
      </div>
      
      {/* Main map */}
      <MapContainer
        ref={mapRef}
        center={[MAP_CONFIG.CENTER.lat, MAP_CONFIG.CENTER.lng]}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url={MAP_CONFIG.TILE_URL}
          attribution={MAP_CONFIG.TILE_ATTRIBUTION}
          maxZoom={MAP_CONFIG.MAX_ZOOM}
          minZoom={MAP_CONFIG.MIN_ZOOM}
        />
        
        <MapEventHandler onViewportChange={handleViewportChange} />
        <MapBoundsHandler />
        
        {/* Journey routes */}
        {showJourneys && sampleJourneys.length > 0 && (
          <JourneyCollection 
            journeys={sampleJourneys}
            highlightedJourneyId={selectedJourney?.id}
            onJourneySelect={handleJourneySelect}
          />
        )}
        
        {/* Enhanced place markers */}
        {displayPlaces.map((place) => {
          const markerSize = getMarkerSizeForZoom(zoom)
          return (
            <EnhancedPlaceMarker 
              key={place.id} 
              place={place} 
              size={markerSize}
              showLiveStatus={true}
            />
          )
        })}
      </MapContainer>
      
      {/* Map preview overlay */}
      <MapPreview 
        place={previewPlace}
        position={previewPosition}
        isVisible={isPreviewVisible}
      />
    </div>
  )
}