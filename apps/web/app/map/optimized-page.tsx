'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Loader2, MapPin, Search, Filter, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

// Dynamically import the optimized map to avoid SSR issues
const OptimizedGoogleMap = dynamic(
  () => import('@/components/map/OptimizedGoogleMap').then(mod => ({ default: mod.OptimizedGoogleMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    )
  }
)

// Mobile-optimized header
function MapHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900">
              Indiranagar Map
            </h1>
            <p className="text-xs text-gray-600 hidden sm:block">
              Explore Amit's favorite spots
            </p>
          </div>
        </div>
        
        {/* Mobile action buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Layers className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Search bar component (lightweight)
function MapSearchBar({ 
  onSearch 
}: { 
  onSearch: (query: string) => void 
}) {
  const [query, setQuery] = useState('')
  
  return (
    <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm z-10">
      <div className="relative">
        <input
          type="text"
          placeholder="Search places..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch(query)
            }
          }}
          className="w-full px-4 py-2 pl-10 pr-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>
  )
}

export default function OptimizedMapPage() {
  const searchParams = useSearchParams()
  const journey = searchParams.get('journey')
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  
  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
    // TODO: Implement search functionality
  }
  
  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place)
    // Could show a details panel or navigate to place page
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <MapHeader />
      
      {/* Map container */}
      <div className="flex-1 relative">
        {/* Search overlay */}
        <MapSearchBar onSearch={handleSearch} />
        
        {/* Map */}
        <Suspense
          fallback={
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-gray-600">Initializing map...</p>
              </div>
            </div>
          }
        >
          <OptimizedGoogleMap 
            className="w-full h-full"
            initialJourney={journey || undefined}
            onPlaceSelect={handlePlaceSelect}
          />
        </Suspense>
        
        {/* Selected place detail (mobile-friendly) */}
        {selectedPlace && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:w-80 sm:rounded-lg sm:border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm">{selectedPlace.name}</h3>
                {selectedPlace.category && (
                  <p className="text-xs text-gray-600">{selectedPlace.category}</p>
                )}
                {selectedPlace.rating && (
                  <p className="text-xs mt-1">⭐ {selectedPlace.rating}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href={`/places/${selectedPlace.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="flex-1 px-3 py-1.5 bg-primary text-white text-xs rounded-md text-center hover:bg-primary/90"
              >
                View Details
              </a>
              <button className="flex-1 px-3 py-1.5 border border-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-50">
                Get Directions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}