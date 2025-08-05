-- Add data source tracking to prevent dummy data
-- This migration adds columns to track where data came from

-- Add source tracking columns to places table
ALTER TABLE places 
ADD COLUMN IF NOT EXISTS data_source VARCHAR(50) DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS source_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Create an enum for data sources
DO $$ BEGIN
  CREATE TYPE data_source_type AS ENUM (
    'amit_real_visited',    -- From amit-real-visited-places.ts
    'user_suggestion',      -- From community suggestions
    'admin_added',          -- Added by admin
    'migration',            -- From old data migration
    'seed_script',          -- From seed scripts
    'unknown'               -- Unknown source
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update the column to use the enum
ALTER TABLE places 
ALTER COLUMN data_source TYPE data_source_type 
USING data_source::data_source_type;

-- Create index for data source queries
CREATE INDEX IF NOT EXISTS idx_places_data_source ON places(data_source);
CREATE INDEX IF NOT EXISTS idx_places_is_verified ON places(is_verified);

-- Add constraint to ensure only verified amit places
ALTER TABLE places
ADD CONSTRAINT chk_amit_visited_verified 
CHECK (
  (has_amit_visited = false) OR 
  (has_amit_visited = true AND is_verified = true AND data_source = 'amit_real_visited')
);

-- Update existing places to mark them as unverified
UPDATE places 
SET 
  data_source = 'unknown',
  is_verified = false
WHERE data_source IS NULL;

-- Create audit log table for data changes
CREATE TABLE IF NOT EXISTS place_data_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  old_data JSONB,
  new_data JSONB,
  reason TEXT
);

-- Create trigger to audit place changes
CREATE OR REPLACE FUNCTION audit_place_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO place_data_audit(place_id, action, new_data)
    VALUES (NEW.id, 'INSERT', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO place_data_audit(place_id, action, old_data, new_data)
    VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO place_data_audit(place_id, action, old_data)
    VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON places
FOR EACH ROW EXECUTE FUNCTION audit_place_changes();

-- Add comment explaining the verification system
COMMENT ON COLUMN places.data_source IS 'Source of this place data - only amit_real_visited is trusted for has_amit_visited=true';
COMMENT ON COLUMN places.is_verified IS 'Whether this place has been verified as actually visited by Amit';
COMMENT ON COLUMN places.source_id IS 'ID from the source system (e.g., array index from amit-real-visited-places.ts)';
COMMENT ON CONSTRAINT chk_amit_visited_verified ON places IS 'Ensures only verified places from amit_real_visited source can be marked as visited by Amit';