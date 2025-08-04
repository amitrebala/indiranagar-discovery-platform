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
      {/* Hero Section */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Hi, I'm Amit
              </h1>
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