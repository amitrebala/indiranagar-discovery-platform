'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, MapPin, Star, Clock, Users, Navigation, 
  Heart, Share2, Coffee, Utensils, Wine, 
  ShoppingBag, Activity, Calendar, Wifi, Car, Globe
} from 'lucide-react'
import type { EnhancedPlaceData } from '@/lib/types/enhanced-place'

interface QuickViewModalProps {
  place: EnhancedPlaceData
  onClose: () => void
}

export function QuickViewModal({ place, onClose }: QuickViewModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleShare = async () => {
    const url = `${window.location.origin}/places/${place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: place.description,
          url
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const handleNavigate = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`
    window.open(mapsUrl, '_blank')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-black transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          </button>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Visual Design Section */}
            <div className="relative lg:w-3/5 h-[40vh] lg:h-auto">
              <div className={`w-full h-full flex items-center justify-center ${
                place.category === 'Cafe' ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500' :
                place.category === 'Restaurant' ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600' :
                place.category === 'Bar' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500' :
                place.category === 'Shopping' ? 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600' :
                place.category === 'Activity' ? 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500' :
                'bg-gradient-to-br from-slate-400 via-gray-500 to-zinc-600'
              }`}>
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }} />
                </div>
                
                {/* Large Category Icon */}
                <div className="relative z-10">
                  {place.category === 'Cafe' ? (
                    <Coffee className="w-32 h-32 text-white/40" strokeWidth={1} />
                  ) : place.category === 'Restaurant' ? (
                    <Utensils className="w-32 h-32 text-white/40" strokeWidth={1} />
                  ) : place.category === 'Bar' ? (
                    <Wine className="w-32 h-32 text-white/40" strokeWidth={1} />
                  ) : place.category === 'Shopping' ? (
                    <ShoppingBag className="w-32 h-32 text-white/40" strokeWidth={1} />
                  ) : place.category === 'Activity' ? (
                    <Activity className="w-32 h-32 text-white/40" strokeWidth={1} />
                  ) : (
                    <MapPin className="w-32 h-32 text-white/40" strokeWidth={1} />
                  )}
                </div>
                
                {/* Category Label */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold">
                    {place.category || 'Discovery'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-2/5 overflow-y-auto">
              <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                      {place.name}
                    </h2>
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                        {place.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{place.category || 'Place'}</span>
                    {place.visitor_metrics && (
                      <>
                        <span className="text-neutral-400">•</span>
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {place.visitor_metrics.current_status}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {place.description}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {place.best_time_to_visit && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {place.best_time_to_visit}
                      </span>
                    </div>
                  )}
                  
                  {place.visitor_metrics && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        ~{place.visitor_metrics.daily_average} daily visitors
                      </span>
                    </div>
                  )}
                  
                  {place.accessibility_info && (
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {place.accessibility_info}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {place.quick_tags && place.quick_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {place.quick_tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Weather Suitability */}
                {place.weather_suitable && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Best for: 
                      {place.weather_suitable.sunny && ' ☀️ Sunny days'}
                      {place.weather_suitable.rainy && ' 🌧️ Rainy days'}
                      {place.weather_suitable.evening && ' 🌙 Evenings'}
                    </span>
                  </div>
                )}

                {/* Companion Places */}
                {place.companion_places && place.companion_places.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Nearby Recommendations
                    </h3>
                    <div className="space-y-2">
                      {place.companion_places.map((companion, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {companion.name}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {companion.distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={handleNavigate}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </button>
                  
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorited 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                    aria-label="Add to favorites"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-3 bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* View Full Details Link */}
                <Link
                  href={`/places/${place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="block text-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}