'use client'

import { MapPin, CheckCircle } from 'lucide-react'

export function PlacesHeader() {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">All Places</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl">
          Explore all 186 places I've personally visited in Indiranagar. Each location has been 
          verified and comes with insider tips, best times to visit, and companion activity suggestions.
        </p>
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>All places personally visited and verified by Amit</span>
        </div>
      </div>
    </div>
  )
}