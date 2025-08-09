'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Loader2, MapPin } from 'lucide-react'

// Dynamically import the Google Maps component to avoid SSR issues
const GoogleMapsInteractiveMap = dynamic(
  () => import('@/components/map/GoogleMapsInteractiveMap').then(mod => ({ default: mod.GoogleMapsInteractiveMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-neutral-600">Loading Google Maps...</p>
        </div>
      </div>
    )
  }
)

function MapPageHeader() {
  return (
    <div className="bg-white border-b border-neutral-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Indiranagar Discovery Map
          </h1>
          <p className="text-xs text-neutral-600">
            Interactive Google Maps with live place data & search
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Header */}
      <MapPageHeader />
      
      {/* Map container */}
      <div className="flex-1 relative">
        <Suspense
          fallback={
            <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-neutral-600">Initializing Google Maps...</p>
              </div>
            </div>
          }
        >
          <GoogleMapsInteractiveMap className="w-full h-full" />
        </Suspense>
      </div>
    </div>
  )
}