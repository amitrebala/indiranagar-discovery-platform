import { Place } from '@/lib/validations'

export type MarkerSize = 'small' | 'medium' | 'large'
export type PlaceCategory = 'restaurant' | 'cafe' | 'activity' | string

export interface MarkerStyleConfig {
  size: MarkerSize
  category: PlaceCategory
  isSelected: boolean
  isFeatured: boolean
  hasPhoto: boolean
}

// Marker size configurations
export const MARKER_SIZES = {
  small: {
    width: 36,
    height: 36,
    iconSize: 12,
    borderWidth: 2
  },
  medium: {
    width: 48,  
    height: 48,
    iconSize: 16,
    borderWidth: 2
  },
  large: {
    width: 64,
    height: 64,
    iconSize: 20,
    borderWidth: 3
  }
} as const

// Category color mappings
export const CATEGORY_COLORS = {
  restaurant: {
    border: '#EF4444', // red-500
    background: '#FEF2F2', // red-50
    text: '#DC2626' // red-600
  },
  cafe: {
    border: '#15803D', // green-700
    background: '#F0FDF4', // green-50
    text: '#16A34A' // green-600
  },
  activity: {
    border: '#EAB308', // yellow-500
    background: '#FEFCE8', // yellow-50
    text: '#CA8A04' // yellow-600
  },
  default: {
    border: '#B85450', // primary
    background: '#F8F8F8',
    text: '#B85450'
  }
} as const

// Get marker classes based on configuration
export function getMarkerClasses(config: MarkerStyleConfig): string {
  const { size, category, isSelected, isFeatured, hasPhoto } = config
  const sizeConfig = MARKER_SIZES[size]
  const colorConfig = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default
  
  const baseClasses = [
    'relative rounded-full shadow-lg overflow-hidden transition-all duration-200 bg-white'
  ]
  
  // Size classes
  baseClasses.push(`w-${sizeConfig.width/4} h-${sizeConfig.height/4}`) // Tailwind sizing
  
  // Border and selection state
  if (isSelected) {
    baseClasses.push(`border-4 scale-110`)
    baseClasses.push(`border-[${colorConfig.border}]`)
  } else {
    baseClasses.push(`border-${sizeConfig.borderWidth}`)
    baseClasses.push(`border-[${colorConfig.border}]`)
    baseClasses.push('hover:scale-105')
  }
  
  // Featured places get special treatment
  if (isFeatured) {
    baseClasses.push('border-[#F4D03F]') // accent color
    baseClasses.push('border-3')
  }
  
  return baseClasses.join(' ')
}

// Get thumbnail URL with size optimization
export function getThumbnailUrl(place: Place, size: MarkerSize): string | null {
  if (!place.primary_image) return null
  
  const dimensions = MARKER_SIZES[size]
  const width = dimensions.width
  const height = dimensions.height
  
  // Add size optimization parameters (assuming Supabase image transformation)
  const baseUrl = place.primary_image
  const params = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
    resize: 'cover',
    format: 'webp', // Use WebP for better compression
    quality: '80'
  })
  
  return `${baseUrl}?${params.toString()}`
}

// Determine marker size based on zoom level
export function getMarkerSizeForZoom(zoom: number): MarkerSize {
  if (zoom >= 16) return 'large'
  if (zoom >= 14) return 'medium'
  return 'small'
}

// Check if place should be featured (high rating)
export function isFeaturedPlace(place: Place): boolean {
  return (place.rating || 0) >= 4.5
}

// Get category from place
export function getPlaceCategory(place: Place): PlaceCategory {
  return place.category?.toLowerCase() || 'default'
}

// Calculate marker priority for clustering
export function getMarkerPriority(place: Place): number {
  let priority = 0
  
  // Rating contributes to priority
  priority += (place.rating || 0) * 10
  
  // Featured places get bonus
  if (isFeaturedPlace(place)) {
    priority += 20
  }
  
  // Places with photos get bonus
  if (place.primary_image) {
    priority += 15
  }
  
  return priority
}

// Validate marker configuration
export function validateMarkerConfig(config: MarkerStyleConfig): boolean {
  if (!Object.keys(MARKER_SIZES).includes(config.size)) {
    console.warn(`Invalid marker size: ${config.size}`)
    return false
  }
  
  return true
}

// Helper to create marker style object for CSS-in-JS
export function createMarkerStyle(config: MarkerStyleConfig) {
  const { size, category, isSelected, isFeatured } = config
  const sizeConfig = MARKER_SIZES[size]
  const colorConfig = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default
  
  return {
    width: sizeConfig.width,
    height: sizeConfig.height,
    borderWidth: isSelected ? 4 : sizeConfig.borderWidth,
    borderColor: isFeatured ? '#F4D03F' : colorConfig.border,
    borderStyle: 'solid',
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
    overflow: 'hidden',
    position: 'relative' as const
  }
}

// Performance optimization: Marker visibility based on zoom and bounds
export function shouldShowMarker(place: Place, zoom: number, bounds?: any): boolean {
  // Always show at high zoom levels
  if (zoom >= 15) return true
  
  // At medium zoom, show featured places only
  if (zoom >= 13) {
    return isFeaturedPlace(place)
  }
  
  // At low zoom, show only top-rated places
  if (zoom >= 11) {
    return (place.rating || 0) >= 4.0
  }
  
  // Very low zoom - only show exceptional places
  return (place.rating || 0) >= 4.8
}