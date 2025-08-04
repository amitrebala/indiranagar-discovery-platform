'use client'

import { useState, useRef, useEffect, forwardRef } from 'react'
import Image, { ImageProps } from 'next/image'
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization'

interface OptimizedImageProps extends Omit<ImageProps, 'quality' | 'loading' | 'priority'> {
  priority?: 'high' | 'medium' | 'low'
  isAboveFold?: boolean
  errorFallback?: string | React.ReactNode
  onLoadComplete?: () => void
  onError?: () => void
  showLoadingPlaceholder?: boolean
  adaptiveQuality?: boolean
}

interface ImageLoadingState {
  isLoading: boolean
  hasError: boolean
  hasLoaded: boolean
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  priority = 'medium',
  isAboveFold = false,
  errorFallback,
  onLoadComplete,
  onError,
  showLoadingPlaceholder = true,
  adaptiveQuality = true,
  className = '',
  style,
  ...props
}, ref) => {
  const {
    optimizationSettings,
    getImageDimensions,
    getLoadingStrategy,
    shouldPreload,
    isSlowConnection,
    networkCondition
  } = useNetworkOptimization()

  const [loadingState, setLoadingState] = useState<ImageLoadingState>({
    isLoading: true,
    hasError: false,
    hasLoaded: false
  })

  const [currentSrc, setCurrentSrc] = useState<string>(typeof src === 'string' ? src : (src as any).src || (src as any).default || '')
  const [retryCount, setRetryCount] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const intersectionRef = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(isAboveFold)

  // Calculate optimized dimensions
  const optimizedDimensions = getImageDimensions(
    typeof width === 'number' ? width : 800,
    typeof height === 'number' ? height : 600
  )

  // Determine quality based on network conditions
  const imageQuality = adaptiveQuality ? optimizationSettings.imageQuality : 90

  // Determine loading strategy
  const loadingStrategy = getLoadingStrategy(isAboveFold, priority)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!optimizationSettings.enableLazyLoading || isAboveFold) {
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: isSlowConnection ? '50px' : '100px', // Smaller margin for slow connections
        threshold: 0.1
      }
    )

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current)
    }

    return () => observer.disconnect()
  }, [optimizationSettings.enableLazyLoading, isAboveFold, isSlowConnection])

  // Handle image load events
  const handleLoadStart = () => {
    setLoadingState(prev => ({ ...prev, isLoading: true, hasError: false }))
  }

  const handleLoadComplete = () => {
    setLoadingState(prev => ({ ...prev, isLoading: false, hasLoaded: true }))
    onLoadComplete?.()
  }

  const handleError = () => {
    setLoadingState(prev => ({ ...prev, isLoading: false, hasError: true }))
    
    // Retry logic for failed loads
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setLoadingState(prev => ({ ...prev, hasError: false, isLoading: true }))
        
        // Try with lower quality on retry
        if (retryCount === 0 && adaptiveQuality) {
          // First retry: reduce quality
          setCurrentSrc(typeof src === 'string' ? src : (src as any).src || (src as any).default || '')
        } else if (retryCount === 1) {
          // Second retry: try different format or fallback
          setCurrentSrc('/images/placeholder-place.jpg')
        }
      }, 1000 * (retryCount + 1)) // Exponential backoff
    } else {
      onError?.()
    }
  }

  // Preload critical images
  useEffect(() => {
    const srcString = typeof src === 'string' ? src : (src as any).src || (src as any).default || ''
    if (shouldPreload(priority) && srcString) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = srcString
      
      // Add format hints for WebP
      if (optimizationSettings.enableWebP) {
        link.type = 'image/webp'
      }
      
      document.head.appendChild(link)
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      }
    }
  }, [src, priority, shouldPreload, optimizationSettings.enableWebP])

  // Loading placeholder component
  const LoadingPlaceholder = () => (
    <div
      className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
      style={{
        width: optimizedDimensions.width,
        height: optimizedDimensions.height,
        ...style
      }}
    >
      <svg
        className="w-8 h-8 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )

  // Error fallback component
  const ErrorFallback = () => {
    if (typeof errorFallback === 'string') {
      return (
        <Image
          src={errorFallback}
          alt={alt}
          width={optimizedDimensions.width}
          height={optimizedDimensions.height}
          className={className}
          style={style}
        />
      )
    }

    if (errorFallback) {
      return <>{errorFallback}</>
    }

    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
        style={{
          width: optimizedDimensions.width,
          height: optimizedDimensions.height,
          ...style
        }}
      >
        <div className="text-center text-gray-500">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-xs">Failed to load</p>
        </div>
      </div>
    )
  }

  // Show placeholder while not intersecting (for lazy loading)
  if (!isIntersecting) {
    return (
      <div ref={intersectionRef}>
        {showLoadingPlaceholder ? <LoadingPlaceholder /> : null}
      </div>
    )
  }

  // Show error state
  if (loadingState.hasError) {
    return <ErrorFallback />
  }

  // Show loading state
  if (loadingState.isLoading && showLoadingPlaceholder) {
    return (
      <div className="relative">
        <LoadingPlaceholder />
        <Image
          ref={ref}
          src={currentSrc}
          alt={alt}
          width={optimizedDimensions.width}
          height={optimizedDimensions.height}
          quality={imageQuality}
          loading={loadingStrategy}
          className={`absolute inset-0 opacity-0 ${className}`}
          style={style}
          onLoadStart={handleLoadStart}
          onLoad={handleLoadComplete}
          onError={handleError}
          {...props}
        />
      </div>
    )
  }

  // Main image component
  return (
    <Image
      ref={ref}
      src={currentSrc}
      alt={alt}
      width={optimizedDimensions.width}
      height={optimizedDimensions.height}
      quality={imageQuality}
      loading={loadingStrategy}
      className={`transition-opacity duration-300 ${
        loadingState.hasLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={style}
      onLoadStart={handleLoadStart}
      onLoad={handleLoadComplete}
      onError={handleError}
      {...props}
    />
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export { OptimizedImage }

// Utility function to generate responsive image sizes
export function generateResponsiveSizes(
  baseWidth: number,
  breakpoints: { [key: string]: number } = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  }
): string {
  const sizes = Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b)
    .map(([name, width]) => {
      const imageWidth = Math.min(baseWidth, width)
      return `(max-width: ${width}px) ${imageWidth}px`
    })
    .join(', ')
  
  return `${sizes}, ${baseWidth}px`
}

// Performance-optimized image gallery component
interface OptimizedImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    width?: number
    height?: number
  }>
  columns?: number
  gap?: string
  priority?: 'high' | 'medium' | 'low'
  className?: string
}

export function OptimizedImageGallery({
  images,
  columns = 3,
  gap = '1rem',
  priority = 'low',
  className = ''
}: OptimizedImageGalleryProps) {
  const { isSlowConnection } = useNetworkOptimization()
  
  // Reduce columns on slow connections
  const responsiveColumns = isSlowConnection ? Math.max(1, columns - 1) : columns

  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
        gap
      }}
    >
      {images.map((image, index) => (
        <OptimizedImage
          key={`${image.src}-${index}`}
          src={image.src}
          alt={image.alt}
          width={image.width || 400}
          height={image.height || 300}
          priority={index < responsiveColumns ? 'high' : priority}
          isAboveFold={index < responsiveColumns}
          className="w-full h-auto object-cover rounded-lg"
        />
      ))}
    </div>
  )
}