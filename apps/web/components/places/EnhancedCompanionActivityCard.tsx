'use client'

import { Clock, Users, MapPin, CloudRain, Sun, DollarSign, Lightbulb, Navigation } from 'lucide-react'
import { EnhancedCompanionActivity, JourneyContext } from '@/lib/types/journey'

interface EnhancedCompanionActivityCardProps {
  activity: EnhancedCompanionActivity
  journeyContext?: JourneyContext
  weatherData?: {
    condition: string
    temperature: number
  }
  showWalkingDirections?: boolean
}

interface WeatherSuitabilityBadgeProps {
  suitability: 'suitable' | 'not-suitable' | 'conditional'
}

function WeatherSuitabilityBadge({ suitability }: WeatherSuitabilityBadgeProps) {
  const styles = {
    suitable: 'bg-green-100 text-green-800',
    'not-suitable': 'bg-red-100 text-red-800',
    conditional: 'bg-yellow-100 text-yellow-800'
  }

  const labels = {
    suitable: 'Weather Suitable',
    'not-suitable': 'Check Weather',
    conditional: 'Weather Dependent'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[suitability]}`}>
      {labels[suitability]}
    </span>
  )
}

function WalkingDirections({ from, to, estimatedTime }: { 
  from?: { latitude: number; longitude: number }
  to?: { latitude: number; longitude: number }
  estimatedTime?: number 
}) {
  if (!from || !to || !estimatedTime) return null

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start gap-2">
        <Navigation className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h5 className="font-medium text-blue-900 text-sm">Walking Route</h5>
          <p className="text-blue-700 text-sm">
            {estimatedTime} min walk from previous location
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EnhancedCompanionActivityCard({ 
  activity, 
  journeyContext,
  weatherData,
  showWalkingDirections = false
}: EnhancedCompanionActivityCardProps) {
  
  const getActivitySuitability = (): 'suitable' | 'not-suitable' | 'conditional' => {
    if (activity.weather_dependent && weatherData) {
      return weatherData.condition === 'rain' ? 'not-suitable' : 'suitable'
    }
    return activity.weather_dependent ? 'conditional' : 'suitable'
  }

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'quiet':
        return 'text-green-600'
      case 'moderate':
        return 'text-yellow-600'
      case 'lively':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'morning':
        return 'bg-orange-100 text-orange-800'
      case 'afternoon':
        return 'bg-blue-100 text-blue-800'
      case 'evening':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'before':
        return 'bg-blue-400'
      case 'after':
        return 'bg-green-400'
      case 'during':
        return 'bg-purple-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="companion-activity-card bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`activity-type-indicator w-4 h-4 rounded-full ${getActivityTypeColor(activity.type)}`} />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{activity.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTimingColor(activity.timing)}`}>
                {activity.timing}
              </span>
              {activity.weather_dependent && (
                <WeatherSuitabilityBadge suitability={getActivitySuitability()} />
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
            <Clock className="w-4 h-4" />
            <span>{activity.duration_minutes}min</span>
          </div>
          {activity.cost_estimate && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <DollarSign className="w-4 h-4" />
              <span>
                {activity.cost_estimate.currency}{activity.cost_estimate.min}
                {activity.cost_estimate.max > activity.cost_estimate.min && 
                  `-${activity.cost_estimate.max}`
                }
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{activity.description}</p>

      {/* Timing and Crowd Recommendations */}
      <div className="timing-recommendations bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-sm mb-3 text-gray-900">Optimal Experience</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Best: {activity.timing}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className={`w-4 h-4 ${getCrowdLevelColor(activity.crowd_level_preference)}`} />
            <span className={getCrowdLevelColor(activity.crowd_level_preference)}>
              {activity.crowd_level_preference} crowd preferred
            </span>
          </div>
        </div>
      </div>

      {/* Location Information */}
      {activity.location && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-blue-900 text-sm">Location</h5>
              {activity.location.address && (
                <p className="text-blue-700 text-sm">{activity.location.address}</p>
              )}
              {activity.walking_time_minutes && (
                <p className="text-blue-600 text-xs mt-1">
                  {activity.walking_time_minutes} min walk
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Insider Tips */}
      {activity.insider_tips.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            Insider Tips
          </h4>
          <div className="space-y-1">
            {activity.insider_tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Walking Directions */}
      {showWalkingDirections && journeyContext && (
        <WalkingDirections 
          from={journeyContext.previousLocation}
          to={activity.location}
          estimatedTime={activity.walking_time_minutes}
        />
      )}

      {/* Weather Alert */}
      {activity.weather_dependent && weatherData && getActivitySuitability() === 'not-suitable' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <CloudRain className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">Weather Advisory</p>
              <p className="text-red-700 text-sm">
                This activity may not be suitable for current weather conditions ({weatherData.condition}).
                Consider indoor alternatives or wait for better weather.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}