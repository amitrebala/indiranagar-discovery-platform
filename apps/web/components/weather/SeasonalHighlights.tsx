'use client'

import { useState, useEffect } from 'react'
import { Calendar, Leaf, Sun, Snowflake, Cloud, Sparkles } from 'lucide-react'
import { usePlaces } from '@/hooks/usePlaces'
import type { WeatherData } from '@/lib/weather/types'
import type { Place } from '@/lib/validations'

interface SeasonalHighlightsProps {
  weather?: WeatherData
  className?: string
}

export function SeasonalHighlights({ weather, className = '' }: SeasonalHighlightsProps) {
  const { places } = usePlaces()
  const [currentSeason, setCurrentSeason] = useState<string>('spring')
  const [seasonalPlaces, setSeasonalPlaces] = useState<any[]>([])

  useEffect(() => {
    const season = getCurrentSeason()
    setCurrentSeason(season)
    
    if (places.length > 0) {
      const highlighted = getSeasonalHighlights(places, season, weather)
      setSeasonalPlaces(highlighted)
    }
  }, [places, weather])

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'spring': return <Leaf className="w-5 h-5 text-green-500" />
      case 'summer': return <Sun className="w-5 h-5 text-yellow-500" />
      case 'monsoon': return <Cloud className="w-5 h-5 text-blue-500" />
      case 'winter': return <Snowflake className="w-5 h-5 text-blue-300" />
      default: return <Calendar className="w-5 h-5 text-gray-500" />
    }
  }

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'spring': return 'bg-green-50 border-green-200 text-green-800'
      case 'summer': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'monsoon': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'winter': return 'bg-blue-50 border-blue-200 text-blue-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getSeasonDescription = (season: string) => {
    switch (season) {
      case 'spring': return 'Perfect weather for outdoor exploration and garden visits'
      case 'summer': return 'Great time for early morning and evening activities'
      case 'monsoon': return 'Cozy indoor spots and covered outdoor areas shine'
      case 'winter': return 'Comfortable weather for all-day exploration'
      default: return 'Explore the best of what this season offers'
    }
  }

  return (
    <div className={`seasonal-highlights ${className}`}>
      {/* Season Header */}
      <div className={`season-header p-4 rounded-lg border-2 mb-6 ${getSeasonColor(currentSeason)}`}>
        <div className="flex items-center gap-3 mb-2">
          {getSeasonIcon(currentSeason)}
          <h2 className="text-xl font-bold capitalize">{currentSeason} Season</h2>
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-sm opacity-90">
          {getSeasonDescription(currentSeason)}
        </p>
      </div>

      {/* Seasonal Places */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seasonal Highlights
        </h3>

        {seasonalPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonalPlaces.map((item, index) => (
              <SeasonalPlaceCard
                key={item.place.id}
                item={item}
                season={currentSeason}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No specific seasonal highlights available</p>
            <p className="text-sm">All places are great to visit year-round</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface SeasonalPlaceCardProps {
  item: any
  season: string
  index: number
}

function SeasonalPlaceCard({ item, season, index }: SeasonalPlaceCardProps) {
  const { place, seasonal_score, seasonal_reasons, peak_months } = item

  const getSeasonalBadge = (score: number) => {
    if (score >= 0.9) return { text: 'Peak Season', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    if (score >= 0.7) return { text: 'Great Time', class: 'bg-green-100 text-green-800 border-green-200' }
    if (score >= 0.5) return { text: 'Good Time', class: 'bg-blue-100 text-blue-800 border-blue-200' }
    return { text: 'Okay Time', class: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  const badge = getSeasonalBadge(seasonal_score)

  return (
    <div className="seasonal-place-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{index + 1}
            </span>
            <div className={`text-xs px-2 py-1 rounded border font-medium ${badge.class}`}>
              {badge.text}
            </div>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-1">{place.name}</h4>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            {place.category && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                {place.category}
              </span>
            )}
            
            {place.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span>{place.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Peak Months */}
      {peak_months && peak_months.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>Best in: {peak_months.join(', ')}</span>
          </div>
        </div>
      )}

      {/* Seasonal Reasons */}
      {seasonal_reasons && seasonal_reasons.length > 0 && (
        <div className="mb-3">
          <div className="space-y-1">
            {seasonal_reasons.slice(0, 2).map((reason: string, idx: number) => (
              <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-green-500">✨</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {place.description}
      </p>

      {/* Weather Suitability for Season */}
      {place.weather_suitability && place.weather_suitability.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {place.weather_suitability.map((condition: string, idx: number) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          Plan Visit
        </button>
        
        <div className="text-xs text-gray-500">
          Score: {Math.round(seasonal_score * 100)}%
        </div>
      </div>
    </div>
  )
}

// Utility functions
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1 // 1-12
  
  // Bangalore/South India seasons
  if (month >= 3 && month <= 5) return 'summer'     // Mar-May
  if (month >= 6 && month <= 9) return 'monsoon'    // Jun-Sep  
  if (month >= 10 && month <= 11) return 'winter'   // Oct-Nov
  return 'spring' // Dec-Feb
}

function getSeasonalHighlights(places: Place[], season: string, weather?: WeatherData): any[] {
  return places
    .map(place => ({
      place,
      seasonal_score: calculateSeasonalScore(place, season, weather),
      seasonal_reasons: getSeasonalReasons(place, season, weather),
      peak_months: getPeakMonths(place, season)
    }))
    .filter(item => item.seasonal_score > 0.6)
    .sort((a, b) => b.seasonal_score - a.seasonal_score)
    .slice(0, 6)
}

function calculateSeasonalScore(place: Place, season: string, weather?: WeatherData): number {
  let score = 0.5 // Base score

  // Weather suitability for season
  if (place.weather_suitability) {
    const seasonWeatherMap: Record<string, string[]> = {
      'summer': ['sunny', 'hot', 'indoor', 'air-conditioned'],
      'monsoon': ['rainy', 'indoor', 'covered'],
      'winter': ['cool', 'outdoor', 'sunny'],
      'spring': ['sunny', 'outdoor', 'cool']
    }

    const seasonConditions = seasonWeatherMap[season] || []
    const matchingConditions = place.weather_suitability.filter(condition =>
      seasonConditions.includes(condition.toLowerCase())
    )

    score += (matchingConditions.length / seasonConditions.length) * 0.4
  }

  // Current weather alignment
  if (weather && place.weather_suitability?.includes(weather.condition)) {
    score += 0.2
  }

  // Rating boost
  if (place.rating && place.rating >= 4.0) {
    score += 0.1
  }

  // Category-based seasonal adjustments
  if (place.category) {
    const category = place.category.toLowerCase()
    if (season === 'monsoon' && (category.includes('cafe') || category.includes('indoor'))) {
      score += 0.15
    }
    if (season === 'summer' && category.includes('air-conditioned')) {
      score += 0.15
    }
    if ((season === 'winter' || season === 'spring') && category.includes('outdoor')) {
      score += 0.15
    }
  }

  return Math.max(0, Math.min(1, score))
}

function getSeasonalReasons(place: Place, season: string, weather?: WeatherData): string[] {
  const reasons: string[] = []

  if (season === 'monsoon') {
    if (place.weather_suitability?.includes('indoor')) {
      reasons.push('Perfect rainy day retreat')
    }
    if (place.weather_suitability?.includes('covered')) {
      reasons.push('Enjoy while staying dry')
    }
  }

  if (season === 'summer') {
    if (place.weather_suitability?.includes('air-conditioned')) {
      reasons.push('Cool comfort during hot weather')
    }
    if (place.best_time_to_visit?.includes('evening')) {
      reasons.push('Great for summer evenings')
    }
  }

  if (season === 'winter' || season === 'spring') {
    if (place.weather_suitability?.includes('outdoor')) {
      reasons.push('Perfect weather for outdoor enjoyment')
    }
    if (place.category?.includes('garden')) {
      reasons.push('Beautiful outdoor spaces in pleasant weather')
    }
  }

  // Current weather reasons
  if (weather && place.weather_suitability?.includes(weather.condition)) {
    reasons.push(`Ideal for current ${weather.condition} conditions`)
  }

  if (place.rating && place.rating >= 4.5) {
    reasons.push('Exceptional experience any time of year')
  }

  return reasons.slice(0, 3)
}

function getPeakMonths(place: Place, season: string): string[] {
  const seasonMonthMap: Record<string, string[]> = {
    'spring': ['December', 'January', 'February'],
    'summer': ['March', 'April', 'May'],
    'monsoon': ['June', 'July', 'August', 'September'],
    'winter': ['October', 'November']
  }

  return seasonMonthMap[season] || []
}