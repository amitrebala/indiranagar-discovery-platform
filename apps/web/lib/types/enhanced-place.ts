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