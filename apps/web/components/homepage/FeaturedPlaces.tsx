'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, RefreshCw, ArrowRight } from 'lucide-react'
import { useFeaturedPlaces } from '@/hooks/useFeaturedPlaces'
import { Container } from '@/components/layout/Container'

import type { Place } from '@/lib/validations'

function PlaceCard({ place }: { place: Place }) {
  return (
    <Link 
      href={`/places/${place.id}`}
      className="group bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      {/* Place Image */}
      <div className="relative aspect-video overflow-hidden bg-neutral-100">
        {place.primary_image ? (
          <Image
            src={place.primary_image}
            alt={place.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Place Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-accent fill-current" />
            <span className="text-neutral-600 font-medium">{place.rating}</span>
          </div>
        </div>

        <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
          {place.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <MapPin className="w-3 h-3" />
            <span>{place.category || 'Place'}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-primary font-medium">
            <span>Explore</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function FeaturedPlacesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden animate-pulse">
          <div className="aspect-video bg-neutral-200" />
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <div className="h-5 bg-neutral-200 rounded w-2/3" />
              <div className="h-5 bg-neutral-200 rounded w-12" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-full" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-neutral-200 rounded w-16" />
              <div className="h-3 bg-neutral-200 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FeaturedPlacesError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
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
  )
}

export function FeaturedPlaces() {
  const { places, isLoading, error, refetch } = useFeaturedPlaces()

  return (
    <section className="py-16 bg-neutral-50">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Discoveries
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Handpicked places that showcase the best of Indiranagar. Each location has been personally explored and curated for your discovery journey.
          </p>
        </div>

        {/* Featured Places Content */}
        {isLoading && <FeaturedPlacesSkeleton />}
        
        {error && <FeaturedPlacesError error={error} onRetry={refetch} />}
        
        {!isLoading && !error && places.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}

        {!isLoading && !error && places.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No featured places yet
            </h3>
            <p className="text-sm text-neutral-600">
              Check back soon for handpicked discoveries!
            </p>
          </div>
        )}

        {/* View All Link */}
        {!isLoading && !error && places.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/places"
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
            >
              View All Places
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </Container>
    </section>
  )
}