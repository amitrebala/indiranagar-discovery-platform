'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Calendar, 
  Coffee, 
  Camera,
  Shield,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  year: number
  month: string
  event: string
  milestone?: boolean
}

const timeline: TimelineEvent[] = [
  { year: 2019, month: 'March', event: 'Moved to Indiranagar' },
  { year: 2019, month: 'June', event: 'Started exploring cafes' },
  { year: 2020, month: 'January', event: 'Reached 50 places visited', milestone: true },
  { year: 2021, month: 'March', event: 'Started documenting reviews' },
  { year: 2022, month: 'July', event: 'Crossed 100 places', milestone: true },
  { year: 2023, month: 'September', event: 'Launched the platform', milestone: true },
  { year: 2024, month: 'January', event: '166 places and counting!' }
]

const stats = [
  {
    id: 'places',
    label: 'Places Visited',
    value: 166,
    trend: 'up',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: <MapPin className="w-5 h-5" />,
    detail: 'Click to see categories',
    clickable: true,
    subStats: {
      'Cafes': 45,
      'Restaurants': 67,
      'Bars': 23,
      'Street Food': 18,
      'Others': 13
    }
  },
  {
    id: 'years',
    label: 'Years Local',
    value: '5+',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: <Calendar className="w-5 h-5" />,
    detail: 'Since March 2019'
  },
  {
    id: 'coffees',
    label: 'Coffees Consumed',
    value: '500+',
    trend: 'up',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: <Coffee className="w-5 h-5" />,
    detail: 'And counting...'
  },
  {
    id: 'photos',
    label: 'Photos Taken',
    value: '1000+',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: <Camera className="w-5 h-5" />,
    detail: 'Documenting every visit'
  }
]

const weeklyStats = {
  placesVisited: 3,
  newDiscoveries: 1,
  communityContributions: 12
}

export function TrustDashboard() {
  const [selectedStat, setSelectedStat] = useState<string | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)
  
  const activeStat = stats.find(s => s.id === selectedStat)

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Why Trust These Recommendations?
          </motion.h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every single place is personally verified by Amit - no paid promotions, just honest experiences
          </p>
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.button
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => stat.clickable && setSelectedStat(stat.id)}
              className={cn(
                'bg-white rounded-xl p-6 text-center shadow-sm transition-all',
                stat.clickable && 'hover:shadow-md cursor-pointer',
                selectedStat === stat.id && 'ring-2 ring-orange-500'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3',
                stat.bgColor
              )}>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-1">
                {stat.value}
                {stat.trend && (
                  <TrendingUp className={cn(
                    'w-4 h-4',
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  )} />
                )}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              {stat.detail && (
                <div className="text-xs text-gray-500 mt-1">
                  {stat.detail}
                </div>
              )}
            </motion.button>
          ))}
        </div>
        
        {/* Stat Detail View */}
        {selectedStat && activeStat?.subStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 bg-white rounded-xl p-6 shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Place Categories Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(activeStat.subStats).map(([category, count]) => (
                <Link
                  key={category}
                  href={`/places?category=${category.toLowerCase()}`}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{category}</div>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                100% Verified
              </h3>
              <p className="text-sm text-gray-600">
                Every place personally visited and reviewed
              </p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Community Driven
              </h3>
              <p className="text-sm text-gray-600">
                {weeklyStats.communityContributions} suggestions this week
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Always Updated
              </h3>
              <p className="text-sm text-gray-600">
                {weeklyStats.placesVisited} places revisited this week
              </p>
            </div>
          </div>
        </div>
        
        {/* Timeline Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium"
          >
            {showTimeline ? 'Hide' : 'Show'} Amit&apos;s Journey
            <ChevronRight className={cn(
              'w-5 h-5 transition-transform',
              showTimeline && 'rotate-90'
            )} />
          </button>
        </div>
        
        {/* Timeline */}
        {showTimeline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-12"
          >
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300" />
              
              {/* Timeline Events */}
              <div className="space-y-8">
                {timeline.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'relative flex items-center',
                      index % 2 === 0 ? 'justify-start' : 'justify-end'
                    )}
                  >
                    <div className={cn(
                      'bg-white rounded-lg p-4 shadow-md max-w-xs',
                      event.milestone && 'ring-2 ring-orange-500'
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">
                          {event.year}
                        </span>
                        <span className="text-sm text-gray-500">
                          {event.month}
                        </span>
                      </div>
                      <p className="text-gray-700">{event.event}</p>
                      {event.milestone && (
                        <CheckCircle className="w-4 h-4 text-orange-500 mt-2" />
                      )}
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className={cn(
                      'absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full',
                      event.milestone ? 'bg-orange-500' : 'bg-gray-400'
                    )} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Live Updates */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                This Week&apos;s Activity
              </h3>
              <p className="text-sm text-gray-600">
                Amit discovered {weeklyStats.newDiscoveries} new place and revisited {weeklyStats.placesVisited} favorites
              </p>
            </div>
            <Link
              href="/places?sort=recent"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
            >
              See Latest
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}