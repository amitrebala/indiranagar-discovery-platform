# 🚀 SESSION 3: Advanced Features Implementation
## Journey System, Companion Engine & Weather Features (No Admin Dependencies)

---

## 📋 OVERVIEW

This package implements advanced features that can run independently: Journey data models, companion activities engine, and weather-based recommendations.

**Total Components:** 6 major systems  
**Estimated Time:** 15-20 hours  
**Can Start:** IMMEDIATELY (no dependencies)

---

## 🎯 PREREQUISITES

```bash
# 1. Database Setup (CRITICAL - Do First!)
# Run in Supabase SQL Editor
```

```sql
-- Journey Tables
CREATE TABLE IF NOT EXISTS journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  distance_km DECIMAL(5,2),
  difficulty VARCHAR(20),
  mood_tags TEXT[],
  optimal_times JSONB,
  weather_suitability JSONB,
  estimated_cost JSONB,
  hero_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  created_by VARCHAR(50) DEFAULT 'amit',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id),
  order_index INTEGER NOT NULL,
  arrival_time_offset INTEGER,
  recommended_duration INTEGER,
  stop_type VARCHAR(50),
  notes TEXT,
  activities JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Companion Activities Table
CREATE TABLE IF NOT EXISTS companion_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID REFERENCES places(id),
  companion_place_id UUID REFERENCES places(id),
  activity_type VARCHAR(50), -- 'before', 'after'
  time_gap_minutes INTEGER,
  distance_meters INTEGER,
  compatibility_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(place_id, companion_place_id, activity_type)
);

-- Saved Journeys (for analytics)
CREATE TABLE IF NOT EXISTS saved_journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id),
  visitor_id VARCHAR(100),
  saved_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_journey_stops_journey ON journey_stops(journey_id);
CREATE INDEX idx_journey_stops_order ON journey_stops(journey_id, order_index);
CREATE INDEX idx_companion_place ON companion_activities(place_id);
CREATE INDEX idx_journeys_published ON journeys(is_published);
CREATE INDEX idx_journeys_slug ON journeys(slug);

-- Enable RLS
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE companion_activities ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Journeys are viewable by everyone" ON journeys
  FOR SELECT USING (is_published = true);

CREATE POLICY "Journey stops are viewable by everyone" ON journey_stops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM journeys 
      WHERE journeys.id = journey_stops.journey_id 
      AND journeys.is_published = true
    )
  );

CREATE POLICY "Companion activities are viewable by everyone" ON companion_activities
  FOR SELECT USING (true);
```

```bash
# 2. Install Required Dependencies
npm install @googlemaps/google-maps-services-js
npm install date-fns
```

```bash
# 3. Add to .env.local
GOOGLE_MAPS_API_KEY=your-api-key-here
```

---

## 💻 IMPLEMENTATION STEPS

### STEP 1: Journey System Core

#### 1.1 Journey Types
Create `/lib/types/journey.ts`:
```typescript
export interface Journey {
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
  stops?: JourneyStop[];
}

export interface JourneyStop {
  id: string;
  journey_id: string;
  place_id: string;
  order_index: number;
  arrival_time_offset: number;
  recommended_duration: number;
  stop_type: 'must_visit' | 'optional' | 'photo_op' | 'refreshment' | 'activity';
  notes?: string;
  activities?: StopActivity[];
  place?: Place; // Populated when fetched
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
```

#### 1.2 Journey API Routes
Create `/app/api/journeys/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

// GET: Fetch published journeys
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mood = searchParams.get('mood');
  const difficulty = searchParams.get('difficulty');
  const duration = searchParams.get('duration'); // short, medium, long
  
  try {
    let query = supabase
      .from('journeys')
      .select(`
        *,
        stops:journey_stops(
          *,
          place:places(*)
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (mood) {
      query = query.contains('mood_tags', [mood]);
    }
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    if (duration) {
      switch (duration) {
        case 'short':
          query = query.lte('duration_minutes', 120);
          break;
        case 'medium':
          query = query.gt('duration_minutes', 120).lte('duration_minutes', 240);
          break;
        case 'long':
          query = query.gt('duration_minutes', 240);
          break;
      }
    }
    
    const { data: journeys, error } = await query;
    
    if (error) throw error;
    
    // Sort stops by order_index
    journeys?.forEach(journey => {
      if (journey.stops) {
        journey.stops.sort((a, b) => a.order_index - b.order_index);
      }
    });
    
    return NextResponse.json({ journeys });
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journeys' },
      { status: 500 }
    );
  }
}
```

#### 1.3 Journey Detail Route
Create `/app/api/journeys/[slug]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Fetch journey with stops and places
    const { data: journey, error } = await supabase
      .from('journeys')
      .select(`
        *,
        stops:journey_stops(
          *,
          place:places(*)
        )
      `)
      .eq('slug', params.slug)
      .eq('is_published', true)
      .single();
    
    if (error || !journey) {
      return NextResponse.json(
        { error: 'Journey not found' },
        { status: 404 }
      );
    }
    
    // Sort stops by order
    journey.stops?.sort((a, b) => a.order_index - b.order_index);
    
    // Increment view count
    await supabase
      .from('journeys')
      .update({ view_count: journey.view_count + 1 })
      .eq('id', journey.id);
    
    return NextResponse.json({ journey });
  } catch (error) {
    console.error('Error fetching journey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journey' },
      { status: 500 }
    );
  }
}
```

### STEP 2: Distance & Route Calculation

#### 2.1 Create Distance Calculator Service
Create `/lib/services/distance-calculator.ts`:
```typescript
import { Client } from '@googlemaps/google-maps-services-js';

export class DistanceCalculator {
  private client: Client;
  private cache: Map<string, any>;
  
  constructor() {
    this.client = new Client({});
    this.cache = new Map();
  }
  
  async calculateJourneyDistance(stops: Array<{ lat: number; lng: number; place_id: string }>) {
    const cacheKey = stops.map(s => s.place_id).join('-');
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    let totalDistance = 0;
    let totalDuration = 0;
    const segments = [];
    
    for (let i = 0; i < stops.length - 1; i++) {
      const origin = stops[i];
      const destination = stops[i + 1];
      
      try {
        // Get walking directions
        const response = await this.client.directions({
          params: {
            origin: `${origin.lat},${origin.lng}`,
            destination: `${destination.lat},${destination.lng}`,
            mode: 'walking' as any,
            key: process.env.GOOGLE_MAPS_API_KEY!,
          }
        });
        
        if (response.data.routes.length > 0) {
          const route = response.data.routes[0];
          const leg = route.legs[0];
          
          segments.push({
            from: origin.place_id,
            to: destination.place_id,
            distance_meters: leg.distance.value,
            duration_seconds: leg.duration.value,
            polyline: route.overview_polyline.points,
            steps: leg.steps.map(step => ({
              instruction: step.html_instructions,
              distance: step.distance.text,
              duration: step.duration.text
            }))
          });
          
          totalDistance += leg.distance.value;
          totalDuration += leg.duration.value;
        }
      } catch (error) {
        console.error('Error calculating route segment:', error);
        // Fallback to straight-line distance
        const distance = this.haversineDistance(origin, destination);
        segments.push({
          from: origin.place_id,
          to: destination.place_id,
          distance_meters: distance,
          duration_seconds: Math.round(distance / 1.4), // ~5km/h walking
          polyline: '',
          steps: []
        });
        
        totalDistance += distance;
        totalDuration += Math.round(distance / 1.4);
      }
    }
    
    const result = {
      total_distance_km: Number((totalDistance / 1000).toFixed(2)),
      total_walking_time_min: Math.ceil(totalDuration / 60),
      segments,
      calculated_at: new Date().toISOString()
    };
    
    // Cache for 24 hours
    this.cache.set(cacheKey, result);
    setTimeout(() => this.cache.delete(cacheKey), 24 * 60 * 60 * 1000);
    
    return result;
  }
  
  private haversineDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }
}
```

#### 2.2 Create Route Calculation API
Create `/app/api/journeys/[id]/route/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { DistanceCalculator } from '@/lib/services/distance-calculator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch journey with stops and places
    const { data: journey, error } = await supabase
      .from('journeys')
      .select(`
        *,
        stops:journey_stops(
          *,
          place:places(id, name, coordinates)
        )
      `)
      .eq('id', params.id)
      .single();
    
    if (error || !journey) {
      return NextResponse.json(
        { error: 'Journey not found' },
        { status: 404 }
      );
    }
    
    // Sort stops
    journey.stops.sort((a, b) => a.order_index - b.order_index);
    
    // Prepare coordinates
    const coordinates = journey.stops.map(stop => ({
      lat: stop.place.coordinates.lat,
      lng: stop.place.coordinates.lng,
      place_id: stop.place.id
    }));
    
    // Calculate route
    const calculator = new DistanceCalculator();
    const route = await calculator.calculateJourneyDistance(coordinates);
    
    // Update journey with calculated distance if not set
    if (!journey.distance_km) {
      await supabase
        .from('journeys')
        .update({ 
          distance_km: route.total_distance_km,
          duration_minutes: route.total_walking_time_min + 
            journey.stops.reduce((sum, stop) => sum + (stop.recommended_duration || 0), 0)
        })
        .eq('id', journey.id);
    }
    
    return NextResponse.json({ route });
  } catch (error) {
    console.error('Error calculating route:', error);
    return NextResponse.json(
      { error: 'Failed to calculate route' },
      { status: 500 }
    );
  }
}
```

### STEP 3: Companion Activities Engine

#### 3.1 Create Companion Engine
Create `/lib/services/companion-engine.ts`:
```typescript
import { supabase } from '@/lib/supabase/client';

export interface CompanionSuggestion {
  place: any;
  activity_type: 'before' | 'after';
  reason: string;
  time_gap_minutes: number;
  distance_meters: number;
  compatibility_score: number;
}

export class CompanionEngine {
  async findCompanions(
    placeId: string,
    preferences?: {
      time_available?: number;
      mood?: string;
      budget?: 'low' | 'medium' | 'high';
    }
  ): Promise<{
    before: CompanionSuggestion[];
    after: CompanionSuggestion[];
  }> {
    // Fetch the main place
    const { data: mainPlace } = await supabase
      .from('places')
      .select('*')
      .eq('id', placeId)
      .single();
    
    if (!mainPlace) {
      return { before: [], after: [] };
    }
    
    // Fetch pre-computed companions
    const { data: companions } = await supabase
      .from('companion_activities')
      .select(`
        *,
        companion_place:places!companion_place_id(*)
      `)
      .eq('place_id', placeId)
      .order('compatibility_score', { ascending: false });
    
    // If no pre-computed, calculate dynamically
    if (!companions || companions.length === 0) {
      return this.calculateCompanions(mainPlace, preferences);
    }
    
    // Filter based on preferences
    let filtered = companions;
    
    if (preferences?.time_available) {
      filtered = filtered.filter(c => 
        c.time_gap_minutes <= preferences.time_available
      );
    }
    
    if (preferences?.mood) {
      filtered = filtered.filter(c => 
        c.companion_place.mood_tags?.includes(preferences.mood)
      );
    }
    
    // Group by activity type
    const before = filtered
      .filter(c => c.activity_type === 'before')
      .map(c => ({
        place: c.companion_place,
        activity_type: 'before' as const,
        reason: this.generateReason(mainPlace, c.companion_place, 'before'),
        time_gap_minutes: c.time_gap_minutes,
        distance_meters: c.distance_meters,
        compatibility_score: c.compatibility_score
      }));
    
    const after = filtered
      .filter(c => c.activity_type === 'after')
      .map(c => ({
        place: c.companion_place,
        activity_type: 'after' as const,
        reason: this.generateReason(mainPlace, c.companion_place, 'after'),
        time_gap_minutes: c.time_gap_minutes,
        distance_meters: c.distance_meters,
        compatibility_score: c.compatibility_score
      }));
    
    return { before, after };
  }
  
  private async calculateCompanions(
    mainPlace: any,
    preferences?: any
  ) {
    // Fetch nearby places
    const { data: nearbyPlaces } = await supabase
      .from('places')
      .select('*')
      .neq('id', mainPlace.id);
    
    if (!nearbyPlaces) {
      return { before: [], after: [] };
    }
    
    const suggestions = nearbyPlaces.map(place => {
      // Calculate distance (simplified)
      const distance = this.calculateDistance(
        mainPlace.coordinates,
        place.coordinates
      );
      
      // Skip if too far (> 1km)
      if (distance > 1000) return null;
      
      // Calculate compatibility score
      const score = this.calculateCompatibility(mainPlace, place);
      
      // Determine if before or after
      const activityType = this.determineActivityType(mainPlace, place);
      
      return {
        place,
        activity_type: activityType,
        reason: this.generateReason(mainPlace, place, activityType),
        time_gap_minutes: Math.round(distance / 80) + 30, // Walking + activity time
        distance_meters: distance,
        compatibility_score: score
      };
    }).filter(Boolean);
    
    // Sort by score
    suggestions.sort((a, b) => b.compatibility_score - a.compatibility_score);
    
    // Group by type
    const before = suggestions
      .filter(s => s.activity_type === 'before')
      .slice(0, 5);
    
    const after = suggestions
      .filter(s => s.activity_type === 'after')
      .slice(0, 5);
    
    return { before, after };
  }
  
  private calculateDistance(coord1: any, coord2: any): number {
    if (!coord1 || !coord2) return 9999;
    
    const R = 6371e3;
    const φ1 = coord1.lat * Math.PI/180;
    const φ2 = coord2.lat * Math.PI/180;
    const Δφ = (coord2.lat - coord1.lat) * Math.PI/180;
    const Δλ = (coord2.lng - coord1.lng) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }
  
  private calculateCompatibility(place1: any, place2: any): number {
    let score = 0.5; // Base score
    
    // Category compatibility
    const compatiblePairs = {
      'restaurant': ['bar', 'cafe', 'dessert'],
      'cafe': ['bookstore', 'park', 'gallery'],
      'bar': ['restaurant', 'club', 'live_music'],
      'shopping': ['cafe', 'restaurant'],
      'park': ['cafe', 'restaurant', 'activity'],
      'activity': ['restaurant', 'bar', 'cafe']
    };
    
    if (compatiblePairs[place1.category]?.includes(place2.category)) {
      score += 0.3;
    }
    
    // Time compatibility (simplified)
    if (place1.category === 'cafe' && place2.category === 'restaurant') {
      score += 0.2; // Coffee before lunch/dinner
    }
    
    if (place1.category === 'restaurant' && place2.category === 'bar') {
      score += 0.2; // Drinks after dinner
    }
    
    return Math.min(score, 1);
  }
  
  private determineActivityType(
    mainPlace: any,
    companionPlace: any
  ): 'before' | 'after' {
    // Time-based logic
    const beforeCategories = ['cafe', 'breakfast', 'activity', 'park'];
    const afterCategories = ['bar', 'dessert', 'club', 'live_music'];
    
    if (beforeCategories.includes(companionPlace.category)) {
      return 'before';
    }
    
    if (afterCategories.includes(companionPlace.category)) {
      return 'after';
    }
    
    // Default based on main place
    if (mainPlace.category === 'restaurant') {
      return companionPlace.category === 'cafe' ? 'before' : 'after';
    }
    
    return 'after';
  }
  
  private generateReason(
    mainPlace: any,
    companionPlace: any,
    type: 'before' | 'after'
  ): string {
    const reasons = {
      'cafe-restaurant': type === 'before' 
        ? 'Perfect coffee spot before your meal'
        : 'Grab coffee to end your experience',
      'restaurant-bar': 'Continue the evening with drinks',
      'restaurant-dessert': 'Sweet ending to your meal',
      'activity-restaurant': 'Refuel after your activity',
      'park-cafe': 'Relax with coffee after your walk',
      'shopping-cafe': 'Take a break from shopping'
    };
    
    const key = `${companionPlace.category}-${mainPlace.category}`;
    const reverseKey = `${mainPlace.category}-${companionPlace.category}`;
    
    return reasons[key] || reasons[reverseKey] || 
      `Great ${type === 'before' ? 'start' : 'ending'} to your visit`;
  }
}
```

#### 3.2 Create Companion API
Create `/app/api/places/[id]/companions/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { CompanionEngine } from '@/lib/services/companion-engine';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeAvailable = searchParams.get('time');
    const mood = searchParams.get('mood');
    const budget = searchParams.get('budget') as 'low' | 'medium' | 'high';
    
    const engine = new CompanionEngine();
    const companions = await engine.findCompanions(params.id, {
      time_available: timeAvailable ? parseInt(timeAvailable) : undefined,
      mood: mood || undefined,
      budget: budget || undefined
    });
    
    return NextResponse.json(companions);
  } catch (error) {
    console.error('Error finding companions:', error);
    return NextResponse.json(
      { error: 'Failed to find companion activities' },
      { status: 500 }
    );
  }
}
```

### STEP 4: Weather-Aware Recommendations

#### 4.1 Enhance Weather Service
Create `/lib/services/weather-recommendations.ts`:
```typescript
interface WeatherConditions {
  temp: number;
  feels_like: number;
  humidity: number;
  weather: string;
  rain_chance: number;
}

interface PlaceRecommendation {
  place: any;
  score: number;
  reason: string;
}

export class WeatherRecommendations {
  async getRecommendations(
    weather: WeatherConditions,
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  ): Promise<PlaceRecommendation[]> {
    const { data: places } = await supabase
      .from('places')
      .select('*')
      .eq('has_amit_visited', true);
    
    if (!places) return [];
    
    // Score each place based on weather
    const scored = places.map(place => {
      let score = 0.5; // Base score
      let reason = '';
      
      // Hot weather (> 30°C)
      if (weather.temp > 30) {
        if (place.has_ac) score += 0.3;
        if (place.category === 'cafe' || place.category === 'mall') {
          score += 0.2;
          reason = 'Perfect for escaping the heat';
        }
        if (place.has_outdoor_seating && !place.has_shade) {
          score -= 0.3;
        }
      }
      
      // Rainy weather
      if (weather.rain_chance > 50) {
        if (place.has_covered_area || place.is_indoor) {
          score += 0.4;
          reason = 'Great indoor option for rainy weather';
        }
        if (place.category === 'park' || place.category === 'outdoor_activity') {
          score -= 0.5;
        }
      }
      
      // Pleasant weather (20-28°C)
      if (weather.temp >= 20 && weather.temp <= 28) {
        if (place.has_outdoor_seating) {
          score += 0.3;
          reason = 'Enjoy the perfect weather outdoors';
        }
        if (place.category === 'park' || place.category === 'rooftop') {
          score += 0.4;
          reason = 'Ideal weather for outdoor experiences';
        }
      }
      
      // Time of day adjustments
      if (timeOfDay === 'morning' && place.serves_breakfast) {
        score += 0.2;
      }
      if (timeOfDay === 'evening' && place.good_for_groups) {
        score += 0.1;
      }
      if (timeOfDay === 'night' && place.category === 'bar') {
        score += 0.2;
      }
      
      return {
        place,
        score: Math.min(score, 1),
        reason: reason || this.generateGenericReason(place, weather)
      };
    });
    
    // Sort by score and return top 10
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
  
  private generateGenericReason(place: any, weather: WeatherConditions): string {
    const reasons = [
      `Great ${place.category} for today's weather`,
      `Recommended for current conditions`,
      `Perfect choice for ${weather.weather} weather`,
      `Amit's pick for days like this`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }
  
  async getJourneyRecommendations(
    weather: WeatherConditions
  ): Promise<any[]> {
    const { data: journeys } = await supabase
      .from('journeys')
      .select('*')
      .eq('is_published', true);
    
    if (!journeys) return [];
    
    // Filter based on weather suitability
    return journeys.filter(journey => {
      const suitability = journey.weather_suitability;
      
      // Check if current weather is in avoid conditions
      if (suitability?.avoid_conditions) {
        if (weather.rain_chance > 70 && suitability.avoid_conditions.includes('heavy_rain')) {
          return false;
        }
        if (weather.temp > 35 && suitability.avoid_conditions.includes('extreme_heat')) {
          return false;
        }
      }
      
      // Prefer journeys with ideal conditions matching
      if (suitability?.ideal_conditions) {
        if (weather.weather === 'clear' && suitability.ideal_conditions.includes('sunny')) {
          return true;
        }
        if (weather.temp >= 20 && weather.temp <= 28 && 
            suitability.ideal_conditions.includes('pleasant')) {
          return true;
        }
      }
      
      return true; // Default include
    }).slice(0, 5);
  }
}
```

#### 4.2 Create Weather Recommendations API
Create `/app/api/recommendations/weather/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { WeatherRecommendations } from '@/lib/services/weather-recommendations';

export async function GET(request: NextRequest) {
  try {
    // Get current weather (use existing weather API)
    const weatherResponse = await fetch(
      `${request.nextUrl.origin}/api/weather`
    );
    const weatherData = await weatherResponse.json();
    
    // Get time of day
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    // Get recommendations
    const recommender = new WeatherRecommendations();
    const placeRecommendations = await recommender.getRecommendations(
      weatherData,
      timeOfDay
    );
    
    const journeyRecommendations = await recommender.getJourneyRecommendations(
      weatherData
    );
    
    return NextResponse.json({
      weather: weatherData,
      timeOfDay,
      places: placeRecommendations,
      journeys: journeyRecommendations
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
```

### STEP 5: Public Journey Display Components

#### 5.1 Journey Card Component
Create `/components/journeys/JourneyCard.tsx`:
```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface JourneyCardProps {
  journey: {
    id: string;
    slug: string;
    name: string;
    description: string;
    duration_minutes: number;
    distance_km: number;
    difficulty: string;
    mood_tags: string[];
    hero_image_url?: string;
    stops?: any[];
  };
}

export default function JourneyCard({ journey }: JourneyCardProps) {
  const [saved, setSaved] = useState(false);
  
  const handleSave = async () => {
    // Save to localStorage for now (no auth)
    const savedJourneys = JSON.parse(
      localStorage.getItem('saved_journeys') || '[]'
    );
    
    if (saved) {
      const filtered = savedJourneys.filter(id => id !== journey.id);
      localStorage.setItem('saved_journeys', JSON.stringify(filtered));
      setSaved(false);
    } else {
      savedJourneys.push(journey.id);
      localStorage.setItem('saved_journeys', JSON.stringify(savedJourneys));
      setSaved(true);
      
      // Track save
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'journey_saved',
          journey_id: journey.id
        })
      });
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Hero Image */}
      {journey.hero_image_url && (
        <div className="relative h-48">
          <img
            src={journey.hero_image_url}
            alt={journey.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleSave}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg"
          >
            {saved ? '❤️' : '🤍'}
          </button>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {journey.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {journey.description}
        </p>
        
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <span className="mr-1">⏱️</span>
            {Math.floor(journey.duration_minutes / 60)}h {journey.duration_minutes % 60}m
          </span>
          <span className="flex items-center">
            <span className="mr-1">📍</span>
            {journey.distance_km}km
          </span>
          <span className="flex items-center">
            <span className="mr-1">📍</span>
            {journey.stops?.length || 0} stops
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(journey.difficulty)}`}>
            {journey.difficulty}
          </span>
          {journey.mood_tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Action */}
        <Link
          href={`/journeys/${journey.slug}`}
          className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          View Journey
        </Link>
      </div>
    </div>
  );
}
```

#### 5.2 Companion Activities Component
Create `/components/places/CompanionActivities.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { CompanionEngine } from '@/lib/services/companion-engine';

interface CompanionActivitiesProps {
  placeId: string;
}

export default function CompanionActivities({ placeId }: CompanionActivitiesProps) {
  const [companions, setCompanions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCompanions();
  }, [placeId]);
  
  const fetchCompanions = async () => {
    try {
      const response = await fetch(`/api/places/${placeId}/companions`);
      const data = await response.json();
      setCompanions(data);
    } catch (error) {
      console.error('Error fetching companions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }
  
  if (!companions || (companions.before.length === 0 && companions.after.length === 0)) {
    return null;
  }
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🎯 Perfect Companions
      </h3>
      
      {companions.before.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Before visiting:</h4>
          <div className="space-y-2">
            {companions.before.slice(0, 2).map((item: any) => (
              <div key={item.place.id} className="bg-white rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{item.place.name}</p>
                    <p className="text-sm text-gray-600">{item.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(item.distance_meters / 100) * 100}m away · 
                      {item.time_gap_minutes} min
                    </p>
                  </div>
                  <a
                    href={`/places/${item.place.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {companions.after.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">After visiting:</h4>
          <div className="space-y-2">
            {companions.after.slice(0, 2).map((item: any) => (
              <div key={item.place.id} className="bg-white rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{item.place.name}</p>
                    <p className="text-sm text-gray-600">{item.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(item.distance_meters / 100) * 100}m away · 
                      {item.time_gap_minutes} min
                    </p>
                  </div>
                  <a
                    href={`/places/${item.place.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button className="w-full mt-4 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">
        Create Journey with These →
      </button>
    </div>
  );
}
```

---

## 🧪 TESTING CHECKLIST

### Database Testing
```sql
-- Verify tables created
SELECT * FROM journeys LIMIT 1;
SELECT * FROM journey_stops LIMIT 1;
SELECT * FROM companion_activities LIMIT 1;
```

### API Testing
```bash
# Test journey listing
curl http://localhost:3000/api/journeys

# Test journey detail
curl http://localhost:3000/api/journeys/[slug]

# Test route calculation
curl http://localhost:3000/api/journeys/[id]/route

# Test companion suggestions
curl http://localhost:3000/api/places/[id]/companions

# Test weather recommendations
curl http://localhost:3000/api/recommendations/weather
```

---

## ✅ VALIDATION CHECKLIST

- [ ] Journey tables created in database
- [ ] Journey API returns list and details
- [ ] Route calculation works (or falls back gracefully)
- [ ] Companion engine suggests relevant places
- [ ] Weather recommendations adapt to conditions
- [ ] Journey cards display correctly
- [ ] Save journey to localStorage works
- [ ] Companion activities show on place pages
- [ ] Distance calculations are accurate
- [ ] All components render without errors

---

## 🚀 INTEGRATION POINTS

After Session 1 completes admin auth:
1. Add Journey Builder UI in admin
2. Add journey CRUD operations
3. Add journey publishing workflow
4. Add analytics tracking

---

## 📝 COMMIT MESSAGE

```bash
git add .
git commit -m "feat(advanced): implement journey system and companion engine

- Add journey data model and APIs
- Implement distance/route calculation
- Create companion activities engine
- Add weather-aware recommendations
- Build public journey display components
- Support journey saving (localStorage)
- Calculate walking times and distances"
```

---

*Package Version: 1.0*
*Estimated Time: 15-20 hours*
*Dependencies: Google Maps API key required*