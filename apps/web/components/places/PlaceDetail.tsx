'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Star, Clock, CloudRain } from 'lucide-react'
import PhotoGallery from './PhotoGallery'
import CompanionActivityCard from './CompanionActivityCard'
import SocialShare from './SocialShare'
import ContactModal from './ContactModal'
import { Place, PlaceImage, CompanionActivity } from '@/lib/validations'
import { EnhancedPlace } from '@/lib/types/memory-palace'
import MemoryPalaceStory from './MemoryPalaceStory'
import PersonalReview from './PersonalReview'
import BusinessRelationships from './BusinessRelationships'
import SeasonalContext from './SeasonalContext'
import EnhancedPlaceGallery from './EnhancedPlaceGallery'

interface PlaceDetailProps {
  place: Place | EnhancedPlace
  images: PlaceImage[]
  activities: CompanionActivity[]
  enhanced?: boolean
}

export default function PlaceDetail({ place, images, activities, enhanced = false }: PlaceDetailProps) {
  const [showContactModal, setShowContactModal] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showEnhancedGallery, setShowEnhancedGallery] = useState(false)

  // Type guard to check if place is enhanced
  const isEnhancedPlace = (place: Place | EnhancedPlace): place is EnhancedPlace => {
    return enhanced && 'memory_palace_story' in place
  }

  const enhancedPlace = isEnhancedPlace(place) ? place : null

  // Separate activities by type
  const beforeActivities = activities.filter(a => a.activity_type === 'before')
  const afterActivities = activities.filter(a => a.activity_type === 'after')

  // Generate rating stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - Math.ceil(rating)

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-5 h-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-gray-300" />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/map"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Map</span>
          </Link>
          <SocialShare place={place} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-6">
            {place.primary_image ? (
              <Image
                src={place.primary_image}
                alt={place.name}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => enhancedPlace ? setShowEnhancedGallery(true) : setShowGallery(true)}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
            )}
            
            {/* Image count overlay */}
            {(images.length > 0 || (enhancedPlace?.image_gallery.length || 0) > 0) && (
              <div 
                className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                onClick={() => enhancedPlace ? setShowEnhancedGallery(true) : setShowGallery(true)}
              >
                +{enhancedPlace 
                  ? enhancedPlace.image_gallery.reduce((total, cat) => total + cat.images.length, 0)
                  : images.length
                } photos
              </div>
            )}
          </div>

          {/* Place Title and Rating */}
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {place.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              {renderStars(place.rating)}
              {place.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {place.category}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setShowContactModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              Call me for details
            </button>
            <Link
              href={`/map?highlight=${place.id}`}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <MapPin className="w-4 h-4" />
              View on Map
            </Link>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Place</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {place.description}
            </p>
          </div>
        </div>

        {/* Enhanced Content - Memory Palace Story */}
        {enhancedPlace && (
          <MemoryPalaceStory place={enhancedPlace} />
        )}

        {/* Enhanced Content - Personal Review */}
        {enhancedPlace && (
          <PersonalReview 
            review={enhancedPlace.personal_review} 
            placeName={enhancedPlace.name}
          />
        )}

        {/* Enhanced Content - Business Relationships */}
        {enhancedPlace && enhancedPlace.business_relationships.length > 0 && (
          <BusinessRelationships 
            connections={enhancedPlace.business_relationships}
            placeName={enhancedPlace.name}
          />
        )}

        {/* Enhanced Content - Seasonal Context */}
        {enhancedPlace && enhancedPlace.seasonal_notes.length > 0 && (
          <SeasonalContext 
            seasonalNotes={enhancedPlace.seasonal_notes}
            placeName={enhancedPlace.name}
          />
        )}

        {/* Before Activities */}
        {beforeActivities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Before You Go
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {beforeActivities.map((activity) => (
                <CompanionActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {/* After Activities */}
        {afterActivities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-green-600" />
              After Your Visit
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {afterActivities.map((activity) => (
                <CompanionActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {/* Weather Suitability */}
        {place.weather_suitability && place.weather_suitability.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CloudRain className="w-6 h-6 text-blue-600" />
              Best Weather Conditions
            </h2>
            <div className="flex flex-wrap gap-2">
              {place.weather_suitability.map((condition) => (
                <span
                  key={condition}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium capitalize"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {place.best_time_to_visit && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Best Time to Visit</h3>
              <p className="text-gray-700">{place.best_time_to_visit}</p>
            </div>
          )}
          {place.accessibility_info && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-700">{place.accessibility_info}</p>
            </div>
          )}
        </div>

        {/* Personal Touch */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
          <h3 className="font-bold text-gray-900 mb-2">Amit&apos;s Personal Note</h3>
          <p className="text-gray-700 mb-4">
            This place holds a special spot in my Indiranagar journey. Each recommendation comes from personal experience and countless hours exploring the neighborhood.
          </p>
          <button
            onClick={() => setShowContactModal(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Get personalized recommendations →
          </button>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {showGallery && !enhancedPlace && (
        <PhotoGallery
          images={images}
          placeName={place.name}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* Enhanced Photo Gallery Modal */}
      {showEnhancedGallery && enhancedPlace && (
        <EnhancedPlaceGallery
          categories={enhancedPlace.image_gallery}
          placeName={enhancedPlace.name}
          onClose={() => setShowEnhancedGallery(false)}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          place={place}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  )
}