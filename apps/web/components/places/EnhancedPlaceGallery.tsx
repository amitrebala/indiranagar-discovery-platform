'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Calendar } from 'lucide-react'
import { PlaceImageCategory, EnhancedPlaceImage, ImageStoryConnection } from '@/lib/types/memory-palace'

interface EnhancedPlaceGalleryProps {
  categories: PlaceImageCategory[];
  placeName: string;
  onClose: () => void;
}

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

function ProgressiveImage({ src, alt, className, onClick, priority = false }: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="skeleton-screen bg-gray-200 animate-pulse w-full h-full absolute inset-0 rounded" />
      )}
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
          onLoad={() => setIsLoaded(true)}
          onClick={onClick}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      )}
    </div>
  )
}

interface InteractivePhotoCaptionProps {
  image: EnhancedPlaceImage;
  onStoryClick: (story: ImageStoryConnection) => void;
}

function InteractivePhotoCaption({ image, onStoryClick }: InteractivePhotoCaptionProps) {
  const [showStories, setShowStories] = useState(false)

  return (
    <div className="photo-caption-container">
      <div className="relative">
        <ProgressiveImage 
          src={image.url} 
          alt={image.alt_text} 
          className="w-full h-64 rounded-lg"
          priority
        />
        
        {/* Story Hotspots */}
        {image.story_connections.map((story, index) => (
          <button
            key={story.id}
            className="story-hotspot absolute w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow-lg hover:bg-yellow-500 transition-colors animate-pulse"
            style={{ 
              left: story.x_position, 
              top: story.y_position 
            }}
            onClick={() => onStoryClick(story)}
            aria-label={`Story: ${story.title}`}
          >
            <span className="text-xs font-bold text-white">i</span>
          </button>
        ))}

        {/* Story Count Badge */}
        {image.story_connections.length > 0 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
            {image.story_connections.length} {image.story_connections.length === 1 ? 'story' : 'stories'}
          </div>
        )}
      </div>
      
      {/* Caption */}
      <div className="caption-content mt-3">
        <p className="text-sm text-gray-700 leading-relaxed">{image.caption}</p>
        
        {image.photographer_notes && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <Camera className="w-3 h-3 inline mr-1" />
            <strong>Photographer's note:</strong> {image.photographer_notes}
          </div>
        )}

        {image.technical_details && (
          <div className="mt-2 text-xs text-gray-500">
            {image.technical_details.best_viewing_time && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Best time: {image.technical_details.best_viewing_time}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EnhancedPlaceGallery({ categories, placeName, onClose }: EnhancedPlaceGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedStory, setSelectedStory] = useState<ImageStoryConnection | null>(null)

  const currentCategory = categories[selectedCategory]
  const allImages = categories.flatMap(cat => cat.images)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ambiance':
        return '🌅'
      case 'food':
        return '🍽️'
      case 'features':
        return '⭐'
      case 'exterior':
        return '🏢'
      case 'people':
        return '👥'
      default:
        return '📸'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ambiance':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'food':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'features':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'exterior':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'people':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const openLightbox = (imageIndex: number) => {
    setSelectedImage(imageIndex)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setSelectedStory(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % currentCategory.images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? currentCategory.images.length - 1 : selectedImage - 1)
    }
  }

  const handleStoryClick = (story: ImageStoryConnection) => {
    setSelectedStory(story)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <h2 className="text-xl font-bold text-gray-900">
          {placeName} Gallery
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto bg-white border-b px-4 py-2">
        {categories.map((category, index) => (
          <button
            key={category.category}
            onClick={() => setSelectedCategory(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg mr-2 whitespace-nowrap font-medium transition-all ${
              selectedCategory === index
                ? getCategoryColor(category.category)
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{getCategoryIcon(category.category)}</span>
            <span className="capitalize">{category.category}</span>
            <span className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded-full">
              {category.images.length}
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        {currentCategory.description && (
          <p className="text-gray-600 mb-4 text-center">
            {currentCategory.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentCategory.images.map((image, index) => (
            <div key={image.id} className="group">
              <InteractivePhotoCaption
                image={image}
                onStoryClick={handleStoryClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-60 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl max-h-full p-8">
            <div className="relative max-h-full">
              <Image
                src={currentCategory.images[selectedImage].url}
                alt={currentCategory.images[selectedImage].alt_text}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            <div className="text-white mt-4 text-center">
              <p className="text-lg mb-2">
                {currentCategory.images[selectedImage].caption}
              </p>
              <p className="text-sm text-gray-300">
                {selectedImage + 1} of {currentCategory.images.length} in {currentCategory.category}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{selectedStory.title}</h3>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {selectedStory.narrative}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {selectedStory.date}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}