import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Filter, Search } from 'lucide-react'
import JourneyExperienceCard from '@/components/journeys/JourneyExperienceCard'
import { JourneyExperience } from '@/lib/types/journey'

// Mock data for demonstration - in real app this would come from database
const mockJourneys: JourneyExperience[] = [
  {
    id: '1',
    name: 'Coffee Culture Crawl',
    description: 'Discover Indiranagar\'s finest coffee spots with insider knowledge and perfect timing.',
    mood_category: 'social',
    duration_minutes: 180,
    difficulty_level: 'easy',
    weather_suitability: ['sunny', 'cloudy'],
    optimal_times: [{
      start_time: '9:00 AM',
      end_time: '12:00 PM',
      reason: 'Best atmosphere and freshest pastries'
    }],
    journey_stops: [],
    alternatives: [],
    featured_image: '/images/places/coffee-shop.jpg',
    tags: ['coffee', 'social', 'morning', 'casual'],
    created_by: 'amit',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2',
    name: 'Contemplative Evening Walk',
    description: 'A peaceful journey through quiet corners and hidden gems for reflection and discovery.',
    mood_category: 'contemplative',
    duration_minutes: 120,
    difficulty_level: 'easy',
    weather_suitability: ['sunny', 'cloudy', 'cool'],
    optimal_times: [{
      start_time: '5:30 PM',
      end_time: '7:30 PM',
      reason: 'Golden hour lighting and fewer crowds'
    }],
    journey_stops: [],
    alternatives: [],
    featured_image: '/images/places/evening-walk.jpg',
    tags: ['peaceful', 'photography', 'evening', 'solo'],
    created_by: 'amit',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '3',
    name: 'Foodie Adventure Trail',
    description: 'From street food to fine dining - experience the complete culinary spectrum of Indiranagar.',
    mood_category: 'culinary',
    duration_minutes: 240,
    difficulty_level: 'moderate',
    weather_suitability: ['sunny', 'cloudy'],
    optimal_times: [{
      start_time: '11:00 AM',
      end_time: '3:00 PM',
      reason: 'Perfect timing for lunch specials and varied experiences'
    }],
    journey_stops: [],
    alternatives: [],
    featured_image: '/images/places/food-trail.jpg',
    tags: ['food', 'variety', 'lunch', 'exploration'],
    created_by: 'amit',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
]

function JourneyGrid({ journeys }: { journeys: JourneyExperience[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {journeys.map((journey) => (
        <JourneyExperienceCard key={journey.id} journey={journey} />
      ))}
    </div>
  )
}

function JourneyGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded" />
            </div>
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function JourneysPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/map"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Map</span>
            </Link>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Curated Journey Experiences
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Step-by-step guided adventures through Indiranagar, designed for different moods 
              and interests. Each journey includes optimal timing, insider tips, and photo opportunities.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search journeys..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Journey Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Mood</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { category: 'contemplative', icon: '🧘', label: 'Contemplative' },
              { category: 'energetic', icon: '⚡', label: 'Energetic' },
              { category: 'social', icon: '👥', label: 'Social' },
              { category: 'cultural', icon: '🎭', label: 'Cultural' },
              { category: 'culinary', icon: '🍽️', label: 'Culinary' }
            ].map((mood) => (
              <button
                key={mood.category}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>{mood.icon}</span>
                <span className="font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Journey Grid */}
        <Suspense fallback={<JourneyGridSkeleton />}>
          <JourneyGrid journeys={mockJourneys} />
        </Suspense>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want a Custom Journey?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Every journey here is crafted from personal experience. If you have specific interests 
              or timing needs, I can create a personalized route just for you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Request Custom Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}