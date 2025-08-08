-- Journey experiences table for rich narrative content
CREATE TABLE IF NOT EXISTS journey_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  narrative TEXT,
  themes TEXT[],
  mood VARCHAR(50),
  target_audience TEXT,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journey stops table for detailed stop information
CREATE TABLE IF NOT EXISTS journey_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  activities TEXT[],
  description TEXT,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Walking directions table for turn-by-turn navigation
CREATE TABLE IF NOT EXISTS walking_directions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  from_stop_id UUID REFERENCES journey_stops(id) ON DELETE CASCADE,
  to_stop_id UUID REFERENCES journey_stops(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  distance_meters INTEGER,
  duration_seconds INTEGER,
  landmarks TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Photo opportunities table
CREATE TABLE IF NOT EXISTS photo_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES journey_stops(id) ON DELETE CASCADE,
  location_name VARCHAR(255),
  coordinates JSONB,
  best_angle TEXT,
  best_time_of_day VARCHAR(50),
  description TEXT,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journey reviews table
CREATE TABLE IF NOT EXISTS journey_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  user_id TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  photos TEXT[],
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_journey_stops_journey_id ON journey_stops(journey_id);
CREATE INDEX idx_journey_stops_order ON journey_stops(journey_id, stop_order);
CREATE INDEX idx_walking_directions_journey ON walking_directions(journey_id);
CREATE INDEX idx_photo_opportunities_journey ON photo_opportunities(journey_id);
CREATE INDEX idx_journey_reviews_journey ON journey_reviews(journey_id);
CREATE INDEX idx_journey_reviews_rating ON journey_reviews(rating);

-- Enable RLS
ALTER TABLE journey_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE walking_directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Journey experiences are viewable by everyone" ON journey_experiences
  FOR SELECT USING (true);

CREATE POLICY "Journey stops are viewable by everyone" ON journey_stops
  FOR SELECT USING (true);

CREATE POLICY "Walking directions are viewable by everyone" ON walking_directions
  FOR SELECT USING (true);

CREATE POLICY "Photo opportunities are viewable by everyone" ON photo_opportunities
  FOR SELECT USING (true);

CREATE POLICY "Journey reviews are viewable by everyone" ON journey_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create journey reviews" ON journey_reviews
  FOR INSERT WITH CHECK (true);

-- Add view_count to places table if not exists
ALTER TABLE places ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;