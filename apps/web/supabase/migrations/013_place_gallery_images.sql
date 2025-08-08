-- Migration: Add place gallery images table
-- Description: Support for multiple images per place with ordering and blur placeholders

-- Create the place_gallery_images table
CREATE TABLE IF NOT EXISTS place_gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  blur_data_url TEXT,
  display_order INTEGER DEFAULT 0,
  caption TEXT,
  photographer TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indices for performance
CREATE INDEX idx_place_gallery_place_id ON place_gallery_images(place_id);
CREATE INDEX idx_place_gallery_order ON place_gallery_images(place_id, display_order);
CREATE INDEX idx_place_gallery_primary ON place_gallery_images(place_id, is_primary) WHERE is_primary = true;

-- Add RLS policies
ALTER TABLE place_gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Place gallery images are viewable by everyone" 
  ON place_gallery_images FOR SELECT 
  USING (true);

-- Allow authenticated users to insert gallery images
CREATE POLICY "Authenticated users can add gallery images" 
  ON place_gallery_images FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own gallery images
CREATE POLICY "Authenticated users can update gallery images" 
  ON place_gallery_images FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete gallery images
CREATE POLICY "Authenticated users can delete gallery images" 
  ON place_gallery_images FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_place_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER place_gallery_images_updated_at
  BEFORE UPDATE ON place_gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_place_gallery_updated_at();

-- Add companion places metadata table
CREATE TABLE IF NOT EXISTS place_companions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  companion_place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  distance_meters INTEGER,
  walking_time_minutes INTEGER,
  relationship_type TEXT, -- 'before', 'after', 'nearby', 'alternative'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(place_id, companion_place_id)
);

-- Add index for companion lookups
CREATE INDEX idx_place_companions_place_id ON place_companions(place_id);
CREATE INDEX idx_place_companions_companion_id ON place_companions(companion_place_id);

-- Add RLS policies for companion places
ALTER TABLE place_companions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Place companions are viewable by everyone" 
  ON place_companions FOR SELECT 
  USING (true);

-- Add visitor metrics table for tracking place activity
CREATE TABLE IF NOT EXISTS place_visitor_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  hour INTEGER CHECK (hour >= 0 AND hour < 24),
  visitor_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('quiet', 'moderate', 'busy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(place_id, date, hour)
);

-- Add indices for metrics queries
CREATE INDEX idx_visitor_metrics_place_date ON place_visitor_metrics(place_id, date DESC);
CREATE INDEX idx_visitor_metrics_status ON place_visitor_metrics(place_id, status);

-- Add RLS policies for visitor metrics
ALTER TABLE place_visitor_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitor metrics are viewable by everyone" 
  ON place_visitor_metrics FOR SELECT 
  USING (true);

-- Migrate existing primary_image data to gallery table
INSERT INTO place_gallery_images (place_id, image_url, is_primary, display_order)
SELECT id, primary_image, true, 0
FROM places
WHERE primary_image IS NOT NULL
ON CONFLICT DO NOTHING;

-- Add quick tags to places table
ALTER TABLE places 
ADD COLUMN IF NOT EXISTS quick_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS peak_hours TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS average_daily_visitors INTEGER;

-- Add weather suitability expansion
ALTER TABLE places
ADD COLUMN IF NOT EXISTS weather_suitable_sunny BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS weather_suitable_rainy BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS weather_suitable_evening BOOLEAN DEFAULT true;

-- Create a view for enhanced place data
CREATE OR REPLACE VIEW enhanced_places AS
SELECT 
  p.*,
  COALESCE(
    ARRAY_AGG(
      DISTINCT pgi.image_url 
      ORDER BY pgi.display_order, pgi.created_at
    ) FILTER (WHERE pgi.image_url IS NOT NULL),
    ARRAY[]::TEXT[]
  ) AS gallery_images,
  COALESCE(
    ARRAY_AGG(
      DISTINCT pgi.blur_data_url 
      ORDER BY pgi.display_order, pgi.created_at
    ) FILTER (WHERE pgi.blur_data_url IS NOT NULL),
    ARRAY[]::TEXT[]
  ) AS blur_data_urls,
  (
    SELECT json_build_object(
      'daily_average', AVG(visitor_count)::INTEGER,
      'current_status', (
        SELECT status 
        FROM place_visitor_metrics pvm2 
        WHERE pvm2.place_id = p.id 
          AND pvm2.date = CURRENT_DATE 
          AND pvm2.hour = EXTRACT(HOUR FROM NOW())
        LIMIT 1
      ),
      'peak_hours', p.peak_hours
    )
    FROM place_visitor_metrics pvm
    WHERE pvm.place_id = p.id
      AND pvm.date >= CURRENT_DATE - INTERVAL '30 days'
  ) AS visitor_metrics,
  (
    SELECT json_agg(
      json_build_object(
        'id', companion_place.id,
        'name', companion_place.name,
        'distance', 
        CASE 
          WHEN pc.distance_meters < 1000 
          THEN pc.distance_meters || 'm'
          ELSE ROUND(pc.distance_meters / 1000.0, 1) || 'km'
        END
      )
    )
    FROM place_companions pc
    JOIN places companion_place ON pc.companion_place_id = companion_place.id
    WHERE pc.place_id = p.id
    LIMIT 3
  ) AS companion_places
FROM places p
LEFT JOIN place_gallery_images pgi ON p.id = pgi.place_id
GROUP BY p.id;

-- Grant access to the view
GRANT SELECT ON enhanced_places TO anon, authenticated;