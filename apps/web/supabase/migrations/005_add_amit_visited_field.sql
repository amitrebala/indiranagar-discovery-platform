-- Add has_amit_visited field to places table for Epic 6
-- This field indicates whether Amit has personally visited and verified the place

ALTER TABLE places 
ADD COLUMN has_amit_visited BOOLEAN DEFAULT false;

-- Create index for filtering visited places
CREATE INDEX idx_places_amit_visited ON places(has_amit_visited);

-- Update existing places to mark them as not visited by default
UPDATE places SET has_amit_visited = false WHERE has_amit_visited IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN places.has_amit_visited IS 'Indicates whether Amit has personally visited and verified this place';