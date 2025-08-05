'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Eye, MapPin } from 'lucide-react'
import { usePlaces } from '@/hooks/usePlaces'
import { useGeolocation } from '@/hooks/useGeolocation'
import type { WeatherData } from '@/lib/weather/types'
import { WeatherRecommendationEngine, type WeatherRecommendation } from '@/lib/weather/recommendations'

interface WeatherRecommendationsProps {
  weather?: WeatherData
  className?: string
  maxRecommendations?: number
  showWeatherDisplay?: boolean
}

export function WeatherRecommendations({ 
  weather,
  className = '',
  maxRecommendations = 6,
  showWeatherDisplay = true
}: WeatherRecommendationsProps) {
  const { places } = usePlaces()
  const { coordinates: location } = useGeolocation()
  const [recommendations, setRecommendations] = useState<WeatherRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (weather && places.length > 0) {
      setIsLoading(true)
      
      try {
        const engine = new WeatherRecommendationEngine()
        const weatherRecommendations = engine.generateRecommendations(
          weather
        )
        
        setRecommendations(weatherRecommendations.slice(0, maxRecommendations))
      } catch (error) {
        console.error('Failed to generate weather recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [weather, places, location, maxRecommendations])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-500" />
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-500" />
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />
      case 'hot': return <Thermometer className="w-5 h-5 text-red-500" />
      case 'cool': return <Thermometer className="w-5 h-5 text-blue-400" />
      case 'humid': return <Droplets className="w-5 h-5 text-cyan-500" />
      default: return <Cloud className="w-5 h-5 text-gray-500" />
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'rainy': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'cloudy': return 'bg-gray-50 border-gray-200 text-gray-800'
      case 'hot': return 'bg-red-50 border-red-200 text-red-800'
      case 'cool': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'humid': return 'bg-cyan-50 border-cyan-200 text-cyan-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }


  if (!weather) {
    return (
      <div className={`weather-recommendations ${className}`}>
        <div className="text-center py-8 text-gray-500">
          <Cloud className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Weather data not available</p>
          <p className="text-sm">Enable location to get weather-based recommendations</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`weather-recommendations ${className}`}>
      {/* Weather Display */}
      {showWeatherDisplay && (
        <div className={`weather-display p-4 rounded-lg border-2 mb-6 ${getConditionColor(weather.condition)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weather.condition)}
              <div>
                <h3 className="font-semibold text-lg">
                  {weather.temperature}°C
                </h3>
                <p className="text-sm opacity-90">
                  {weather.description}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm opacity-75">
                Humidity: {weather.humidity}%
              </div>
              <div className="text-xs opacity-60 capitalize">
                {weather.condition} conditions
              </div>
            </div>
          </div>

          {/* General Weather Recommendations */}
          {weather.recommendations && weather.recommendations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <div className="space-y-1">
                {weather.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="text-sm opacity-90 flex items-center gap-2">
                    <span>💡</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Place Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Perfect Places for Current Weather
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-24"></div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <WeatherRecommendationCard
                key={rec.place.id}
                recommendation={rec}
                index={index}
                weather={weather}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Eye className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No specific recommendations for current weather</p>
            <p className="text-sm">All places are suitable for exploration</p>
          </div>
        )}
      </div>
    </div>
  )
}

type WeatherRecommendationType = WeatherRecommendation

interface WeatherRecommendationCardProps {
  recommendation: WeatherRecommendationType
  index: number
  weather: WeatherData
}

function WeatherRecommendationCard({ 
  recommendation, 
  index, 
  weather 
}: WeatherRecommendationCardProps) {
  const { place, suitability_score, weather_reasoning } = recommendation

  const getSuitabilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getSuitabilityIcon = (score: number) => {
    if (score >= 0.8) return '🌟'
    if (score >= 0.6) return '👍'
    if (score >= 0.4) return '👌'
    return '⚠️'
  }

  return (
    <div className="weather-recommendation-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{index + 1}
            </span>
            <div className={`text-sm px-2 py-1 rounded-full font-medium ${getSuitabilityColor(suitability_score)}`}>
              {getSuitabilityIcon(suitability_score)} {Math.round(suitability_score * 100)}% suitable
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

      {/* Weather Reasoning */}
      {weather_reasoning && weather_reasoning.length > 0 && (
        <div className="mb-3">
          <h5 className="text-sm font-medium text-gray-700 mb-1">Why it&apos;s perfect now:</h5>
          <div className="space-y-1">
            {weather_reasoning.map((reason: string, idx: number) => (
              <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-green-500">✓</span>
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

      {/* Weather Suitability Tags */}
      {place.weather_suitability && place.weather_suitability.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {place.weather_suitability.map((condition: string, idx: number) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded-full ${
                  condition.toLowerCase() === weather.condition.toLowerCase()
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {condition === weather.condition.toLowerCase() && '🎯 '}
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View Details
        </button>
        
        <button className="text-sm text-gray-600 hover:text-gray-800">
          Get Directions
        </button>
      </div>
    </div>
  )
}