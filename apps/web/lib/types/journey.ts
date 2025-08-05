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

// Advanced Features - Journey System Types
export interface AdvancedJourney {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration_minutes: number;
  distance_km: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  mood_tags: string[];
  optimal_times: OptimalTime[];
  weather_suitability: WeatherSuitability;
  estimated_cost: CostEstimate;
  hero_image_url?: string;
  is_published: boolean;
  view_count: number;
  save_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  stops?: AdvancedJourneyStop[];
}

export interface AdvancedJourneyStop {
  id: string;
  journey_id: string;
  place_id: string;
  order_index: number;
  arrival_time_offset: number;
  recommended_duration: number;
  stop_type: 'must_visit' | 'optional' | 'photo_op' | 'refreshment' | 'activity';
  notes?: string;
  activities?: StopActivity[];
  place?: any; // Place data populated when fetched
}

export interface StopActivity {
  name: string;
  duration: number;
  cost?: number;
  booking_required: boolean;
  booking_link?: string;
}

export interface OptimalTime {
  days: string[];
  start_time: string;
  end_time: string;
  reason: string;
  crowd_level: 'quiet' | 'moderate' | 'busy';
}

export interface WeatherSuitability {
  ideal_conditions: string[];
  acceptable_conditions: string[];
  avoid_conditions: string[];
  seasonal_notes: {
    summer: string;
    monsoon: string;
    winter: string;
  };
}

export interface CostEstimate {
  min: number;
  max: number;
  breakdown: Array<{
    category: string;
    amount_range: string;
  }>;
}

export interface RouteCalculation {
  total_distance_km: number;
  total_walking_time_min: number;
  segments: RouteSegment[];
  calculated_at: string;
}

export interface RouteSegment {
  from: string;
  to: string;
  distance_meters: number;
  duration_seconds: number;
  polyline: string;
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
}

// Companion Activities Engine Types
export interface CompanionSuggestion {
  place: any;
  activity_type: 'before' | 'after';
  reason: string;
  time_gap_minutes: number;
  distance_meters: number;
  compatibility_score: number;
}

export interface CompanionActivity {
  id: string;
  place_id: string;
  companion_place_id: string;
  activity_type: 'before' | 'after';
  time_gap_minutes: number;
  distance_meters: number;
  compatibility_score: number;
  created_at: string;
}

// Weather Recommendations Types
export interface WeatherConditions {
  temp: number;
  feels_like: number;
  humidity: number;
  weather: string;
  rain_chance: number;
}

export interface PlaceRecommendation {
  place: any;
  score: number;
  reason: string;
}

// Legacy journey type for compatibility with existing data
export interface LegacyJourney {
  id: string;
  title: string;
  description: string;
  gradient: string;
  icon: string;
  estimated_time: string;
  vibe_tags: string[];
  created_at: string;
  updated_at: string;
}