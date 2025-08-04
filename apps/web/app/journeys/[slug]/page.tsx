import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, Navigation, Star, Users } from 'lucide-react'
import ResponsiveJourneyInterface from '@/components/journeys/ResponsiveJourneyInterface'
import { JourneyExperience } from '@/lib/types/journey'

interface JourneyPageProps {
  params: Promise<{
    slug: string
  }>
}

// Mock journey data - in real app this would come from database
const mockJourneyData: Record<string, JourneyExperience> = {
  '1': {
    id: '1',
    name: 'Coffee Culture Crawl',
    description: 'Discover Indiranagar\'s finest coffee spots with insider knowledge and perfect timing. This journey takes you through three distinct coffee experiences, from artisanal single-origin to cozy neighborhood favorites.',
    mood_category: 'social',
    duration_minutes: 180,
    difficulty_level: 'easy',
    weather_suitability: ['sunny', 'cloudy'],
    optimal_times: [{
      start_time: '9:00 AM',
      end_time: '12:00 PM',
      reason: 'Best atmosphere and freshest pastries'
    }],
    journey_stops: [
      {
        id: 'stop-1',
        place_id: 'place-1',
        order: 0,
        duration_minutes: 45,
        activities: [
          {
            id: 'activity-1',
            type: 'during',
            name: 'Morning Coffee Ritual',
            description: 'Start with their signature single-origin pour-over. Sit at the window counter for the best people-watching.',
            duration_minutes: 30,
            timing: 'morning',
            weather_dependent: false,
            crowd_level_preference: 'quiet',
            insider_tips: [
              'Ask for the barista\'s recommendation based on your taste preferences',
              'The corner table by the window has the best natural light for photos'
            ]
          }
        ],
        walking_directions: {
          from_coordinates: { latitude: 12.9716, longitude: 77.5946 },
          to_coordinates: { latitude: 12.9726, longitude: 77.5956 },
          path: [],
          distance_meters: 800,
          estimated_minutes: 10,
          difficulty: 'easy',
          accessibility_notes: 'Sidewalk available, step-free access',
          landmarks: ['Blue Tokai Coffee', 'Indiranagar Metro Station'],
          route_description: 'Walk north on 100 Feet Road, turn right at the metro station'
        },
        timing_notes: 'Perfect start to the day with fresh morning energy',
        photo_opportunities: [
          {
            id: 'photo-1',
            name: 'Latte Art Close-up',
            description: 'Capture the intricate latte art against the wooden table',
            best_time: '9:30 AM - 10:00 AM',
            lighting_notes: 'Natural window light creates perfect contrast',
            location_notes: 'Window-side seating area',
            instagram_worthy: true
          }
        ],
        story_context: 'This is where I discovered the difference between good coffee and great coffee. The barista here taught me to appreciate the subtle notes that make each origin unique.'
      },
      {
        id: 'stop-2',
        place_id: 'place-2',
        order: 1,
        duration_minutes: 60,
        activities: [
          {
            id: 'activity-2',
            type: 'during',
            name: 'Mid-Morning Social Coffee',
            description: 'Experience the bustling social atmosphere with locals and remote workers. Try their famous filter coffee alongside modern interpretations.',
            duration_minutes: 45,
            timing: 'morning',
            weather_dependent: false,
            crowd_level_preference: 'moderate',
            insider_tips: [
              'The filter coffee here rivals any traditional South Indian home',
              'Free WiFi makes this a great spot for digital nomads'
            ]
          }
        ],
        walking_directions: {
          from_coordinates: { latitude: 12.9726, longitude: 77.5956 },
          to_coordinates: { latitude: 12.9736, longitude: 77.5966 },
          path: [],
          distance_meters: 1200,
          estimated_minutes: 15,
          difficulty: 'easy',
          accessibility_notes: 'Mostly covered walkway, some steps at entrance',
          landmarks: ['Forum Mall', 'Garuda Mall entrance'],
          route_description: 'Continue on 100 Feet Road towards Forum Mall, turn left at the side street'
        },
        timing_notes: 'Peak social hours with vibrant community energy',
        photo_opportunities: [
          {
            id: 'photo-2',
            name: 'Traditional vs Modern',
            description: 'Contrast shot of filter coffee and espresso side by side',
            best_time: '10:30 AM - 11:00 AM',
            lighting_notes: 'Soft indoor lighting creates warm ambiance',
            location_notes: 'Central communal table',
            instagram_worthy: true
          }
        ],
        story_context: 'Here I learned that coffee culture isn\'t just about the drink - it\'s about community. I\'ve seen business deals, first dates, and study sessions all happening over the perfect cup.'
      },
      {
        id: 'stop-3',
        place_id: 'place-3',
        order: 2,
        duration_minutes: 75,
        activities: [
          {
            id: 'activity-3',
            type: 'during',
            name: 'Dessert Coffee Finale',
            description: 'End with their famous coffee-based desserts and specialty drinks. Perfect for reflection on the morning\'s journey.',
            duration_minutes: 60,
            timing: 'morning',
            weather_dependent: false,
            crowd_level_preference: 'quiet',
            insider_tips: [
              'The tiramisu here is made fresh daily - don\'t miss it',
              'Ask for the \'coffee journey flight\' to taste all their signature blends'
            ]
          }
        ],
        walking_directions: {
          from_coordinates: { latitude: 12.9736, longitude: 77.5966 },
          to_coordinates: { latitude: 12.9746, longitude: 77.5976 },
          path: [],
          distance_meters: 600,
          estimated_minutes: 8,
          difficulty: 'easy',
          accessibility_notes: 'Elevator access available, wide entrance',
          landmarks: ['Courtyard by Marriott', 'CMH Road junction'],
          route_description: 'Short walk through the courtyard area to CMH Road'
        },
        timing_notes: 'Perfect finale with dessert and contemplation time',
        photo_opportunities: [
          {
            id: 'photo-3',
            name: 'Coffee Journey Spread',
            description: 'Flat lay of all the coffee experiences from the morning',
            best_time: '11:30 AM - 12:00 PM',
            lighting_notes: 'Natural light from large windows',
            location_notes: 'Large corner table near entrance',
            instagram_worthy: true
          }
        ],
        story_context: 'This final stop represents the culmination of coffee appreciation - where the art of coffee meets the art of living well.'
      }
    ],
    alternatives: [
      {
        id: 'rainy-alternative',
        name: 'Rainy Day Coffee Tour',
        reason: 'Indoor-focused route for monsoon weather',
        alternative_stops: ['mall-coffee-1', 'covered-cafe-2', 'hotel-lobby-coffee'],
        weather_condition: 'rainy'
      }
    ],
    featured_image: '/images/journeys/coffee-crawl.jpg',
    tags: ['coffee', 'social', 'morning', 'casual', 'artisanal'],
    created_by: 'amit',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
}

async function getJourney(slug: string): Promise<JourneyExperience | null> {
  // In real app, this would be a database query
  return mockJourneyData[slug] || null
}

function JourneyHeader({ journey }: { journey: JourneyExperience }) {
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
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link 
            href="/journeys"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">All Journeys</span>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{getMoodIcon(journey.mood_category)}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
              {journey.mood_category} Journey
            </span>
            <span className={`px-3 py-1 bg-gray-100 rounded-full text-sm font-medium capitalize ${getDifficultyColor(journey.difficulty_level)}`}>
              {journey.difficulty_level}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {journey.name}
          </h1>
          
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
  )
}

function JourneySkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-20 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { slug } = await params;
  const journey = await getJourney(slug)

  if (!journey) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JourneyHeader journey={journey} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Suspense fallback={<JourneySkeleton />}>
          <ResponsiveJourneyInterface 
            journey={journey}
            onStopComplete={(stopId) => {
              console.log('Stop completed:', stopId)
            }}
            onJourneyComplete={() => {
              console.log('Journey completed!')
            }}
          />
        </Suspense>

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
                <li>• Don't hesitate to ask locals for recommendations</li>
                <li>• Document your experience for future reference</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}