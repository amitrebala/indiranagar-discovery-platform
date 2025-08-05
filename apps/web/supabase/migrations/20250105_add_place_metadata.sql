-- Add enhanced metadata columns to places table for better image discovery
ALTER TABLE places ADD COLUMN IF NOT EXISTS brand_name VARCHAR(255);
ALTER TABLE places ADD COLUMN IF NOT EXISTS establishment_type VARCHAR(100);
ALTER TABLE places ADD COLUMN IF NOT EXISTS search_keywords TEXT[];
ALTER TABLE places ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_places_brand_name ON places(brand_name);
CREATE INDEX IF NOT EXISTS idx_places_establishment_type ON places(establishment_type);
CREATE INDEX IF NOT EXISTS idx_places_search_keywords ON places USING GIN(search_keywords);

-- Add comments for documentation
COMMENT ON COLUMN places.brand_name IS 'The brand name for chain establishments (e.g., "Corner House", "Social")';
COMMENT ON COLUMN places.establishment_type IS 'Type of establishment (e.g., "ice-cream-parlor", "metro-station", "gastropub")';
COMMENT ON COLUMN places.search_keywords IS 'Array of keywords to help with image search relevance';
COMMENT ON COLUMN places.metadata IS 'JSONB field for extensible metadata including search hints and business info';

-- Sample data updates for testing
UPDATE places SET 
  brand_name = 'Corner House',
  establishment_type = 'ice-cream-parlor',
  search_keywords = ARRAY['corner house', 'ice cream parlor', 'death by chocolate', 'sundae'],
  metadata = jsonb_build_object(
    'businessInfo', jsonb_build_object(
      'isChain', true,
      'parentBrand', 'Corner House'
    ),
    'searchHints', jsonb_build_object(
      'mustIncludeTerms', ARRAY['Corner House'],
      'avoidTerms', ARRAY['corner', 'house'],
      'locationQualifiers', ARRAY['Indiranagar', 'Bangalore']
    )
  )
WHERE name ILIKE '%Corner House%';

UPDATE places SET 
  establishment_type = 'metro-station',
  search_keywords = ARRAY['namma metro', 'purple line', 'metro station', 'indiranagar metro'],
  metadata = jsonb_build_object(
    'searchHints', jsonb_build_object(
      'mustIncludeTerms', ARRAY['Indiranagar Metro', 'Namma Metro'],
      'locationQualifiers', ARRAY['Bangalore', 'Purple Line'],
      'avoidTerms', ARRAY['delhi metro', 'mumbai metro']
    )
  )
WHERE name ILIKE '%Metro Station%';

UPDATE places SET 
  brand_name = 'Social',
  establishment_type = 'gastropub',
  search_keywords = ARRAY['social', 'gastropub', 'church street social', 'bar', 'restaurant'],
  metadata = jsonb_build_object(
    'businessInfo', jsonb_build_object(
      'isChain', true,
      'parentBrand', 'Social'
    ),
    'searchHints', jsonb_build_object(
      'mustIncludeTerms', ARRAY['Church Street Social', 'Social gastropub'],
      'locationQualifiers', ARRAY['Bangalore', 'Church Street'],
      'avoidTerms', ARRAY['church', 'street']
    )
  )
WHERE name ILIKE '%Church Street Social%';