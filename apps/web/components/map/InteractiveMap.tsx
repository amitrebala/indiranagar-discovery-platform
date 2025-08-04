'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L, { LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import { PlaceMarker } from './PlaceMarker'
import { JourneyCollection } from './JourneyRouteVisualization'
import { MapPreview, useMapPreview } from './MapPreview'
import { MapLoadingSkeleton } from '@/components/ui/SkeletonLoaders'
import { MapLegend } from './MapLegend'
import { useMapStore } from '@/stores/mapStore'
import { usePlaces } from '@/hooks/usePlaces'
import { MAP_CONFIG } from '@/lib/constants'
import { getMarkerSizeForZoom } from '@/lib/map/markers'
import { createJourneyRoute } from '@/lib/map/journeys'
import { Loader2, MapPin, RefreshCw, Route } from 'lucide-react'
import type { JourneyRoute } from './JourneyRouteVisualization'
import type { Place } from '@/lib/validations'

// Component to handle map events and state updates
function MapEventHandler() {
  const { setMapView, setBounds, setMapReady } = useMapStore()
  
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      setMapView(center, zoom)
      setBounds(map.getBounds())
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
    }
  }, [map, setMapReady, setBounds])

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
    
    // Set max bounds to show all of Bangalore
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

// Map controls component
function MapControls({ 
  showJourneys, 
  toggleJourneys,
  onJourneySelect 
}: {
  showJourneys: boolean
  toggleJourneys: () => void
  onJourneySelect: (journey: JourneyRoute | null) => void
}) {
  const { showClusters, toggleClusters, resetMapView } = useMapStore()
  const { refetchPlaces } = usePlaces()

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
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
        onClick={refetchPlaces}
        className="px-3 py-2 bg-white text-primary border border-primary/20 rounded-lg shadow-lg text-sm font-medium hover:bg-primary/5 transition-colors"
        title="Refresh places"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  )
}

interface InteractiveMapProps {
  className?: string
}

export function InteractiveMap({ className = '' }: InteractiveMapProps) {
  const { places, isLoading, error } = usePlaces()
  const { isMapReady, zoom } = useMapStore()
  const [mapError, setMapError] = useState<string | null>(null)
  const [showJourneys, setShowJourneys] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState<JourneyRoute | null>(null)
  const [sampleJourneys, setSampleJourneys] = useState<JourneyRoute[]>([])
  const mapRef = useRef<L.Map | null>(null)
  const {
    previewPlace,
    previewPosition,
    isPreviewVisible,
    showPreview,
    hidePreview
  } = useMapPreview()

  const handleRetry = () => {
    setMapError(null)
    window.location.reload()
  }
  
  const toggleJourneys = () => {
    setShowJourneys(!showJourneys)
  }
  
  const handleJourneySelect = (journey: JourneyRoute | null) => {
    setSelectedJourney(journey)
  }
  
  const handleMarkerHover = (place: Place, event: any) => {
    const markerElement = event.target.getElement()
    if (markerElement) {
      const rect = markerElement.getBoundingClientRect()
      showPreview(place, {
        x: rect.left + rect.width / 2,
        y: rect.top
      })
    }
  }
  
  const handleMarkerLeave = () => {
    hidePreview()
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
        p.rating && p.rating >= 4.0
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

  return (
    <div className={`relative ${className}`}>
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
      <MapControls 
        showJourneys={showJourneys}
        toggleJourneys={toggleJourneys}
        onJourneySelect={handleJourneySelect}
      />
      
      {/* Map Legend */}
      <MapLegend />
      
      {/* Stats display */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm">
        <div className="space-y-1">
          <div className="text-neutral-600">
            {places.length} places discovered
          </div>
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
        zoomControl={false} // We'll add custom controls
        attributionControl={true}
      >
        <TileLayer
          url={MAP_CONFIG.TILE_URL}
          attribution={MAP_CONFIG.TILE_ATTRIBUTION}
          maxZoom={MAP_CONFIG.MAX_ZOOM}
          minZoom={MAP_CONFIG.MIN_ZOOM}
        />
        
        {/* Map event handlers */}
        <MapEventHandler />
        <MapBoundsHandler />
        
        {/* Journey routes */}
        {showJourneys && sampleJourneys.length > 0 && (
          <JourneyCollection 
            journeys={sampleJourneys}
            highlightedJourneyId={selectedJourney?.id}
            onJourneySelect={handleJourneySelect}
          />
        )}
        
        {/* Place markers */}
        {places.map((place) => {
          const markerSize = getMarkerSizeForZoom(zoom)
          return (
            <PlaceMarker 
              key={place.id} 
              place={place} 
              size={markerSize}
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