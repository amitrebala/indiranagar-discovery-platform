-- Journey System Migration
-- Advanced Features Implementation

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
CREATE INDEX IF NOT EXISTS idx_journey_stops_journey ON journey_stops(journey_id);
CREATE INDEX IF NOT EXISTS idx_journey_stops_order ON journey_stops(journey_id, order_index);
CREATE INDEX IF NOT EXISTS idx_companion_place ON companion_activities(place_id);
CREATE INDEX IF NOT EXISTS idx_journeys_published ON journeys(is_published);
CREATE INDEX IF NOT EXISTS idx_journeys_slug ON journeys(slug);

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