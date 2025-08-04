-- Add metadata columns to place_images table for better tracking
ALTER TABLE place_images 
ADD COLUMN IF NOT EXISTS source VARCHAR(50),
ADD COLUMN IF NOT EXISTS attribution JSONB,
ADD COLUMN IF NOT EXISTS last_validated TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS auto_discovered BOOLEAN DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_place_images_source ON place_images(source);
CREATE INDEX IF NOT EXISTS idx_place_images_auto_discovered ON place_images(auto_discovered);

-- Add comment to explain the new columns
COMMENT ON COLUMN place_images.source IS 'Source of the image (unsplash, pexels, pixabay, manual, etc.)';
COMMENT ON COLUMN place_images.attribution IS 'JSON object containing author, source URL, license information';
COMMENT ON COLUMN place_images.last_validated IS 'Last time the image URL was validated as accessible';
COMMENT ON COLUMN place_images.auto_discovered IS 'Whether this image was automatically discovered or manually added';