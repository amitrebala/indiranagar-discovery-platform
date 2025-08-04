'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Download, Share2, Info } from 'lucide-react'
import { PlaceImage } from '@/lib/validations'

interface MobileOptimizedGalleryProps {
  images: PlaceImage[]
  placeName: string
  onClose: () => void
  initialIndex?: number
}

interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isDragging: boolean
  startTime: number
}

export default function MobileOptimizedGallery({ 
  images, 
  placeName, 
  onClose,
  initialIndex = 0 
}: MobileOptimizedGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [showInfo, setShowInfo] = useState(false)
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(images.length).fill(false))
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    startTime: 0
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentImage = images[currentIndex]
  
  // Preload adjacent images
  useEffect(() => {
    const preloadImages = [
      currentIndex - 1,
      currentIndex,
      currentIndex + 1
    ].filter(index => index >= 0 && index < images.length)

    preloadImages.forEach(index => {
      if (!imageLoaded[index]) {
        const img = new window.Image()
        img.onload = () => {
          setImageLoaded(prev => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }
        img.src = images[index].storage_path
      }
    })
  }, [currentIndex, images, imageLoaded])

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: true,
      startTime: Date.now()
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState.isDragging) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - swipeState.startX
    const deltaY = touch.clientY - swipeState.startY
    
    // Prevent vertical scroll if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault()
    }
    
    setSwipeState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY
    }))
    
    // Apply transform to container for visual feedback
    if (containerRef.current) {
      const offset = deltaX / 3 // Damping effect
      containerRef.current.style.transform = `translateX(${offset}px)`
    }
  }

  const handleTouchEnd = () => {
    if (!swipeState.isDragging) return
    
    const deltaX = swipeState.currentX - swipeState.startX
    const deltaY = swipeState.currentY - swipeState.startY
    const deltaTime = Date.now() - swipeState.startTime
    const velocity = Math.abs(deltaX) / deltaTime
    
    // Reset transform
    if (containerRef.current) {
      containerRef.current.style.transform = 'translateX(0)'
    }
    
    // Determine if it's a swipe (horizontal movement > vertical movement and sufficient distance/velocity)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && 
                             (Math.abs(deltaX) > 50 || velocity > 0.3)
    
    if (isHorizontalSwipe) {
      if (deltaX > 0 && currentIndex > 0) {
        // Swipe right - previous image
        setCurrentIndex(currentIndex - 1)
      } else if (deltaX < 0 && currentIndex < images.length - 1) {
        // Swipe left - next image
        setCurrentIndex(currentIndex + 1)
      }
    }
    
    setSwipeState(prev => ({ ...prev, isDragging: false }))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
          break
        case 'ArrowRight':
          if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1)
          break
        case 'Escape':
          onClose()
          break
        case 'i':
        case 'I':
          setShowInfo(!showInfo)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex, images.length, onClose, showInfo])

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${placeName} - Photo ${currentIndex + 1}`,
          text: currentImage.caption || `Beautiful photo from ${placeName}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share failed', error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-white">
            <h3 className="font-medium line-clamp-1">{placeName}</h3>
            <p className="text-sm text-white/70">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full max-w-full max-h-full">
            {!imageLoaded[currentIndex] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <Image
              src={currentImage.storage_path}
              alt={currentImage.caption || `${placeName} photo ${currentIndex + 1}`}
              fill
              className={`object-contain transition-opacity duration-300 ${
                imageLoaded[currentIndex] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => {
                setImageLoaded(prev => {
                  const newState = [...prev]
                  newState[currentIndex] = true
                  return newState
                })
              }}
              priority
              sizes="100vw"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {currentIndex < images.length - 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Swipe Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Image Info Panel */}
      {showInfo && currentImage.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 transform transition-transform duration-300">
          <p className="text-white text-sm leading-relaxed">
            {currentImage.caption}
          </p>
        </div>
      )}

      {/* Thumbnail Strip (for tablets/larger screens) */}
      <div className="hidden sm:block bg-black/80 p-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'ring-2 ring-white scale-110' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.storage_path}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Gesture Hint */}
      {images.length > 1 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-white/30 text-xs text-center">
            ← Swipe to navigate →
          </div>
        </div>
      )}
    </div>
  )
}