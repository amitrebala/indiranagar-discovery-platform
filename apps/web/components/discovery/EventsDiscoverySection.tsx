'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, ExternalLink, Filter, RefreshCw, Ticket } from 'lucide-react'

interface DiscoveredEvent {
  id: string
  title: string
  description: string
  category: 'dining' | 'venue' | 'entertainment' | 'cultural' | 'nightlife'
  start_time: string
  end_time: string
  venue_name: string
  venue_address: string
  latitude?: number
  longitude?: number
  external_url?: string
  ticket_url?: string
  cost_type: 'free' | 'paid' | 'varies'
  quality_score: number
  moderation_status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
}

const CATEGORY_COLORS = {
  dining: 'bg-orange-100 text-orange-800',
  venue: 'bg-blue-100 text-blue-800',
  entertainment: 'bg-purple-100 text-purple-800',
  cultural: 'bg-green-100 text-green-800',
  nightlife: 'bg-pink-100 text-pink-800',
}

const CATEGORY_LABELS = {
  dining: 'Dining Experience',
  venue: 'Venue Visit',
  entertainment: 'Entertainment',
  cultural: 'Cultural Event',
  nightlife: 'Nightlife',
}

export function EventsDiscoverySection() {
  const [events, setEvents] = useState<DiscoveredEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [refreshing, setRefreshing] = useState(false)

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshEvents = async () => {
    setRefreshing(true)
    await fetchEvents()
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const filteredEvents = events.filter(event => 
    event.moderation_status === 'approved' && 
    event.is_active &&
    (selectedCategory === 'all' || event.category === selectedCategory)
  )

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)] as const

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600">Discovering latest events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(category => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={refreshEvents}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Events
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Events Found
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'all' 
              ? "We're working on discovering new events for you. Check back soon!"
              : `No ${CATEGORY_LABELS[selectedCategory as keyof typeof CATEGORY_LABELS]} events available right now.`
            }
          </p>
          <button
            onClick={() => {
              fetch('/api/events/fetch-google-places?force=true', { method: 'POST' })
                .then(() => {
                  alert('Fetching events from Google Places... This may take a minute.');
                  setTimeout(() => fetchEvents(), 5000);
                })
                .catch(console.error)
            }}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Fetch Real Events from Google Places
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${CATEGORY_COLORS[event.category]}`}>
                      {CATEGORY_LABELS[event.category]}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.cost_type === 'free' ? 'bg-green-100 text-green-800' :
                      event.cost_type === 'paid' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.cost_type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{event.venue_name}</p>
                    <p className="text-xs">{event.venue_address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p>
                      {formatDate(event.start_time)} • {formatTime(event.start_time)}
                      {event.end_time && ` - ${formatTime(event.end_time)}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full mr-1 ${
                          i < Math.floor(event.quality_score * 5) 
                            ? 'bg-yellow-400' 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {(event.quality_score * 100).toFixed(0)}% match
                  </span>
                </div>

                {(event.external_url || event.ticket_url) && (
                  <div className="flex gap-2">
                    {event.external_url && (
                      <a
                        href={event.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Details
                      </a>
                    )}
                    {event.ticket_url && (
                      <a
                        href={event.ticket_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-sm font-medium transition-colors"
                      >
                        <Ticket className="w-3 h-3" />
                        Tickets
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-800 text-sm">
          <strong>Auto-Discovery:</strong> Events are automatically discovered daily from Google Places and other sources. 
          New events appear here once approved by our moderation system.
        </p>
      </div>
    </div>
  )
}