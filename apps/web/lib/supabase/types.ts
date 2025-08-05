// Supabase database types for Story 1.2
export interface Database {
  public: {
    Tables: {
      places: {
        Row: Place
        Insert: PlaceInsert
        Update: PlaceUpdate
      }
      companion_activities: {
        Row: CompanionActivity
        Insert: CompanionActivityInsert
        Update: CompanionActivityUpdate
      }
      place_images: {
        Row: PlaceImage
        Insert: PlaceImageInsert
        Update: PlaceImageUpdate
      }
      journeys: {
        Row: Journey
        Insert: JourneyInsert
        Update: JourneyUpdate
      }
      journey_places: {
        Row: JourneyPlace
        Insert: JourneyPlaceInsert
        Update: Partial<JourneyPlace>
      }
    }
  }
}

// Weather conditions enum
export type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'hot' | 'cool' | 'humid'

// Activity types
export type ActivityType = 'before' | 'after'

// Place interface
export interface Place {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  rating: number
  category: string | null
  weather_suitability: WeatherCondition[] | null
  accessibility_info: string | null
  best_time_to_visit: string | null
  has_amit_visited: boolean
  brand_name?: string | null
  establishment_type?: string | null
  search_keywords?: string[] | null
  metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface PlaceInsert {
  id?: string
  name: string
  description: string
  latitude: number
  longitude: number
  rating: number
  category?: string | null
  weather_suitability?: WeatherCondition[] | null
  accessibility_info?: string | null
  best_time_to_visit?: string | null
  has_amit_visited?: boolean
  brand_name?: string | null
  establishment_type?: string | null
  search_keywords?: string[] | null
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
}

export interface PlaceUpdate {
  id?: string
  name?: string
  description?: string
  latitude?: number
  longitude?: number
  rating?: number
  category?: string | null
  weather_suitability?: WeatherCondition[] | null
  accessibility_info?: string | null
  best_time_to_visit?: string | null
  has_amit_visited?: boolean
  brand_name?: string | null
  establishment_type?: string | null
  search_keywords?: string[] | null
  metadata?: Record<string, unknown> | null
  updated_at?: string
}

// Companion Activity interface
export interface CompanionActivity {
  id: string
  place_id: string
  activity_type: ActivityType
  name: string
  description: string | null
  timing_minutes: number | null
  weather_dependent: boolean
  created_at: string
}

export interface CompanionActivityInsert {
  id?: string
  place_id: string
  activity_type: ActivityType
  name: string
  description?: string | null
  timing_minutes?: number | null
  weather_dependent?: boolean
  created_at?: string
}

export interface CompanionActivityUpdate {
  id?: string
  place_id?: string
  activity_type?: ActivityType
  name?: string
  description?: string | null
  timing_minutes?: number | null
  weather_dependent?: boolean
}

// Place Image interface
export interface PlaceImage {
  id: string
  place_id: string
  storage_path: string
  caption: string | null
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface PlaceImageInsert {
  id?: string
  place_id: string
  storage_path: string
  caption?: string | null
  is_primary?: boolean
  sort_order?: number
  created_at?: string
}

export interface PlaceImageUpdate {
  id?: string
  place_id?: string
  storage_path?: string
  caption?: string | null
  is_primary?: boolean
  sort_order?: number
}

// Place metadata interface
export interface PlaceMetadata {
  category: string
  weather_suitability: WeatherCondition[]
  companion_activities: CompanionActivity[]
  accessibility_info?: string
  best_time_to_visit?: string
}

// Journey interface
export interface Journey {
  id: string
  title: string
  description: string | null
  gradient: string
  icon: string
  estimated_time: string | null
  vibe_tags: string[] | null
  created_at: string
  updated_at: string
}

export interface JourneyInsert {
  id?: string
  title: string
  description?: string | null
  gradient: string
  icon: string
  estimated_time?: string | null
  vibe_tags?: string[] | null
}

export interface JourneyUpdate {
  title?: string
  description?: string | null
  gradient?: string
  icon?: string
  estimated_time?: string | null
  vibe_tags?: string[] | null
}

// Journey Place interface
export interface JourneyPlace {
  journey_id: string
  place_id: string
  order_index: number
  notes: string | null
}

export interface JourneyPlaceInsert {
  journey_id: string
  place_id: string
  order_index: number
  notes?: string | null
}

// Journey with places
export interface JourneyWithPlaces extends Journey {
  places: (Place & { order_index: number; notes: string | null })[]
}