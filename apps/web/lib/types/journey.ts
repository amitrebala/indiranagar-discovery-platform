import { WeatherCondition } from '../supabase/types'

export interface JourneyExperience {
  id: string
  name: string
  description: string
  mood_category: 'contemplative' | 'energetic' | 'social' | 'cultural' | 'culinary'
  duration_minutes: number
  difficulty_level: 'easy' | 'moderate' | 'challenging'
  weather_suitability: WeatherCondition[]
  optimal_times: TimeWindow[]
  journey_stops: JourneyStop[]
  alternatives: JourneyAlternative[]
  featured_image?: string
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface JourneyStop {
  id: string
  place_id: string
  order: number
  duration_minutes: number
  activities: EnhancedCompanionActivity[]
  walking_directions: WalkingDirection
  timing_notes: string
  photo_opportunities: PhotoOpportunity[]
  story_context?: string
}

export interface EnhancedCompanionActivity {
  id: string
  type: 'before' | 'after' | 'during'
  name: string
  description: string
  duration_minutes: number
  timing: 'morning' | 'afternoon' | 'evening' | 'any'
  weather_dependent: boolean
  crowd_level_preference: 'quiet' | 'moderate' | 'lively'
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  walking_time_minutes?: number
  cost_estimate?: {
    min: number
    max: number
    currency: string
  }
  insider_tips: string[]
}

export interface WalkingDirection {
  from_coordinates: LatLng
  to_coordinates: LatLng
  path: LatLng[]
  distance_meters: number
  estimated_minutes: number
  difficulty: 'easy' | 'moderate' | 'challenging'
  accessibility_notes: string
  landmarks: string[]
  route_description: string
}

export interface PhotoOpportunity {
  id: string
  name: string
  description: string
  best_time: string
  lighting_notes: string
  location_notes: string
  instagram_worthy: boolean
  image?: string
}

export interface TimeWindow {
  start_time: string
  end_time: string
  day_of_week?: string[]
  reason: string
}

export interface JourneyAlternative {
  id: string
  name: string
  reason: string
  alternative_stops: string[]
  weather_condition?: WeatherCondition
}

export interface LatLng {
  latitude: number
  longitude: number
}

export interface TimingRecommendation {
  stop_id: string
  optimal_windows: TimeWindow[]
  reasoning: string
  alternatives: TimeWindow[]
}

export interface JourneyContext {
  previousLocation?: LatLng
  nextLocation?: LatLng
  timeRemaining: number
  weatherCondition?: WeatherCondition
  crowdLevel?: 'low' | 'medium' | 'high'
}

export type MoodCategory = 'contemplative' | 'energetic' | 'social' | 'cultural' | 'culinary'

export interface JourneyProgress {
  journey_id: string
  user_id: string
  current_stop: number
  completed_stops: string[]
  started_at: string
  estimated_completion: string
  notes: string[]
}