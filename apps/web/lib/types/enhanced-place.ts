import type { Place } from '@/lib/validations'

export interface EnhancedPlaceData extends Place {
  images: string[]
  blur_data_urls?: string[]
  visitor_metrics?: {
    daily_average: number
    peak_hours: string[]
    current_status: 'quiet' | 'moderate' | 'busy'
  }
  weather_suitable?: {
    sunny: boolean
    rainy: boolean
    evening: boolean
  }
  quick_tags?: string[]
  companion_places?: {
    id: string
    name: string
    distance: string
  }[]
}

export interface EnhancedPlace extends EnhancedPlaceData {
  // Google Places enrichment
  google_place_id?: string
  rating?: number
  user_ratings_total?: number
  price_level?: number
  opening_hours?: string[]
  business_status?: string
  editorial_summary?: string
  google_types?: string[]
  google_photos?: {
    url: string
    attribution: string
  }[]
  google_reviews?: {
    author: string
    rating: number
    text: string
    time: string
  }[]
}