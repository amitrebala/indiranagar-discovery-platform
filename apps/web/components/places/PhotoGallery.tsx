'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { PlaceImage } from '@/lib/validations'

interface PhotoGalleryProps {
  images: PlaceImage[]
  placeName: string
  onClose: () => void
}

export default function PhotoGallery({ images, placeName, onClose }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="Close gallery"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-4 z-60 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 z-60 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Main image */}
      <div 
        className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex]?.storage_path || ''}
            alt={images[currentIndex]?.caption || `${placeName} photo ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      </div>

      {/* Image info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
        <div className="max-w-5xl mx-auto">
          {images[currentIndex]?.caption && (
            <p className="text-lg mb-2">{images[currentIndex].caption}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300">
              {currentIndex + 1} of {images.length}
            </p>
            
            {/* Thumbnail navigation */}
            {images.length > 1 && (
              <div className="flex gap-2 max-w-md overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentIndex(index)
                    }}
                    className={`relative w-12 h-12 rounded overflow-hidden border-2 transition-colors flex-shrink-0 ${
                      index === currentIndex 
                        ? 'border-white' 
                        : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image.storage_path}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}