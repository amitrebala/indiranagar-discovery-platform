'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, Users, Wifi, Heart, Share2, Eye, Coffee, Utensils, Wine, ShoppingBag, Activity, Store, TreePine, Music, Camera, Palette } from 'lucide-react'
import { ActivityIndicator } from './ActivityIndicator'
import { usePlaceImage } from '@/hooks/usePlaceImage'
import type { EnhancedPlaceData } from '@/lib/types/enhanced-place'

interface EnhancedDiscoveryCardProps {
  place: EnhancedPlaceData
  index: number
  onQuickView: () => void
}

export function EnhancedDiscoveryCard({ place, index, onQuickView }: EnhancedDiscoveryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  
  // Load Google Maps photo for this place
  const { imageUrl, status: imageStatus, attribution, isFromCache } = usePlaceImage(place)

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
      // Could add a toast notification here
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    // Could integrate with a favorites store/API here
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView()
  }

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: 'easeOut'
      }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glass morphism card container */}
      <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-200">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
        
        {/* Visual Section with Google Maps Photo */}
        <Link 
          href={`/places/${place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="block relative aspect-[4/3] overflow-hidden"
        >
          <div className="relative w-full h-full">
            {/* Photo or fallback */}
            {imageUrl && imageStatus === 'success' ? (
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={place.name}
                  fill
                  className={`object-cover transition-transform duration-300 ease-out ${
                    isHovered ? 'scale-105' : 'scale-100'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3} // Prioritize loading for first 3 cards
                />
                {/* Google attribution overlay if from Google Places */}
                {attribution?.source === 'Google Places' && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white/80">
                    Google
                  </div>
                )}
              </div>
            ) : (
              /* Fallback gradient while loading or if no image */
              <div className={`absolute inset-0 transition-transform duration-300 ease-out ${
                isHovered ? 'scale-105' : 'scale-100'
              } ${
                place.category === 'Cafe' ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500' :
                place.category === 'Restaurant' ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600' :
                place.category === 'Bar' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500' :
                place.category === 'Shopping' ? 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600' :
                place.category === 'Activity' ? 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500' :
                'bg-gradient-to-br from-slate-400 via-gray-500 to-zinc-600'
              }`}>
                {/* Category Icon as fallback */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {place.category === 'Cafe' ? (
                    <Coffee className="w-20 h-20 text-white/30" strokeWidth={1} />
                  ) : place.category === 'Restaurant' ? (
                    <Utensils className="w-20 h-20 text-white/30" strokeWidth={1} />
                  ) : place.category === 'Bar' ? (
                    <Wine className="w-20 h-20 text-white/30" strokeWidth={1} />
                  ) : place.category === 'Shopping' ? (
                    <ShoppingBag className="w-20 h-20 text-white/30" strokeWidth={1} />
                  ) : place.category === 'Activity' ? (
                    <Activity className="w-20 h-20 text-white/30" strokeWidth={1} />
                  ) : (
                    <MapPin className="w-20 h-20 text-white/30" strokeWidth={1} />
                  )}
                </div>
                {/* Loading indicator */}
                {imageStatus === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                  </div>
                )}
              </div>
            )}
            
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Activity Indicator */}
            <div className="absolute top-4 left-4">
              <ActivityIndicator status={place.visitor_metrics?.current_status} />
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={handleFavorite}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-150"
                aria-label="Add to favorites"
              >
                <Heart 
                  size={16} 
                  className={isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-700'}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={handleShare}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-150"
                aria-label="Share place"
              >
                <Share2 size={16} className="text-neutral-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={handleQuickView}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-150"
                aria-label="Quick view"
              >
                <Eye size={16} className="text-neutral-700" />
              </motion.button>
            </div>
            
            {/* Rating Badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-neutral-900">{place.rating}</span>
            </div>
          </div>
        </Link>
        
        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Title and Category */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1 group-hover:text-primary transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3 text-neutral-500" />
              <span className="text-sm text-neutral-600">{place.category || 'Place'}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-neutral-600 line-clamp-2">
            {place.description}
          </p>
          
          {/* Category Features */}
          <div className="flex flex-wrap gap-2">
            {place.category && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                place.category === 'Cafe' ? 'bg-amber-100 text-amber-700' :
                place.category === 'Restaurant' ? 'bg-emerald-100 text-emerald-700' :
                place.category === 'Bar' ? 'bg-purple-100 text-purple-700' :
                place.category === 'Shopping' ? 'bg-blue-100 text-blue-700' :
                place.category === 'Activity' ? 'bg-rose-100 text-rose-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {place.category === 'Cafe' && <Coffee className="w-3 h-3" />}
                {place.category === 'Restaurant' && <Utensils className="w-3 h-3" />}
                {place.category === 'Bar' && <Wine className="w-3 h-3" />}
                {place.category === 'Shopping' && <ShoppingBag className="w-3 h-3" />}
                {place.category === 'Activity' && <Activity className="w-3 h-3" />}
                {!['Cafe', 'Restaurant', 'Bar', 'Shopping', 'Activity'].includes(place.category || '') && <MapPin className="w-3 h-3" />}
                {place.category}
              </div>
            )}
            {place.best_time_to_visit && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                <Clock className="w-3 h-3" />
                {place.best_time_to_visit}
              </div>
            )}
          </div>
          
          {/* Quick Tags */}
          {place.quick_tags && place.quick_tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {place.quick_tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-700 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
              {place.visitor_metrics && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {place.visitor_metrics.daily_average} daily
                </span>
              )}
            </div>
          )}
          
          {/* Footer Info */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              {place.weather_suitable?.sunny && (
                <span className="flex items-center gap-1">☀️ Sunny</span>
              )}
              {place.weather_suitable?.rainy && (
                <span className="flex items-center gap-1">🌧️ Rainy</span>
              )}
              {place.best_time_to_visit && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {place.best_time_to_visit}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}