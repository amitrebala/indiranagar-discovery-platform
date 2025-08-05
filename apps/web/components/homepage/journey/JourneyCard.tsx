'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Sparkles, Map, Compass, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Journey } from '@/lib/supabase/types'

interface JourneyCardProps {
  journey: Journey
  onSelect: (journey: Journey) => void
}

const iconMap: Record<string, typeof Map> = {
  map: Map,
  compass: Compass,
  home: Home
}

export function JourneyCard({ journey, onSelect }: JourneyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const Icon = iconMap[journey.icon] || Map
  
  const handleClick = async () => {
    setIsLoading(true)
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Call onSelect callback
    onSelect(journey)
    
    // Navigate to map with journey
    router.push(`/map?journey=${journey.id}`)
  }
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={handleClick}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${journey.gradient}`} />
      
      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <Icon size={24} />
          </motion.div>
          {journey.estimated_time && (
            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
              <Clock size={14} />
              {journey.estimated_time}
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{journey.title}</h3>
        <p className="text-white/80 mb-4">{journey.description}</p>
        
        {/* Vibe Tags */}
        {journey.vibe_tags && journey.vibe_tags.length > 0 && (
          <motion.div 
            className="flex gap-2 flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {journey.vibe_tags.map((vibe) => (
              <span
                key={vibe}
                className="text-xs px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm"
              >
                {vibe}
              </span>
            ))}
          </motion.div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Sparkles className="animate-spin text-white" size={32} />
          </motion.div>
        )}
        
        {/* Hover indicator */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{ x: isHovered ? 5 : 0 }}
        >
          <MapPin className="text-white/60" size={20} />
        </motion.div>
      </div>
    </motion.div>
  )
}