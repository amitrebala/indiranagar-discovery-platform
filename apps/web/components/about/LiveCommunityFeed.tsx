'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  MessageSquare, 
  Calendar, 
  ThumbsUp,
  Users,
  Filter,
  RefreshCw,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { CommunityActivity } from '@/lib/types/about'

// Mock data - in production this would come from Supabase real-time
const mockActivities: CommunityActivity[] = [
  {
    id: '1',
    type: 'place_visited',
    user: {
      name: 'Sarah M.',
      type: 'foodie',
      avatar: '/avatars/sarah.jpg'
    },
    content: 'Just discovered The Permit Room - the toddy is incredible!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    relatedPlace: {
      id: 'permit-room',
      name: 'The Permit Room'
    }
  },
  {
    id: '2',
    type: 'suggestion_made',
    user: {
      name: 'Raj K.',
      type: 'new_resident',
    },
    content: 'Suggested adding "The Daily Sip" - new coffee place on 12th Main',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
  },
  {
    id: '3',
    type: 'event_created',
    user: {
      name: 'Priya L.',
      type: 'explorer',
      avatar: '/avatars/priya.jpg'
    },
    content: 'Organizing a weekend food walk - join us Saturday morning!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: '4',
    type: 'review_added',
    user: {
      name: 'Mike T.',
      type: 'local',
    },
    content: 'Blue Tokai never disappoints - best flat white in Indiranagar',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    relatedPlace: {
      id: 'blue-tokai',
      name: 'Blue Tokai Coffee Roasters'
    }
  }
]

const activityIcons = {
  place_visited: MapPin,
  suggestion_made: MessageSquare,
  event_created: Calendar,
  review_added: ThumbsUp
}

const userTypeColors = {
  new_resident: 'bg-blue-100 text-blue-700',
  foodie: 'bg-orange-100 text-orange-700',
  explorer: 'bg-green-100 text-green-700',
  local: 'bg-purple-100 text-purple-700'
}

const getTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function LiveCommunityFeed() {
  const [activities, setActivities] = useState<CommunityActivity[]>(mockActivities)
  const [filter, setFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new activity
      if (Math.random() > 0.7) {
        const newActivity: CommunityActivity = {
          id: Date.now().toString(),
          type: 'place_visited',
          user: {
            name: 'New User',
            type: 'foodie'
          },
          content: 'Just joined and exploring the neighborhood!',
          timestamp: new Date(),
          relatedPlace: {
            id: 'random',
            name: 'Random Place'
          }
        }
        setActivities(prev => [newActivity, ...prev].slice(0, 10))
      }
    }, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      // In production, this would fetch latest activities
    }, 1000)
  }
  
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.user.type === filter)

  return (
    <div id="community-feed" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Live Community Activity
          </motion.h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what fellow explorers are discovering right now
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  filter === 'all' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilter('foodie')}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  filter === 'foodie' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                Foodies
              </button>
              <button
                onClick={() => setFilter('new_resident')}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  filter === 'new_resident' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                New Residents
              </button>
              <button
                onClick={() => setFilter('explorer')}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  filter === 'explorer' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                Explorers
              </button>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RefreshCw className={cn(
              'w-4 h-4',
              isRefreshing && 'animate-spin'
            )} />
            Refresh
          </button>
        </div>
        
        {/* Activity Feed */}
        <div className="grid gap-4 mb-8">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type]
              const userTypeColor = userTypeColors[activity.user.type]
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Activity Icon */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {activity.user.name}
                            </span>
                            <span className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium',
                              userTypeColor
                            )}>
                              {activity.user.type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-700">
                            {activity.content}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      
                      {/* Related Place Link */}
                      {activity.relatedPlace && (
                        <Link
                          href={`/places/${activity.relatedPlace.id}`}
                          className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium mt-2"
                        >
                          View {activity.relatedPlace.name}
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        
        {/* Join CTA */}
        <div className="text-center bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8">
          <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Join the Community
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Share your discoveries, suggest new places, and connect with fellow food lovers exploring Indiranagar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Explore Community
              <ChevronRight size={20} />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
            >
              Suggest a Place
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}