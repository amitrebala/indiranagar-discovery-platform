'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, MapPin, Users, Star, Cloud, Sun, CloudRain, Navigation } from 'lucide-react'
import { JourneyExperience } from '@/lib/types/journey'

interface JourneyExperienceCardProps {
  journey: JourneyExperience
  className?: string
}

export default function JourneyExperienceCard({ journey, className = '' }: JourneyExperienceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'contemplative':
        return '🧘'
      case 'energetic':
        return '⚡'
      case 'social':
        return '👥'
      case 'cultural':
        return '🎭'
      case 'culinary':
        return '🍽️'
      default:
        return '✨'
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'contemplative':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'energetic':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'social':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cultural':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'culinary':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600'
      case 'moderate':
        return 'text-yellow-600'
      case 'challenging':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-4 h-4" />
      case 'rainy':
        return <CloudRain className="w-4 h-4" />
      case 'cloudy':
        return <Cloud className="w-4 h-4" />
      default:
        return <Sun className="w-4 h-4" />
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  return (
    <Link href={`/journeys/${journey.id}`}>
      <div className={`journey-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group ${className}`}>
        {/* Journey Image */}
        <div className="relative h-48 overflow-hidden">
          <div className={`w-full h-full bg-gray-200 ${!imageLoaded ? 'animate-pulse' : ''}`}>
            <Image
              src={journey.featured_image || '/images/placeholder-place.jpg'}
              alt={journey.name}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Mood Badge */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium border ${getMoodColor(journey.mood_category)}`}>
            <span className="mr-1">{getMoodIcon(journey.mood_category)}</span>
            <span className="capitalize">{journey.mood_category}</span>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4 inline mr-1" />
            {formatDuration(journey.duration_minutes)}
          </div>
          
          {/* Journey Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-xl mb-1 line-clamp-2">
              {journey.name}
            </h3>
          </div>
        </div>

        {/* Journey Details */}
        <div className="p-6">
          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
            {journey.description}
          </p>

          {/* Journey Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{journey.journey_stops.length} stops</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="w-4 h-4 text-purple-600" />
              <span className={`font-medium capitalize ${getDifficultyColor(journey.difficulty_level)}`}>
                {journey.difficulty_level}
              </span>
            </div>
          </div>

          {/* Weather Suitability */}
          <div className="mb-4">
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <span className="font-medium">Best weather:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {journey.weather_suitability.slice(0, 3).map((condition, index) => (
                <div
                  key={condition}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                >
                  {getWeatherIcon(condition)}
                  <span className="capitalize">{condition}</span>
                </div>
              ))}
              {journey.weather_suitability.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{journey.weather_suitability.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {journey.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {journey.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {journey.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{journey.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Optimal Time Indicator */}
          {journey.optimal_times.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Best time:</span>
                <span className="font-medium text-gray-900">
                  {journey.optimal_times[0].start_time} - {journey.optimal_times[0].end_time}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {journey.optimal_times[0].reason}
              </p>
            </div>
          )}
        </div>

        {/* Call to Action Footer */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-900 font-medium text-sm">Start This Journey</p>
                <p className="text-blue-700 text-xs">Step-by-step guided experience</p>
              </div>
              <div className="text-blue-600">
                <Navigation className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}