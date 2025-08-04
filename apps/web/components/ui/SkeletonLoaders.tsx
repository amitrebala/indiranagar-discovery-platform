'use client'

import { MapPin, Star, Search, Map } from 'lucide-react'

// Base skeleton animations that respect reduced motion preferences
const skeletonClass = "animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%]"
const reducedMotionClass = "motion-reduce:animate-none motion-reduce:bg-neutral-200"

interface SkeletonProps {
  className?: string
}

// Individual skeleton components
export function SkeletonBox({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`${skeletonClass} ${reducedMotionClass} rounded ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`${skeletonClass} ${reducedMotionClass} rounded-sm h-4 ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonLine({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`${skeletonClass} ${reducedMotionClass} rounded-sm h-3 ${className}`}
      aria-hidden="true"
    />
  )
}

// Place Card Skeleton - Mobile and Desktop variants
interface PlaceCardSkeletonProps {
  compact?: boolean
  showDistance?: boolean
}

export function PlaceCardSkeleton({ compact = false, showDistance = false }: PlaceCardSkeletonProps) {
  if (compact) {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-neutral-200 p-3"
        role="status"
        aria-label="Loading place information"
      >
        <div className="flex gap-3">
          {/* Image skeleton */}
          <SkeletonBox className="w-16 h-16 flex-shrink-0 rounded-lg" />
          
          {/* Content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <SkeletonText className="flex-1 h-4" />
              <div className="flex items-center gap-1 ml-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-neutral-200" aria-hidden="true" />
                ))}
              </div>
            </div>
            
            {/* Category badge skeleton */}
            <SkeletonBox className="w-20 h-6 rounded-full mb-1" />
            
            {/* Description skeleton */}
            <div className="space-y-1">
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-3/4" />
            </div>

            {/* Distance skeleton */}
            {showDistance && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-neutral-200" aria-hidden="true" />
                <SkeletonLine className="w-16" />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden"
      role="status"
      aria-label="Loading place information"
    >
      {/* Image section skeleton */}
      <div className="relative h-48">
        <SkeletonBox className="w-full h-full" />
        
        {/* Overlay elements */}
        <div className="absolute top-3 right-3 flex gap-2">
          <SkeletonBox className="w-11 h-11 rounded-full" />
          <SkeletonBox className="w-11 h-11 rounded-full" />
        </div>
        
        <div className="absolute top-3 left-3">
          <SkeletonBox className="w-20 h-6 rounded-full" />
        </div>
        
        {showDistance && (
          <div className="absolute bottom-3 left-3">
            <SkeletonBox className="w-24 h-6 rounded-full" />
          </div>
        )}
      </div>

      {/* Content section skeleton */}
      <div className="p-4">
        {/* Title and rating */}
        <div className="flex items-start justify-between mb-2">
          <SkeletonText className="flex-1 h-6 mr-2" />
          <div className="flex items-center gap-1 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-neutral-200" aria-hidden="true" />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-3">
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-5/6" />
        </div>

        {/* Weather badges */}
        <div className="flex gap-1 mb-3">
          <SkeletonBox className="w-16 h-6 rounded-full" />
          <SkeletonBox className="w-20 h-6 rounded-full" />
          <SkeletonBox className="w-18 h-6 rounded-full" />
        </div>

        {/* Best time to visit */}
        <div className="flex items-center gap-1 mb-3">
          <div className="w-4 h-4 bg-neutral-200 rounded" aria-hidden="true" />
          <SkeletonLine className="w-32" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <SkeletonBox className="flex-1 h-11 rounded-lg" />
          <SkeletonBox className="flex-1 h-11 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Search Results Skeleton
interface SearchResultsSkeletonProps {
  count?: number
  compact?: boolean
}

export function SearchResultsSkeleton({ count = 6, compact = false }: SearchResultsSkeletonProps) {
  return (
    <div 
      className="space-y-4"
      role="status"
      aria-label="Loading search results"
    >
      {/* Search header skeleton */}
      <div className="flex items-center justify-between">
        <SkeletonText className="w-32 h-5" />
        <SkeletonText className="w-16 h-4" />
      </div>
      
      {/* Results grid/list */}
      <div className={compact ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {[...Array(count)].map((_, index) => (
          <PlaceCardSkeleton 
            key={index} 
            compact={compact} 
            showDistance={true}
          />
        ))}
      </div>
      
      {/* Load more skeleton */}
      <div className="flex justify-center pt-4">
        <SkeletonBox className="w-32 h-10 rounded-lg" />
      </div>
    </div>
  )
}

// Map Loading Skeleton
interface MapLoadingSkeletonProps {
  showControls?: boolean
  showStats?: boolean
}

export function MapLoadingSkeleton({ showControls = true, showStats = true }: MapLoadingSkeletonProps) {
  return (
    <div 
      className="absolute inset-0 bg-neutral-50 flex items-center justify-center z-10"
      role="status"
      aria-label="Loading interactive map"
    >
      {/* Main loading state */}
      <div className="text-center">
        <div className="relative mb-4">
          <Map className="w-16 h-16 text-primary-400 mx-auto" aria-hidden="true" />
          <div className="absolute inset-0 animate-ping">
            <Map className="w-16 h-16 text-primary-300 mx-auto opacity-75" aria-hidden="true" />
          </div>
        </div>
        <SkeletonText className="w-24 h-4 mx-auto mb-2" />
        <SkeletonLine className="w-32 h-3 mx-auto" />
      </div>

      {/* Map controls skeleton */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <SkeletonBox className="w-20 h-8 rounded-lg" />
          <SkeletonBox className="w-20 h-8 rounded-lg" />
          <SkeletonBox className="w-20 h-8 rounded-lg" />
          <SkeletonBox className="w-8 h-8 rounded-lg" />
        </div>
      )}

      {/* Map stats skeleton */}
      {showStats && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
          <div className="space-y-1">
            <SkeletonLine className="w-24 h-3" />
            <SkeletonLine className="w-32 h-3" />
          </div>
        </div>
      )}

      {/* Shimmer overlay for additional visual feedback */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer transform -skew-x-12" />
    </div>
  )
}

// Generic Content Skeleton for other components
interface ContentSkeletonProps {
  lines?: number
  showHeader?: boolean
  showActions?: boolean
}

export function ContentSkeleton({ lines = 3, showHeader = true, showActions = false }: ContentSkeletonProps) {
  return (
    <div 
      className="bg-white rounded-lg p-4 space-y-3"
      role="status"
      aria-label="Loading content"
    >
      {showHeader && (
        <div className="flex items-center justify-between">
          <SkeletonText className="w-1/3 h-6" />
          <SkeletonBox className="w-8 h-8 rounded" />
        </div>
      )}
      
      <div className="space-y-2">
        {[...Array(lines)].map((_, index) => (
          <SkeletonLine 
            key={index} 
            className={index === lines - 1 ? "w-2/3" : "w-full"} 
          />
        ))}
      </div>
      
      {showActions && (
        <div className="flex gap-2 pt-2">
          <SkeletonBox className="w-20 h-8 rounded" />
          <SkeletonBox className="w-16 h-8 rounded" />
        </div>
      )}
    </div>
  )
}

// Loading Dots Animation (for buttons and inline loading)
export function LoadingDots({ className = '' }: SkeletonProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-hidden="true">
      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

// Skeleton wrapper for suspense boundaries
interface SkeletonWrapperProps {
  isLoading: boolean
  skeleton: React.ReactNode
  children: React.ReactNode
}

export function SkeletonWrapper({ isLoading, skeleton, children }: SkeletonWrapperProps) {
  if (isLoading) {
    return <>{skeleton}</>
  }
  
  return <>{children}</>
}