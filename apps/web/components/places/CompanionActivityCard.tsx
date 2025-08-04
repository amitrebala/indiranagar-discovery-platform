'use client'

import { Clock, CloudRain } from 'lucide-react'
import { CompanionActivity } from '@/lib/validations'

interface CompanionActivityCardProps {
  activity: CompanionActivity
}

export default function CompanionActivityCard({ activity }: CompanionActivityCardProps) {
  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'before':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'after':
        return 'bg-green-50 border-green-200 text-green-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'before':
        return 'Before'
      case 'after':
        return 'After'
      default:
        return 'Activity'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* Activity type badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActivityTypeColor(activity.activity_type)}`}>
          {getActivityTypeLabel(activity.activity_type)}
        </span>
        
        {/* Weather dependent indicator */}
        {activity.weather_dependent && (
          <div className="flex items-center gap-1 text-blue-600">
            <CloudRain className="w-4 h-4" />
            <span className="text-xs">Weather dependent</span>
          </div>
        )}
      </div>

      {/* Activity name */}
      <h3 className="font-bold text-gray-900 mb-2 text-lg">
        {activity.name}
      </h3>

      {/* Activity description */}
      {activity.description && (
        <p className="text-gray-700 mb-3 leading-relaxed">
          {activity.description}
        </p>
      )}

      {/* Timing information */}
      {activity.timing_minutes && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {activity.timing_minutes < 60 
              ? `${activity.timing_minutes} minutes`
              : `${Math.floor(activity.timing_minutes / 60)}h ${activity.timing_minutes % 60}m`
            }
          </span>
        </div>
      )}

      {/* Activity type context */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          {activity.activity_type === 'before' 
            ? "Do this before visiting the main place"
            : "Perfect to do after your main visit"
          }
        </p>
      </div>
    </div>
  )
}