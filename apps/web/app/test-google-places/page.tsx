'use client'

import { useState } from 'react'
import { GooglePlacesSearch } from '@/components/search/GooglePlacesSearch'
import { GooglePlacesEnhanced } from '@/components/places/GooglePlacesEnhanced'
import { MapPin, Search, Coffee, Utensils } from 'lucide-react'

export default function TestGooglePlacesPage() {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('')
  const [selectedPlaceName, setSelectedPlaceName] = useState<string>('')
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([])
  const [companionActivities, setCompanionActivities] = useState<any>({ before: [], after: [] })
  const [loading, setLoading] = useState(false)

  const handlePlaceSelect = async (placeId: string, placeName: string) => {
    setSelectedPlaceId(placeId)
    setSelectedPlaceName(placeName)
    
    // Fetch companion activities
    try {
      const response = await fetch('/api/places/companions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: 12.9783, // Default to Indiranagar center
          lng: 77.6408
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCompanionActivities(data)
      }
    } catch (error) {
      console.error('Error fetching companions:', error)
    }
  }

  const testNearbySearch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/places/companions?lat=12.9783&lng=77.6408&category=after')
      if (response.ok) {
        const data = await response.json()
        setNearbyPlaces(data.companions || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testEnrichPlace = async () => {
    // Test enriching a sample place
    const response = await fetch('/api/places/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeId: 'sample-place-id' // Replace with actual place ID from your database
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Enriched place data:', data)
      alert('Check console for enriched place data')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Places API Integration Test
          </h1>
          <p className="text-gray-600">
            Test the Google Places API integration for search, details, and companion activities
          </p>
        </div>

        {/* Search Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Places Autocomplete Search
          </h2>
          <GooglePlacesSearch
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search for places in Indiranagar..."
            className="mb-4"
          />
          {selectedPlaceName && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Selected: <strong>{selectedPlaceName}</strong>
              </p>
              <p className="text-xs text-green-600 mt-1">
                Place ID: {selectedPlaceId}
              </p>
            </div>
          )}
        </div>

        {/* Place Details */}
        {selectedPlaceId && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Place Details & Photos</h2>
            <GooglePlacesEnhanced
              googlePlaceId={selectedPlaceId}
              showPhotos={true}
              showReviews={true}
              showHours={true}
            />
          </div>
        )}

        {/* Companion Activities */}
        {(companionActivities.before.length > 0 || companionActivities.after.length > 0) && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Before Activities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Coffee className="w-5 h-5" />
                Before Activities
              </h3>
              <div className="space-y-3">
                {companionActivities.before.slice(0, 3).map((place: any) => (
                  <div key={place.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{place.name}</h4>
                        <p className="text-sm text-gray-500">{place.address}</p>
                        {place.distance && (
                          <p className="text-xs text-gray-400 mt-1">{place.distance} away</p>
                        )}
                      </div>
                      {place.rating && (
                        <div className="text-sm">
                          ⭐ {place.rating}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* After Activities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                After Activities
              </h3>
              <div className="space-y-3">
                {companionActivities.after.slice(0, 3).map((place: any) => (
                  <div key={place.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{place.name}</h4>
                        <p className="text-sm text-gray-500">{place.address}</p>
                        {place.distance && (
                          <p className="text-xs text-gray-400 mt-1">{place.distance} away</p>
                        )}
                      </div>
                      {place.rating && (
                        <div className="text-sm">
                          ⭐ {place.rating}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Test Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testNearbySearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Test Nearby Search'}
            </button>
            <button
              onClick={testEnrichPlace}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Test Place Enrichment
            </button>
          </div>

          {/* Nearby Places Results */}
          {nearbyPlaces.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Nearby Places Found:</h3>
              <div className="grid gap-3">
                {nearbyPlaces.map((place: any) => (
                  <div key={place.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{place.name}</h4>
                        <p className="text-sm text-gray-500">{place.address}</p>
                        <div className="flex gap-2 mt-1">
                          {place.distance && (
                            <span className="text-xs text-gray-400">{place.distance}</span>
                          )}
                          {place.open_now !== undefined && (
                            <span className={`text-xs ${place.open_now ? 'text-green-600' : 'text-red-600'}`}>
                              {place.open_now ? 'Open' : 'Closed'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {place.rating && (
                          <div className="text-sm">⭐ {place.rating}</div>
                        )}
                        {place.price_level && (
                          <div className="text-xs text-gray-500">
                            {'₹'.repeat(place.price_level)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Key Status */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">API Configuration</h3>
          <p className="text-sm text-yellow-700">
            Google Places API Key: {process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? '✅ Configured' : '❌ Not configured'}
          </p>
          <p className="text-xs text-yellow-600 mt-2">
            Remember to restrict your API key in the Google Cloud Console for production use.
          </p>
        </div>
      </div>
    </div>
  )
}