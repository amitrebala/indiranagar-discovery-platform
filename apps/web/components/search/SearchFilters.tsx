'use client'

import { useState } from 'react'
import { X, Sliders, MapPin } from 'lucide-react'
import type { SearchFilters as SearchFiltersType, Coordinates } from '@/lib/search/search-engine'

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  onClose: () => void
  userLocation?: Coordinates | null
}

export function SearchFilters({ 
  filters, 
  onFiltersChange, 
  onClose,
  userLocation 
}: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters)

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    const updated = { ...localFilters, [key]: value }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const handleCategoryToggle = (category: string) => {
    const updated = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category]
    handleFilterChange('categories', updated)
  }

  const handleWeatherToggle = (weather: string) => {
    const updated = localFilters.weather_suitability.includes(weather)
      ? localFilters.weather_suitability.filter(w => w !== weather)
      : [...localFilters.weather_suitability, weather]
    handleFilterChange('weather_suitability', updated)
  }

  const handleAccessibilityToggle = (feature: string) => {
    const updated = localFilters.accessibility_features.includes(feature as any)
      ? localFilters.accessibility_features.filter(f => f !== feature)
      : [...localFilters.accessibility_features, feature as any]
    handleFilterChange('accessibility_features', updated)
  }

  const clearAllFilters = () => {
    const cleared: SearchFiltersType = {
      categories: [],
      price_range: 'any',
      time_requirement: 'any',
      weather_suitability: [],
      crowd_level: 'any',
      accessibility_features: [],
      distance_km: undefined
    }
    setLocalFilters(cleared)
    onFiltersChange(cleared)
  }

  const categories = [
    { id: 'restaurant', label: 'Restaurants', emoji: '🍽️' },
    { id: 'cafe', label: 'Cafes', emoji: '☕' },
    { id: 'bar', label: 'Bars', emoji: '🍺' },
    { id: 'activity', label: 'Activities', emoji: '🎯' },
    { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { id: 'street_food', label: 'Street Food', emoji: '🥘' }
  ]

  const weatherOptions = [
    { id: 'sunny', label: 'Sunny', emoji: '☀️' },
    { id: 'rainy', label: 'Rainy', emoji: '🌧️' },
    { id: 'cloudy', label: 'Cloudy', emoji: '☁️' },
    { id: 'indoor', label: 'Indoor', emoji: '🏠' },
    { id: 'covered', label: 'Covered', emoji: '🏗️' }
  ]

  const accessibilityOptions = [
    { id: 'wheelchair', label: 'Wheelchair Accessible', emoji: '♿' },
    { id: 'parking', label: 'Parking Available', emoji: '🅿️' },
    { id: 'quiet', label: 'Quiet Environment', emoji: '🔇' },
    { id: 'family-friendly', label: 'Family Friendly', emoji: '👨‍👩‍👧‍👦' }
  ]

  return (
    <div className="search-filters bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Search Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                localFilters.categories.includes(category.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{category.emoji}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
        <div className="flex gap-2">
          {[
            { id: 'any', label: 'Any', emoji: '💰' },
            { id: 'budget', label: 'Budget', emoji: '💵' },
            { id: 'moderate', label: 'Moderate', emoji: '💳' },
            { id: 'premium', label: 'Premium', emoji: '💎' }
          ].map(price => (
            <button
              key={price.id}
              onClick={() => handleFilterChange('price_range', price.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                localFilters.price_range === price.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{price.emoji}</span>
              {price.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Requirement */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Time Available</h4>
        <div className="flex gap-2">
          {[
            { id: 'any', label: 'Any', emoji: '⏰' },
            { id: 'quick', label: 'Quick (< 30min)', emoji: '⚡' },
            { id: 'moderate', label: 'Moderate (30-60min)', emoji: '🕐' },
            { id: 'leisurely', label: 'Leisurely (60min+)', emoji: '🕑' }
          ].map(time => (
            <button
              key={time.id}
              onClick={() => handleFilterChange('time_requirement', time.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                localFilters.time_requirement === time.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{time.emoji}</span>
              {time.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Suitability */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Weather Suitability</h4>
        <div className="flex flex-wrap gap-2">
          {weatherOptions.map(weather => (
            <button
              key={weather.id}
              onClick={() => handleWeatherToggle(weather.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                localFilters.weather_suitability.includes(weather.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{weather.emoji}</span>
              {weather.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crowd Level */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Crowd Level</h4>
        <div className="flex gap-2">
          {[
            { id: 'any', label: 'Any', emoji: '👥' },
            { id: 'low', label: 'Quiet', emoji: '🤫' },
            { id: 'moderate', label: 'Moderate', emoji: '👨‍👩‍👧' },
            { id: 'high', label: 'Busy', emoji: '🎉' }
          ].map(crowd => (
            <button
              key={crowd.id}
              onClick={() => handleFilterChange('crowd_level', crowd.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                localFilters.crowd_level === crowd.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{crowd.emoji}</span>
              {crowd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Distance */}
      {userLocation && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Distance from you
          </h4>
          <div className="space-y-2">
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={localFilters.distance_km || 5}
              onChange={(e) => handleFilterChange('distance_km', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.5km</span>
              <span className="font-medium text-gray-700">
                {localFilters.distance_km || 5}km radius
              </span>
              <span>5km</span>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Accessibility</h4>
        <div className="flex flex-wrap gap-2">
          {accessibilityOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleAccessibilityToggle(option.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                localFilters.accessibility_features.includes(option.id as any)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}