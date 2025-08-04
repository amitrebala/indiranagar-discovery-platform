import { PlaceCard } from '@/components/places/PlaceCard'
import { PlaceCardEnhanced } from '@/components/places/PlaceCardEnhanced'
import type { Place } from '@/lib/supabase/types'

// Test places to demonstrate image discovery
const testPlaces: Place[] = [
  {
    id: 'test-1',
    name: 'Corner House Ice Cream',
    description: 'Iconic ice cream parlor serving delicious sundaes and shakes',
    latitude: 12.9716,
    longitude: 77.6411,
    category: 'Food & Dining',
    subcategory: 'Desserts',
    rating: 4.5,
    best_time_to_visit: 'Evening',
    has_amit_visited: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-2',
    name: 'Indiranagar Metro Station',
    description: 'Purple Line metro station serving the neighborhood',
    latitude: 12.9784,
    longitude: 77.6408,
    category: 'Transportation',
    subcategory: 'Metro',
    rating: 4.0,
    has_amit_visited: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-3',
    name: 'Church Street Social',
    description: 'Popular gastropub with great food and ambiance',
    latitude: 12.9757,
    longitude: 77.6404,
    category: 'Food & Dining',
    subcategory: 'Restaurants',
    rating: 4.3,
    best_time_to_visit: 'Dinner',
    has_amit_visited: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function TestImagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Image Discovery Test Page
        </h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Instructions
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Make sure you have set NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in your .env.local file</li>
              <li>The enhanced cards below will automatically discover images from Unsplash</li>
              <li>Images are cached locally for 7 days to improve performance</li>
              <li>Hover over cards to see image attribution</li>
              <li>The proxy endpoint optimizes external images for better performance</li>
            </ol>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Original PlaceCard (No Auto-Discovery)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Enhanced PlaceCard (With Auto-Discovery)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testPlaces.map((place) => (
              <PlaceCardEnhanced key={place.id} place={place} showAttribution={true} />
            ))}
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Developer Notes
          </h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Check browser DevTools Network tab to see image proxy requests</li>
            <li>• Check localStorage for cached image data (keys start with "place-image-")</li>
            <li>• The proxy adds cache headers for CDN optimization</li>
            <li>• External images are converted to WebP format for better performance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}