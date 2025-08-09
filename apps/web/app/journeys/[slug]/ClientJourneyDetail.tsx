'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Clock, MapPin, Navigation, Star, Loader2 } from 'lucide-react'
import ResponsiveJourneyInterface from '@/components/journeys/ResponsiveJourneyInterface'
import { JourneyNavigationUI } from '@/components/journeys/JourneyNavigationUI'
import { JourneyProgressTracker } from '@/components/journeys/JourneyProgressTracker'
import { JourneyWeatherCard } from '@/components/journeys/JourneyWeatherCard'
import { JourneyPhotoSpots } from '@/components/journeys/JourneyPhotoSpots'
import { JourneyShareButton } from '@/components/journeys/JourneyShareButton'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase/types'

interface ClientJourneyDetailProps {
  slug: string
}

export default function ClientJourneyDetail({ slug }: ClientJourneyDetailProps) {
  const [journey, setJourney] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        setLoading(true)
        
        // First try to find by ID (for legacy links)
        let { data, error: fetchError } = await supabase
          .from('journeys')
          .select(`
            *,
            journey_places (
              *,
              place:places (
                id,
                name,
                description,
                coordinates,
                category,
                subcategory,
                price_level,
                opening_hours
              )
            )
          `)
          .eq('id', slug)
          .single()

        // If not found by ID, try by a title match
        if (!data) {
          const { data: journeyByTitle } = await supabase
            .from('journeys')
            .select(`
              *,
              journey_places (
                *,
                place:places (
                  id,
                  name,
                  description,
                  coordinates,
                  category,
                  subcategory,
                  price_level,
                  opening_hours
                )
              )
            `)
            .ilike('title', slug.replace(/-/g, ' '))
            .single()
          
          data = journeyByTitle
        }

        if (!data) {
          setError('Journey not found')
          return
        }

        // Transform the data to match the expected format
        const transformedJourney = {
          id: data.id,
          name: data.title,
          slug: data.title?.toLowerCase().replace(/\s+/g, '-'),
          description: data.description,
          mood_category: data.vibe_tags?.[0] || 'social',
          duration_minutes: parseInt(data.estimated_time?.replace(/[^0-9]/g, '') || '180'),
          difficulty_level: 'easy',
          weather_suitability: ['clear', 'cloudy'],
          optimal_times: [{
            start_time: '9:00 AM',
            end_time: '5:00 PM',
            reason: 'Best time for this journey'
          }],
          journey_stops: (data.journey_places || [])
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((stop: any, index: number) => ({
              id: `stop-${index}`,
              place_id: stop.place_id,
              place: stop.place,
              order: stop.order_index,
              duration_minutes: 45,
              activities: [],
              walking_directions: null,
              photo_opportunities: [],
              timing_notes: stop.notes,
              story_context: stop.notes
            })),
          alternatives: [],
          featured_image: `/images/journeys/${data.title?.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          tags: data.vibe_tags || [],
          gradient: data.gradient,
          icon: data.icon
        }

        setJourney(transformedJourney)
      } catch (err) {
        console.error('Error fetching journey:', err)
        setError('Failed to load journey')
      } finally {
        setLoading(false)
      }
    }

    fetchJourney()
  }, [slug, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Journey Not Found</h2>
          <p className="text-gray-600">The journey you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'contemplative': return '🧘'
      case 'energetic': return '⚡'
      case 'social': return '👥'
      case 'cultural': return '🎭'
      case 'culinary': return '🍽️'
      default: return '✨'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'
      case 'challenging': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{journey.icon || getMoodIcon(journey.mood_category)}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                {journey.mood_category} Journey
              </span>
              <span className={`px-3 py-1 bg-gray-100 rounded-full text-sm font-medium capitalize ${getDifficultyColor(journey.difficulty_level)}`}>
                {journey.difficulty_level}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {journey.name}
              </h1>
              <JourneyShareButton journey={journey} />
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {journey.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-900 font-semibold mb-1">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>{Math.floor(journey.duration_minutes / 60)}h {journey.duration_minutes % 60}m</span>
                </div>
                <p className="text-sm text-gray-600">Total Duration</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-900 font-semibold mb-1">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>{journey.journey_stops.length}</span>
                </div>
                <p className="text-sm text-gray-600">Stops</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-900 font-semibold mb-1">
                  <Navigation className="w-5 h-5 text-purple-600" />
                  <span className="capitalize">{journey.difficulty_level}</span>
                </div>
                <p className="text-sm text-gray-600">Difficulty</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-900 font-semibold mb-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Curated</span>
                </div>
                <p className="text-sm text-gray-600">By Amit</p>
              </div>
            </div>
          </div>

          {journey.optimal_times.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Recommended Timing</h3>
              <p className="text-blue-800">
                <strong>{journey.optimal_times[0].start_time} - {journey.optimal_times[0].end_time}</strong>
                <span className="ml-2 text-blue-700">• {journey.optimal_times[0].reason}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Journey Navigation - Left Column (2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {journey.journey_stops.length > 0 ? (
              <JourneyNavigationUI
                journeyId={journey.id}
                journeyName={journey.name}
                stops={journey.journey_stops}
                onComplete={() => {
                  console.log('Journey completed!')
                }}
              />
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-600">No stops available for this journey yet.</p>
              </div>
            )}

            {/* Responsive Journey Interface for Map View */}
            <ResponsiveJourneyInterface 
              journey={journey}
              onStopComplete={(stopId) => {
                console.log('Stop completed:', stopId)
              }}
              onJourneyComplete={() => {
                console.log('Journey completed!')
              }}
            />
          </div>

          {/* Side Panel - Right Column */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            {journey.journey_stops.length > 0 && (
              <JourneyProgressTracker
                journeyId={journey.id}
                journeyName={journey.name}
                stops={journey.journey_stops}
              />
            )}

            {/* Weather Card */}
            <JourneyWeatherCard journey={journey} />

            {/* Photo Spots */}
            {journey.journey_stops.length > 0 && (
              <JourneyPhotoSpots stops={journey.journey_stops} />
            )}
          </div>
        </div>

        {/* Journey Tips */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Journey Tips</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Before You Start</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Check weather conditions and dress accordingly</li>
                <li>• Bring a portable charger for photos and navigation</li>
                <li>• Start with an empty stomach for food journeys</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">During the Journey</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Take your time at each stop - this isn't a race</li>
                <li>• Don&apos;t hesitate to ask locals for recommendations</li>
                <li>• Document your experience for future reference</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}