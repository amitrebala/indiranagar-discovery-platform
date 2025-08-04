'use client'

import { Container } from '@/components/layout/Container'
import { MapPin, Heart, Coffee, Camera, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { UsageScenarios } from './UsageScenarios'
import { QuickFeatures } from './QuickFeatures'
import { UserQuotes } from './UserQuotes'

export function AboutContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* How People Use This Platform Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How People Use Indiranagar with Amit
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how locals, visitors, and food enthusiasts make the most of this personal curation platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Weekend Explorers */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-primary/20">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Weekend Explorers</h3>
                <p className="text-gray-600 mb-4">
                  Plan perfect weekend outings by browsing categories like "cozy cafes" or "rooftop bars". 
                  Use the weather-aware recommendations to find the best spots for any day.
                </p>
                <div className="text-sm text-primary font-medium">
                  "Perfect for lazy Sunday brunches!" - Regular User
                </div>
              </div>

              {/* New Residents */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-secondary/20">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">New Residents</h3>
                <p className="text-gray-600 mb-4">
                  Just moved to Indiranagar? Start with Amit's highest-rated places and use the 
                  "nearby activities" feature to discover what to do before and after your visit.
                </p>
                <div className="text-sm text-secondary font-medium">
                  "Helped me settle into the neighborhood faster!" - New Resident
                </div>
              </div>

              {/* Date Planners */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-accent/20">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Date Planners</h3>
                <p className="text-gray-600 mb-4">
                  Filter by "romantic" vibes or "special occasions" tags. Amit's personal notes 
                  include perfect spots for first dates, anniversaries, and special celebrations.
                </p>
                <div className="text-sm text-accent font-medium">
                  "RIM NAAM recommendation was perfect!" - Happy Couple
                </div>
              </div>

              {/* Food Enthusiasts */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-green-500/20">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <Coffee className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Food Enthusiasts</h3>
                <p className="text-gray-600 mb-4">
                  Dive deep into cuisine categories, check "must try" dishes, and read Amit's 
                  detailed notes about what makes each place special. No generic reviews here!
                </p>
                <div className="text-sm text-green-600 font-medium">
                  "Found my new favorite biryani spot!" - Food Lover
                </div>
              </div>

              {/* Business Travelers */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-blue-500/20">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Travelers</h3>
                <p className="text-gray-600 mb-4">
                  Short on time? Use the floating "Has Amit Been Here?" button to quickly check 
                  if that restaurant near your hotel is worth visiting. Get instant authentic insights.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  "Saved me from tourist traps!" - Business Traveler
                </div>
              </div>

              {/* Community Contributors */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-purple-500/20">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Contributors</h3>
                <p className="text-gray-600 mb-4">
                  Suggest new places through the search feature, add comments with your own experiences, 
                  and help other community members with questions in the Community section.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  "Love contributing to this growing community!" - Active Member
                </div>
              </div>
            </div>

            {/* Key Features Callout */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-primary/30">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What Makes This Different?
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">100% Personally Verified</h4>
                    <p className="text-gray-600 text-sm">Every single place has been visited by Amit personally. No paid promotions or generic listings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Local Insider Knowledge</h4>
                    <p className="text-gray-600 text-sm">Get the real scoop - best times to visit, what to order, and what to skip.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Interactive Search</h4>
                    <p className="text-gray-600 text-sm">Floating search button lets you instantly check if Amit has been to any place you're curious about.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Community Driven</h4>
                    <p className="text-gray-600 text-sm">Suggest new places, ask questions, and share your own experiences with fellow food lovers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero Section */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meet Amit
              </h2>
              <p className="text-xl text-gray-600">
                Your personal guide to Indiranagar, Bangalore
              </p>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  I've been living in Indiranagar for over 5 years, and what started as casual 
                  weekend explorations turned into a passionate mission to discover every hidden 
                  gem this vibrant neighborhood has to offer.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  From hole-in-the-wall cafes serving the best filter coffee to rooftop restaurants 
                  with stunning city views, I've personally visited and experienced every single one 
                  of the 166 places featured on this platform. Each recommendation comes with my 
                  honest review, insider tips, and the best times to visit.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  I created <strong className="text-orange-600">Indiranagar with Amit</strong> because 
                  I believe the best recommendations come from someone who actually lives here, not 
                  from generic travel guides or paid reviews. This is my love letter to Indiranagar - 
                  a neighborhood that perfectly captures Bangalore's unique blend of tradition and 
                  modernity.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">166</div>
                <div className="text-sm text-gray-600">Places Visited</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">5+</div>
                <div className="text-sm text-gray-600">Years in Indiranagar</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Coffee className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Coffees Consumed</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Photos Taken</div>
              </div>
            </div>

            {/* Why I Created This */}
            <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-8 md:p-12 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Why I Created This Platform
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Authentic Recommendations:</strong> Every place is personally visited 
                    and verified, not just scraped from the internet.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Local Perspective:</strong> As a resident, I know the best times to 
                    visit, secret menu items, and which places live up to the hype.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Weather-Aware:</strong> Bangalore weather can be unpredictable. My 
                    recommendations adapt based on current conditions.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Community Building:</strong> I wanted to create a platform where locals 
                    and visitors can discover the real Indiranagar together.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Usage Scenarios Section */}
      <UsageScenarios />
      
      {/* Quick Features */}
      <QuickFeatures />
      
      {/* User Quotes */}
      <UserQuotes />

      {/* Final Call to Action */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Explore Indiranagar Like a Local?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join me on this journey through Bangalore's most vibrant neighborhood. 
              Every recommendation comes from personal experience, every tip is tested, 
              and every place has a story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                <MapPin size={24} />
                Start Exploring Now
              </Link>
              <Link
                href="/places"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium text-lg"
              >
                Browse All 166 Places
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 pt-12 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-gray-600">Personally Verified</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">Weather Updates</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">5+</div>
                  <div className="text-sm text-gray-600">Years Local</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">Free</div>
                  <div className="text-sm text-gray-600">Forever</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}