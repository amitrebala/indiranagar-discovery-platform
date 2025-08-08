'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MiniGalleryProps {
  images: string[]
  onImageClick?: (index: number) => void
  activeIndex?: number
}

export function MiniGallery({ images, onImageClick, activeIndex = 0 }: MiniGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({})
  
  // For mobile swipe support
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const displayImages = images.slice(0, 4)
  const hasMoreImages = images.length > 4

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentIndex < displayImages.length - 1) {
      handleImageClick(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      handleImageClick(currentIndex - 1)
    }
  }

  const handleImageClick = (index: number) => {
    setCurrentIndex(index)
    onImageClick?.(index)
  }

  if (!images || images.length === 0) return null

  return (
    <div className="space-y-2">
      {/* Thumbnail Grid */}
      <div 
        className="grid grid-cols-4 gap-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {displayImages.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => handleImageClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative aspect-square rounded-lg overflow-hidden bg-neutral-100
              ring-2 transition-all duration-200
              ${activeIndex === index 
                ? 'ring-primary ring-offset-2' 
                : 'ring-transparent hover:ring-primary/50'
              }
            `}
          >
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              onLoadingComplete={() => 
                setIsLoading(prev => ({ ...prev, [index]: false }))
              }
              onLoadStart={() => 
                setIsLoading(prev => ({ ...prev, [index]: true }))
              }
            />
            
            {/* Loading shimmer */}
            <AnimatePresence>
              {isLoading[index] && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer"
                />
              )}
            </AnimatePresence>
            
            {/* More images indicator */}
            {index === 3 && hasMoreImages && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  +{images.length - 4}
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Mobile Navigation Dots */}
      {displayImages.length > 1 && (
        <div className="flex justify-center gap-1 sm:hidden">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-200
                ${activeIndex === index 
                  ? 'bg-primary w-4' 
                  : 'bg-neutral-300 hover:bg-neutral-400'
                }
              `}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}