'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, ExternalLink, Filter, Search, Navigation, Heart } from 'lucide-react'
import Link from 'next/link'

interface Place {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  latitude: number
  longitude: number
  address: string
  rating?: number
  visit_count?: number
  is_favorite: boolean
  tags: string[]
  image_urls?: string[]
  personal_note?: string
  visit_recommendation?: string
}

const CATEGORY_COLORS = {
  'food': 'bg-orange-100 text-orange-800',
  'cafe': 'bg-brown-100 text-brown-800',
  'shopping': 'bg-purple-100 text-purple-800',
  'entertainment': 'bg-blue-100 text-blue-800',
  'services': 'bg-green-100 text-green-800',
  'nightlife': 'bg-pink-100 text-pink-800',
}

export function PlacesDiscoverySection() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'visits' | 'name'>('rating')

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/places')
      if (response.ok) {
        const data = await response.json()
        setPlaces(data.places || [])
      }
    } catch (error) {
      console.error('Error fetching places:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaces()
  }, [])

  // Filter and sort places
  const filteredPlaces = places
    .filter(place => {
      const matchesSearch = searchTerm === '' || 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'visits':
          return (b.visit_count || 0) - (a.visit_count || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const categories = ['all', ...Array.from(new Set(places.map(p => p.category)))]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600">Loading places...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search places, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'visits' | 'name')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="rating">Sort by Rating</option>
            <option value="visits">Sort by Visits</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Found <strong>{filteredPlaces.length}</strong> places
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            {places.filter(p => p.is_favorite).length} favorites
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            {places.filter(p => (p.rating || 0) >= 4.5).length} highly rated
          </div>
        </div>
      </div>

      {/* Places Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Places Found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `No places found matching "${searchTerm}". Try different keywords.`
              : "No places available in this category."
            }
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              {place.image_urls && place.image_urls.length > 0 && (
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={place.image_urls[0]}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  {place.is_favorite && (
                    <Heart className="absolute top-3 right-3 w-5 h-5 text-red-500 fill-current" />
                  )}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        CATEGORY_COLORS[place.category as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {place.category}
                      </span>
                      {place.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{place.rating}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {place.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {place.description || 'No description available'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">{place.address}</span>
                  </div>
                  
                  {place.visit_count && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      <span className="text-xs">Visited {place.visit_count} times</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {place.tags && place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {place.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {place.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                        +{place.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Personal Note */}
                {place.personal_note && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                    <p className="text-blue-800 text-xs font-medium">Amit's Note:</p>
                    <p className="text-blue-700 text-sm">{place.personal_note}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Link
                    href={`/places/${place.id}`}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Details
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  
                  <button
                    onClick={() => {
                      // Add to map or get directions
                      if (place.latitude && place.longitude) {
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`,
                          '_blank'
                        )
                      }
                    }}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    <Navigation className="w-3 h-3" />
                    Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800 text-sm">
          <strong>Personal Collection:</strong> All 186 places have been personally visited and verified by Amit. 
          Each place includes insider tips, honest reviews, and recommendations based on real experiences.
        </p>
      </div>
    </div>
  )
}