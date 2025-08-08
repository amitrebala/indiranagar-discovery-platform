'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { EnhancedDiscoveryCard } from './EnhancedDiscoveryCard'
import type { EnhancedPlaceData } from '@/lib/types/enhanced-place'

interface DiscoveryCarouselProps {
  places: EnhancedPlaceData[]
  onQuickView: (place: EnhancedPlaceData) => void
  autoRotateInterval?: number
}

export function DiscoveryCarousel({ 
  places, 
  onQuickView, 
  autoRotateInterval = 8000 
}: DiscoveryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Touch/swipe support
  const x = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate visible items based on screen size
  const [visibleItems, setVisibleItems] = useState(3)
  
  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1)
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2)
      } else {
        setVisibleItems(3)
      }
    }
    
    updateVisibleItems()
    window.addEventListener('resize', updateVisibleItems)
    return () => window.removeEventListener('resize', updateVisibleItems)
  }, [])

  // Auto-rotation logic
  useEffect(() => {
    const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % places.length)
    }
    
    if (isAutoRotating && !isPaused && !isDragging) {
      intervalRef.current = setInterval(nextSlide, autoRotateInterval)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex, isAutoRotating, isPaused, isDragging, autoRotateInterval, places.length])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % places.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + places.length) % places.length)
  }

  const handleDragEnd = () => {
    const draggedDistance = x.get()
    const threshold = 50

    if (draggedDistance > threshold) {
      handlePrev()
    } else if (draggedDistance < -threshold) {
      handleNext()
    }
    
    x.set(0)
    setIsDragging(false)
  }

  const getVisiblePlaces = () => {
    const visible = []
    for (let i = 0; i < visibleItems; i++) {
      const index = (currentIndex + i) % places.length
      visible.push(places[index])
    }
    return visible
  }

  if (!places || places.length === 0) return null

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden px-12">
        <motion.div
          ref={containerRef}
          className="flex gap-6"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x }}
        >
          <AnimatePresence mode="popLayout">
            {getVisiblePlaces().map((place, index) => (
              <motion.div
                key={`${place.id}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className={`flex-shrink-0 w-full ${
                  visibleItems === 1 ? '' : 
                  visibleItems === 2 ? 'md:w-1/2' : 
                  'lg:w-1/3'
                }`}
              >
                <EnhancedDiscoveryCard
                  place={place}
                  index={index}
                  onQuickView={() => onQuickView(place)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-neutral-700" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 z-10"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-neutral-700" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Dots */}
        <div className="flex gap-2">
          {places.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                transition-all duration-300
                ${index === currentIndex 
                  ? 'w-8 h-2 bg-primary rounded-full' 
                  : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400 rounded-full'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
          aria-label={isAutoRotating ? 'Pause carousel' : 'Play carousel'}
        >
          {isAutoRotating ? (
            <Pause className="w-4 h-4 text-neutral-700" />
          ) : (
            <Play className="w-4 h-4 text-neutral-700" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {isAutoRotating && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: autoRotateInterval / 1000, 
              ease: 'linear',
              repeat: Infinity
            }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  )
}