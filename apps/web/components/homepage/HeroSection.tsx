'use client'

import Link from 'next/link'
import { MapPin, Navigation, Star, TrendingUp } from 'lucide-react'
import { Container } from '@/components/layout/Container'

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-neutral-50 to-primary/5">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 text-sm font-medium text-primary mb-6">
            <TrendingUp size={16} />
            166 Personally Visited Places
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Indiranagar
            <span className="text-primary block">with Amit</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-neutral-600 mb-8 leading-relaxed">
            Your personal guide to Bangalore&apos;s most vibrant neighborhood. 
            I&apos;ve explored every street, cafe, and hidden corner so you can discover 
            the authentic Indiranagar through trusted recommendations.
          </p>

          {/* Value Propositions */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personally Verified</h3>
              <p className="text-sm text-neutral-600">
                Every single place has been visited by me, with honest reviews and insider tips
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Curated Quality</h3>
              <p className="text-sm text-neutral-600">
                Handpicked recommendations based on real experiences, not generic listings
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                <Navigation className="w-6 h-6 text-accent/80" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Discovery</h3>
              <p className="text-sm text-neutral-600">
                Weather-aware recommendations and context-based suggestions for optimal experiences
              </p>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/map"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 ring-2 ring-primary/20 hover:ring-primary/40"
            >
              <Navigation size={24} />
              Start Exploring Map
            </Link>
            
            <Link
              href="/places"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-xl hover:from-secondary/90 hover:to-secondary/70 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 ring-2 ring-secondary/20 hover:ring-secondary/40"
            >
              <Star size={24} />
              Browse My Places
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">166</div>
                <div className="text-sm text-neutral-600">Places Visited</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary mb-1">15+</div>
                <div className="text-sm text-neutral-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent/80 mb-1">100%</div>
                <div className="text-sm text-neutral-600">Personally Verified</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">5+ Years</div>
                <div className="text-sm text-neutral-600">Living Here</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}