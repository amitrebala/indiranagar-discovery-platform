'use client'

import { useState } from 'react'
import { Star, MapPin, Clock, Eye, Heart, Navigation, Info } from 'lucide-react'
import type { SearchResult, Coordinates } from '@/lib/search/search-engine'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  onResultSelect?: (placeId: string) => void
  userLocation?: Coordinates | null
}

export function SearchResults({ 
  results, 
  query, 
  onResultSelect,
  userLocation 
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result.place.id)
    
    // Save to recently viewed
    saveToRecentlyViewed(result.place)
  }

  const saveToRecentlyViewed = (place: any) => {
    try {
      const recentlyViewed = JSON.parse(localStorage.getItem('recently-viewed') || '[]')
      const updated = [
        place,
        ...recentlyViewed.filter((p: any) => p.id !== place.id)
      ].slice(0, 20)
      localStorage.setItem('recently-viewed', JSON.stringify(updated))
    } catch (error) {
      console.warn('Failed to save to recently viewed:', error)
    }
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return null
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  if (results.length === 0) return null

  return (
    <div className="search-results">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results
          </h3>
          <p className="text-sm text-gray-600">
            Found {results.length} places {query && `for "${query}"`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            ☰
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            ⊞
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {results.map((result, index) => (
          <SearchResultCard
            key={result.place.id}
            result={result}
            index={index}
            onClick={handleResultClick}
            userLocation={userLocation}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  )
}

interface SearchResultCardProps {
  result: SearchResult
  index: number
  onClick: (result: SearchResult) => void
  userLocation?: Coordinates | null
  viewMode: 'list' | 'grid'
}

function SearchResultCard({ 
  result, 
  index, 
  onClick, 
  userLocation,
  viewMode 
}: SearchResultCardProps) {
  const { place, relevance_score, distance_km, matching_factors, contextual_recommendations } = result

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return null
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  return (
    <div
      className="search-result-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(result)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{index + 1}
            </span>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${getRelevanceColor(relevance_score)}`}>
              {Math.round(relevance_score * 100)}% match
            </div>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-1">{place.name}</h4>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {place.category && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                {place.category}
              </span>
            )}
            
            {place.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{place.rating.toFixed(1)}</span>
              </div>
            )}
            
            {distance_km && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{formatDistance(distance_km)}</span>
              </div>
            )}

            {place.best_time_to_visit && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs">{place.best_time_to_visit}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <button
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Implement favorites
            }}
            title="Add to favorites"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {place.description}
      </p>

      {/* Matching Factors */}
      {matching_factors.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {matching_factors.slice(0, 3).map((factor, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
              >
                {factor}
              </span>
            ))}
            {matching_factors.length > 3 && (
              <span className="text-xs text-gray-500">
                +{matching_factors.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contextual Recommendations */}
      {contextual_recommendations.length > 0 && (
        <div className="mb-3">
          {contextual_recommendations.slice(0, 2).map((rec, idx) => (
            <div key={idx} className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded mb-1">
              <Info className="w-3 h-3" />
              {rec}
            </div>
          ))}
        </div>
      )}

      {/* Weather Suitability */}
      {place.weather_suitability && place.weather_suitability.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>🌤️</span>
            <span>Good for: {place.weather_suitability.join(', ')}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
          onClick={(e) => {
            e.stopPropagation()
            onClick(result)
          }}
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        {userLocation && (
          <button
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Open directions
              const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${place.latitude},${place.longitude}`
              window.open(url, '_blank')
            }}
          >
            <Navigation className="w-4 h-4" />
            Directions
          </button>
        )}
      </div>
    </div>
  )
}