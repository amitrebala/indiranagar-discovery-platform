-- Check if journeys table already exists and create if not
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'journeys') THEN
    -- Create journeys table for curated exploration paths
    CREATE TABLE journeys (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      gradient TEXT NOT NULL,
      icon TEXT NOT NULL,
      estimated_time TEXT,
      vibe_tags TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );

    -- Create junction table for journey places
    CREATE TABLE journey_places (
      journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
      place_id UUID REFERENCES places(id) ON DELETE CASCADE,
      order_index INTEGER NOT NULL,
      notes TEXT,
      PRIMARY KEY (journey_id, place_id)
    );

    -- Create indexes
    CREATE INDEX idx_journey_places_journey_id ON journey_places(journey_id);
    CREATE INDEX idx_journey_places_order ON journey_places(journey_id, order_index);

    -- Enable RLS
    ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
    ALTER TABLE journey_places ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Journeys are viewable by everyone" ON journeys
      FOR SELECT USING (true);

    CREATE POLICY "Journey places are viewable by everyone" ON journey_places
      FOR SELECT USING (true);

    -- Insert seed data
    INSERT INTO journeys (title, description, gradient, icon, estimated_time, vibe_tags) VALUES
    ('First Timer''s Perfect Day', 'Amit''s curated 6-hour journey through must-visit spots', 'from-amber-500 to-orange-600', 'map', '6 hours', ARRAY['curious', 'explorer', 'foodie']),
    ('Local''s Secret Circuit', 'Hidden gems only 2% of visitors know about', 'from-purple-600 to-pink-600', 'compass', '4 hours', ARRAY['adventurous', 'offbeat', 'insider']),
    ('Live Like a Resident', 'Experience Amit''s actual weekly routine', 'from-teal-500 to-cyan-600', 'home', '3 hours', ARRAY['authentic', 'slow', 'mindful']);

    -- Create trigger function
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = timezone('utc'::text, now());
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Create trigger
    CREATE TRIGGER update_journeys_updated_at BEFORE UPDATE ON journeys
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    RAISE NOTICE 'Journey tables created successfully!';
  ELSE
    RAISE NOTICE 'Journey tables already exist, checking for seed data...';
    
    -- Check if we have any journeys, if not insert seed data
    IF NOT EXISTS (SELECT 1 FROM journeys LIMIT 1) THEN
      INSERT INTO journeys (title, description, gradient, icon, estimated_time, vibe_tags) VALUES
      ('First Timer''s Perfect Day', 'Amit''s curated 6-hour journey through must-visit spots', 'from-amber-500 to-orange-600', 'map', '6 hours', ARRAY['curious', 'explorer', 'foodie']),
      ('Local''s Secret Circuit', 'Hidden gems only 2% of visitors know about', 'from-purple-600 to-pink-600', 'compass', '4 hours', ARRAY['adventurous', 'offbeat', 'insider']),
      ('Live Like a Resident', 'Experience Amit''s actual weekly routine', 'from-teal-500 to-cyan-600', 'home', '3 hours', ARRAY['authentic', 'slow', 'mindful']);
      
      RAISE NOTICE 'Seed data inserted!';
    END IF;
  END IF;
END $$;