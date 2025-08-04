-- Create places schema for Story 1.2
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create places table
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category VARCHAR(100),
  weather_suitability JSONB,
  accessibility_info TEXT,
  best_time_to_visit VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companion activities table
CREATE TABLE companion_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('before', 'after')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  timing_minutes INTEGER,
  weather_dependent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create place images table
CREATE TABLE place_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_places_coordinates ON places(latitude, longitude);
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_rating ON places(rating);
CREATE INDEX idx_companion_activities_place_id ON companion_activities(place_id);
CREATE INDEX idx_companion_activities_type ON companion_activities(activity_type);
CREATE INDEX idx_place_images_place_id ON place_images(place_id);
CREATE INDEX idx_place_images_primary ON place_images(is_primary) WHERE is_primary = true;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for places table
CREATE TRIGGER update_places_updated_at 
    BEFORE UPDATE ON places 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE companion_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - will be refined in auth stories)
CREATE POLICY "Allow public read access on places" ON places FOR SELECT USING (true);
CREATE POLICY "Allow public read access on companion_activities" ON companion_activities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on place_images" ON place_images FOR SELECT USING (true);

-- Add constraints for Indiranagar coordinates (rough boundaries)
ALTER TABLE places ADD CONSTRAINT check_indiranagar_boundaries 
  CHECK (
    latitude BETWEEN 12.95 AND 13.00 AND 
    longitude BETWEEN 77.58 AND 77.65
  );