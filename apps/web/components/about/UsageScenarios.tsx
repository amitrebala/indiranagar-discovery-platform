'use client'

import { useState } from 'react'
import { 
  Coffee, 
  Utensils, 
  Users, 
  Camera, 
  Cloud, 
  Clock,
  Star,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface Scenario {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  steps: string[]
  outcome: string
  ctaText: string
  ctaLink: string
  features: string[]
}

const scenarios: Scenario[] = [
  {
    id: 'morning-coffee',
    title: 'Perfect Morning Coffee Hunt',
    icon: <Coffee className="w-6 h-6" />,
    description: 'You just moved to Indiranagar and need your daily caffeine fix.',
    steps: [
      'Open the interactive map',
      'Filter by "Cafe" category',
      'Check the weather widget - it&apos;s a beautiful sunny morning',
      'Find Blue Tokai Coffee Roasters marked with a green verified badge',
      'Click to see it opens at 8 AM with "Morning 8-11 AM" as best time'
    ],
    outcome: 'You discover not just a coffee shop, but THE coffee shop where baristas know their beans and the morning crowd is a mix of startup folks and artists.',
    ctaText: 'Find Your Coffee Spot',
    ctaLink: '/map?category=Cafe',
    features: ['Weather-aware recommendations', 'Verified places', 'Best visit times']
  },
  {
    id: 'weekend-exploration',
    title: 'Weekend Food Adventure',
    icon: <Utensils className="w-6 h-6" />,
    description: 'Saturday evening, you want to try something new with friends.',
    steps: [
      'Browse the places page',
      'Sort by highest rating',
      'Spot "The Permit Room" with 4.3 stars',
      'Read Amit&apos;s insider tip about their special toddy',
      'Check companion activities - "Walk around 100 Feet Road after"'
    ],
    outcome: 'You experience authentic South Indian bar culture, try local drinks, and end the night with a pleasant walk discovering street art.',
    ctaText: 'Explore Top Rated Places',
    ctaLink: '/places',
    features: ['Personal ratings', 'Insider tips', 'Companion activities']
  },
  {
    id: 'rainy-day',
    title: 'Rainy Day Rescue',
    icon: <Cloud className="w-6 h-6" />,
    description: 'Sudden Bangalore rain catches you off-guard while exploring.',
    steps: [
      'Weather widget shows current rain',
      'Map automatically highlights indoor venues',
      'Phoenix MarketCity appears with "Perfect for: Rainy days"',
      'See it has "Fully wheelchair accessible" and "Ample parking"',
      'Notice multiple restaurant options inside'
    ],
    outcome: 'You stay dry, enjoy shopping, catch a movie, and have dinner - turning a rainy day into a perfect indoor adventure.',
    ctaText: 'Check Weather-Smart Options',
    ctaLink: '/map',
    features: ['Real-time weather', 'Smart suggestions', 'Accessibility info']
  },
  {
    id: 'photo-walk',
    title: 'Instagram-Worthy Photo Walk',
    icon: <Camera className="w-6 h-6" />,
    description: 'You want to capture Indiranagar&apos;s essence for your travel blog.',
    steps: [
      'Discover the "Journey Routes" feature on the map',
      'Select "Morning Photography Walk"',
      'Follow the curated route hitting 5 photogenic spots',
      'Each stop has Amit&apos;s composition tips',
      'Best lighting times included for each location'
    ],
    outcome: 'Your Instagram explodes with unique shots of hidden murals, heritage buildings, and candid street life that only a local would know.',
    ctaText: 'Start a Photo Journey',
    ctaLink: '/journeys',
    features: ['Curated routes', 'Photography tips', 'Hidden gems']
  },
  {
    id: 'business-meeting',
    title: 'Important Client Meeting',
    icon: <Users className="w-6 h-6" />,
    description: 'You need to impress a client with the perfect meeting spot.',
    steps: [
      'Filter places by "Business-friendly"',
      'Check "Quiet ambiance" tag',
      'Find Toast & Tonic with valet parking',
      'See "Best time: Lunch 12-3 PM" for less crowd',
      'Note the Wi-Fi availability and power outlets'
    ],
    outcome: 'The client is impressed by the sophisticated venue, the meeting goes smoothly, and they ask how you found such a perfect spot.',
    ctaText: 'Find Business Venues',
    ctaLink: '/search?ambiance=quiet',
    features: ['Ambiance filters', 'Practical amenities', 'Timing insights']
  },
  {
    id: 'late-night',
    title: 'Late Night Munchies',
    icon: <Clock className="w-6 h-6" />,
    description: 'It&apos;s 11 PM and you&apos;re craving something delicious.',
    steps: [
      'Use time-based search',
      'Filter "Open now"',
      'Sony&apos;s Rolls appears - &quot;Late night 10 PM-2 AM&quot;',
      'See it&apos;s marked as &quot;Street Food&quot; with 4.1 rating',
      'Read about their legendary Kolkata-style rolls'
    ],
    outcome: 'You discover why there&apos;s always a queue at Sony&apos;s, enjoy amazing rolls, and it becomes your go-to late-night spot.',
    ctaText: 'Find Late Night Options',
    ctaLink: '/search?open=late-night',
    features: ['Time-based search', 'Operating hours', 'Local favorites']
  }
]

export function UsageScenarios() {
  const [activeScenario, setActiveScenario] = useState<string>('morning-coffee')
  const active = scenarios.find(s => s.id === activeScenario)!

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How People Use <span className="text-orange-600">Indiranagar with Amit</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real scenarios showing how this platform helps you discover Indiranagar like a local
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenario(scenario.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                activeScenario === scenario.id
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
              }`}
            >
              <div className={`mx-auto mb-2 ${
                activeScenario === scenario.id ? 'text-orange-600' : 'text-gray-600'
              }`}>
                {scenario.icon}
              </div>
              <div className={`text-sm font-medium ${
                activeScenario === scenario.id ? 'text-orange-900' : 'text-gray-700'
              }`}>
                {scenario.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active Scenario Detail */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Scenario Story */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                {active.icon}
                {active.title}
              </h3>
              <p className="text-lg text-gray-600">
                {active.description}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Here&apos;s what you do:</h4>
              {active.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            {/* Outcome */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">The Result:</h4>
                  <p className="text-green-800">{active.outcome}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={active.ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {active.ctaText}
              <ChevronRight size={20} />
            </Link>
          </div>

          {/* Features Showcase */}
          <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6">
              Features Used in This Scenario
            </h4>
            <div className="space-y-4">
              {active.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Platform Stats */}
            <div className="mt-8 pt-8 border-t border-orange-200">
              <h5 className="font-semibold text-gray-900 mb-4">Why Trust These Recommendations?</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-gray-600">Personally Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">186</div>
                  <div className="text-sm text-gray-600">Places Visited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">5+</div>
                  <div className="text-sm text-gray-600">Years Local</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">Updated Info</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}