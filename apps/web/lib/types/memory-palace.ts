export interface MemoryPalaceContent {
  discovery_story: string;
  personal_anecdotes: Anecdote[];
  spatial_elements: SpatialStoryElement[];
}

export interface Anecdote {
  id: string;
  content: string;
  context: string;
  date: string;
  emotion?: 'joyful' | 'contemplative' | 'surprising' | 'nostalgic';
}

export interface SpatialStoryElement {
  id: string;
  title: string;
  narrative: string;
  reference_image: string;
  position_x: number;
  position_y: number;
  description: string;
}

export interface PersonalReview {
  content: string;
  highlights: string[];
  personal_rating_explanation: string;
  visit_frequency: string;
  curator_signature: string;
  rating_breakdown: {
    ambiance: number;
    food_quality?: number;
    service?: number;
    value: number;
    uniqueness: number;
  };
}

export interface BusinessConnection {
  type: 'mention_my_name' | 'personal_friend' | 'regular_customer';
  description: string;
  contact_person?: string;
  special_notes?: string;
  trust_level: 'high' | 'medium' | 'verified';
}

export interface SeasonalContent {
  season: 'monsoon' | 'winter' | 'summer';
  description: string;
  recommendations: string[];
  photo_references: string[];
  best_times: string[];
  what_to_expect: string;
}

export interface PlaceImageCategory {
  category: 'ambiance' | 'food' | 'features' | 'exterior' | 'people';
  images: EnhancedPlaceImage[];
  description?: string;
}

export interface EnhancedPlaceImage {
  id: string;
  url: string;
  caption: string;
  alt_text: string;
  story_connections: ImageStoryConnection[];
  photographer_notes?: string;
  technical_details?: {
    camera_settings?: string;
    best_viewing_time?: string;
    lighting_notes?: string;
  };
}

export interface ImageStoryConnection {
  id: string;
  title: string;
  narrative: string;
  x_position: string;
  y_position: string;
  date: string;
}

export interface EnhancedPlace {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  category: string | null;
  primary_image?: string;
  image_gallery: PlaceImageCategory[];
  memory_palace_story: MemoryPalaceContent;
  personal_review: PersonalReview;
  business_relationships: BusinessConnection[];
  seasonal_notes: SeasonalContent[];
  weather_suitability: string[] | null;
  accessibility_info: string | null;
  best_time_to_visit: string | null;
  created_at: string;
  updated_at: string;
}