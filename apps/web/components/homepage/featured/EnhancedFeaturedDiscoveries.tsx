'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, RefreshCw, ArrowRight, Filter, Grid3x3, Play, Sparkles, Utensils } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFeaturedPlaces } from '@/hooks/useFeaturedPlaces'
import { useTimeOfDay } from '@/hooks/useTimeOfDay'
import { useWeather } from '@/hooks/useWeather'
import { Container } from '@/components/layout/Container'
import { GradientMesh } from '@/components/ui/GradientMesh'
import { FloatingOrbs } from '@/components/ui/FloatingOrbs'
import { GradientText } from '@/components/ui/GradientText'
import { EnhancedDiscoveryCard } from './EnhancedDiscoveryCard'
import { DiscoveryFilters } from './DiscoveryFilters'
import { DiscoveryCarousel } from './DiscoveryCarousel'
import { QuickViewModal } from './QuickViewModal'
import { useFeaturedDiscoveriesStore } from '@/stores/featuredDiscoveries'

import type { EnhancedPlaceData } from '@/lib/types/enhanced-place'

export function EnhancedFeaturedDiscoveries() {
  const { places: rawPlaces, isLoading, error, refetch } = useFeaturedPlaces()
  const { timeOfDay } = useTimeOfDay()
  const { weather } = useWeather()
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid')
  
  const {
    places,
    filteredPlaces,
    currentFilter,
    quickViewPlace,
    setPlaces,
    setFilter,
    openQuickView,
    closeQuickView
  } = useFeaturedDiscoveriesStore()

  // Transform raw places to enhanced format
  useEffect(() => {
    if (rawPlaces && rawPlaces.length > 0) {
      // Don't duplicate - just use what we have
      const enhanced = rawPlaces.map((place, idx) => {
        // Determine some tags based on category
        const categoryTags = place.category === 'Cafe' ? ['WiFi', 'Coffee', 'Cozy'] :
                           place.category === 'Restaurant' ? ['Dining', 'Cuisine', 'Ambiance'] :
                           place.category === 'Bar' ? ['Drinks', 'Nightlife', 'Social'] :
                           place.category === 'Shopping' ? ['Retail', 'Browse', 'Local'] :
                           place.category === 'Activity' ? ['Experience', 'Fun', 'Explore'] :
                           ['Discover', 'Visit', 'Local']
        
        return {
          ...place,
          images: [], // No images needed for icon-based design
          quick_tags: categoryTags.slice(0, 3),
          weather_suitable: {
            sunny: place.weather_suitability?.includes('sunny') ?? true,
            rainy: place.weather_suitability?.includes('rainy') ?? false,
            evening: place.best_time_to_visit?.includes('evening') ?? true
          },
          visitor_metrics: {
            daily_average: Math.floor(Math.random() * 300) + 150,
            peak_hours: ['12:00 PM', '7:00 PM'],
            current_status: (['quiet', 'moderate', 'busy'] as const)[idx % 3]
          }
        } as EnhancedPlaceData
      })
      
      setPlaces(enhanced)
    }
  }, [rawPlaces, setPlaces])

  // Smart sorting based on time and weather
  const smartSortedPlaces = [...filteredPlaces].sort((a, b) => {
    // Time-based priority
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) {
      // Morning: prioritize cafes
      if (a.category === 'Cafe' && b.category !== 'Cafe') return -1
      if (b.category === 'Cafe' && a.category !== 'Cafe') return 1
    } else if (hour >= 17 && hour < 22) {
      // Evening: prioritize bars and restaurants
      if ((a.category === 'Bar' || a.category === 'Restaurant') && 
          !(b.category === 'Bar' || b.category === 'Restaurant')) return -1
      if ((b.category === 'Bar' || b.category === 'Restaurant') && 
          !(a.category === 'Bar' || a.category === 'Restaurant')) return 1
    }
    
    // Weather-based priority
    if (weather?.condition === 'rainy') {
      if (a.weather_suitable?.rainy && !b.weather_suitable?.rainy) return -1
      if (b.weather_suitable?.rainy && !a.weather_suitable?.rainy) return 1
    }
    
    return b.rating - a.rating // Default to rating
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (isLoading) {
    return <FeaturedDiscoveriesSkeleton />
  }

  if (error) {
    return <FeaturedDiscoveriesError error={error} onRetry={refetch} />
  }

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Dynamic Background System */}
      <div className="absolute inset-0 -z-10">
        <GradientMesh 
          timeOfDay={timeOfDay} 
          weather={(weather?.condition === 'partly-cloudy' ? 'cloudy' : weather?.condition) || 'sunny'}
          enableParallax
        />
        <FloatingOrbs className="opacity-20" />
        {/* Noise overlay for texture */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container>
        {/* Enhanced Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">
            <GradientText
              gradient="hero"
              className="text-4xl md:text-5xl font-bold"
            >
              Featured Discoveries
            </GradientText>
          </h2>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto mb-6">
            Handpicked places that showcase the best of Indiranagar. Each location has been personally explored and curated for your discovery journey.
          </p>
          
          {/* Foodie Adventure CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex justify-center"
          >
            <Link
              href="/foodie-adventure"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              <Utensils className="w-5 h-5" />
              <span>Create Your Foodie Adventure</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* View Mode Toggle & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <DiscoveryFilters 
            currentFilter={currentFilter} 
            onFilterChange={setFilter}
            placeCounts={{
              all: places.length,
              restaurants: places.filter(p => p.category === 'Restaurant').length,
              cafes: places.filter(p => p.category === 'Cafe').length,
              bars: places.filter(p => p.category === 'Bar').length,
              shopping: places.filter(p => p.category === 'Shopping').length,
              activities: places.filter(p => p.category === 'Activity').length
            }}
          />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'bg-white/80 text-neutral-700 hover:bg-white'
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'carousel' 
                  ? 'bg-primary text-white' 
                  : 'bg-white/80 text-neutral-700 hover:bg-white'
              }`}
              aria-label="Carousel view"
            >
              <Play size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {smartSortedPlaces.map((place, index) => (
                <EnhancedDiscoveryCard
                  key={place.id}
                  place={place}
                  index={index}
                  onQuickView={() => openQuickView(place)}
                />
              ))}
              
              {/* Foodie Adventure Card - Integrated within grid */}
              {smartSortedPlaces.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative group"
                >
                  <Link
                    href="/foodie-adventure"
                    className="block h-full bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/50"
                  >
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                      <div className="mb-4 p-4 bg-white/80 rounded-full">
                        <Utensils className="w-12 h-12 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        Create a Foodie Adventure
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Generate personalized food challenges and crawls through Indiranagar
                      </p>
                      <div className="flex items-center gap-2 text-orange-500 font-semibold">
                        <span>Start Adventure</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <Sparkles className="absolute top-4 right-4 w-6 h-6 text-pink-400 animate-pulse" />
                    </div>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <DiscoveryCarousel
              key="carousel"
              places={smartSortedPlaces}
              onQuickView={openQuickView}
            />
          )}
        </AnimatePresence>

        {/* Empty State */}
        {smartSortedPlaces.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No places found
            </h3>
            <p className="text-sm text-neutral-600">
              Try adjusting your filters or check back soon!
            </p>
          </motion.div>
        )}

        {/* View All Link */}
        {smartSortedPlaces.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              href="/places"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/20 text-primary rounded-lg hover:bg-white transition-all font-medium shadow-lg hover:shadow-xl"
            >
              View All Places
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </Container>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewPlace && (
          <QuickViewModal
            place={quickViewPlace}
            onClose={closeQuickView}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function FeaturedDiscoveriesSkeleton() {
  return (
    <section className="py-16 bg-neutral-50">
      <Container>
        <div className="text-center mb-12">
          <div className="h-10 bg-neutral-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-neutral-200 rounded-lg w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden animate-pulse">
              <div className="aspect-video bg-neutral-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-neutral-200 rounded w-2/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function FeaturedDiscoveriesError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <section className="py-16 bg-neutral-50">
      <Container>
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Unable to load featured places
          </h3>
          <p className="text-sm text-neutral-600 mb-4 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </Container>
    </section>
  )
}