-- Add external URL fields to community_events table
-- This enables events to have links to venue websites and ticket purchasing

ALTER TABLE community_events 
ADD COLUMN external_url TEXT,
ADD COLUMN ticket_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN community_events.external_url IS 'Website or details URL for the venue/event';
COMMENT ON COLUMN community_events.ticket_url IS 'URL for purchasing tickets or reservations';