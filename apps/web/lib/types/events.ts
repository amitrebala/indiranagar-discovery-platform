export interface DiscoveredEvent {
  id: string;
  staging_id?: string;
  source_id?: string;
  
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  
  start_time: string;
  end_time?: string;
  timezone?: string;
  is_recurring?: boolean;
  recurrence_rule?: any;
  
  venue_name?: string;
  venue_address?: string;
  latitude?: number;
  longitude?: number;
  plus_code?: string;
  google_place_id?: string;
  
  organizer_name?: string;
  organizer_type?: 'business' | 'individual' | 'community' | 'government';
  contact_info?: any;
  
  external_url?: string;
  ticket_url?: string;
  cost_type?: 'free' | 'paid' | 'donation' | 'variable';
  price_range?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  capacity?: number;
  registration_required?: boolean;
  
  quality_score?: number;
  verification_status?: 'unverified' | 'verified' | 'official';
  moderation_status?: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderation_notes?: string;
  
  view_count?: number;
  rsvp_count?: number;
  share_count?: number;
  
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  
  images?: EventImage[];
}

export interface EventImage {
  id: string;
  url: string;
  thumbnail_url?: string;
  alt_text?: string;
  is_primary?: boolean;
}

export interface PlaceLiveStatus {
  id: string;
  place_id: string;
  is_open?: boolean;
  current_capacity?: 'empty' | 'quiet' | 'moderate' | 'busy' | 'packed';
  wait_time_minutes?: number;
  special_status?: string;
  source?: 'google' | 'user' | 'prediction' | 'business';
  confidence?: number;
  valid_until?: string;
  created_at?: string;
  updated_at?: string;
}