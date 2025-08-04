-- Community Events Schema for Story 3.2
-- Comprehensive event coordination and management system

-- Create events table
CREATE TABLE community_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'food_festival', 'market', 'cultural_event', 'running_group', 'meetup', 'workshop', 'other'
  )),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location_name VARCHAR(255) NOT NULL,
  location_address TEXT NOT NULL,
  location_latitude DECIMAL(10, 8) NOT NULL,
  location_longitude DECIMAL(11, 8) NOT NULL,
  venue_type VARCHAR(20) DEFAULT 'indoor' CHECK (venue_type IN ('indoor', 'outdoor', 'hybrid')),
  
  -- Organizer information
  organizer_name VARCHAR(100) NOT NULL,
  organizer_email VARCHAR(255) NOT NULL,
  organizer_phone VARCHAR(20),
  organizer_social JSONB,
  
  -- Event details
  capacity INTEGER,
  cost_type VARCHAR(20) DEFAULT 'free' CHECK (cost_type IN ('free', 'paid', 'donation')),
  cost_amount DECIMAL(10, 2),
  cost_currency VARCHAR(3) DEFAULT 'INR',
  
  -- Status and workflow
  status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'approved', 'published', 'cancelled', 'completed', 'rejected'
  )),
  
  -- Recurring events
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB, -- {type: 'weekly', interval: 1, days: ['monday'], until: '2024-12-31'}
  parent_event_id UUID REFERENCES community_events(id),
  
  -- Curator features
  curator_endorsed BOOLEAN DEFAULT false,
  curator_comments TEXT,
  curator_rating INTEGER CHECK (curator_rating >= 1 AND curator_rating <= 5),
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  rsvp_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event images table
CREATE TABLE event_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event RSVPs table
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
  attendee_name VARCHAR(100) NOT NULL,
  attendee_email VARCHAR(255) NOT NULL,
  attendee_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going', 'waitlist')),
  guest_count INTEGER DEFAULT 0,
  dietary_requirements TEXT,
  accessibility_needs TEXT,
  notes TEXT,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, attendee_email)
);

-- Create event discussions table
CREATE TABLE event_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  parent_id UUID REFERENCES event_discussions(id), -- For threaded discussions
  is_pinned BOOLEAN DEFAULT false,
  is_organizer_message BOOLEAN DEFAULT false,
  attachments JSONB, -- Array of file paths
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event categories table for dynamic categorization
CREATE TABLE event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  color_code VARCHAR(7) NOT NULL, -- Hex color for UI
  icon_name VARCHAR(50), -- Icon identifier
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notification preferences table
CREATE TABLE event_notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR(255) NOT NULL,
  categories JSONB NOT NULL DEFAULT '[]', -- Array of subscribed categories
  location_radius INTEGER DEFAULT 5, -- km radius from Indiranagar
  advance_notice_hours INTEGER DEFAULT 24,
  digest_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (digest_frequency IN ('daily', 'weekly', 'monthly', 'none')),
  push_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_email)
);

-- Insert default event categories
INSERT INTO event_categories (name, display_name, description, color_code, icon_name, sort_order) VALUES
('food_festival', 'Food Festivals', 'Culinary events and food celebrations', '#E74C3C', 'utensils', 1),
('market', 'Markets', 'Local markets and pop-up shops', '#F39C12', 'shopping-bag', 2),
('cultural_event', 'Cultural Events', 'Art exhibitions, music, and cultural activities', '#9B59B6', 'palette', 3),
('running_group', 'Running Groups', 'Fitness activities and running meetups', '#2ECC71', 'activity', 4),
('meetup', 'Community Meetups', 'Social gatherings and networking events', '#3498DB', 'users', 5),
('workshop', 'Workshops', 'Learning sessions and skill-building events', '#34495E', 'book-open', 6);

-- Create indexes for performance
CREATE INDEX idx_events_category ON community_events(category);
CREATE INDEX idx_events_start_time ON community_events(start_time);
CREATE INDEX idx_events_status ON community_events(status);
CREATE INDEX idx_events_location ON community_events(location_latitude, location_longitude);
CREATE INDEX idx_events_curator_endorsed ON community_events(curator_endorsed) WHERE curator_endorsed = true;
CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_status ON event_rsvps(status);
CREATE INDEX idx_event_discussions_event ON event_discussions(event_id);
CREATE INDEX idx_event_discussions_parent ON event_discussions(parent_id) WHERE parent_id IS NOT NULL;

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON community_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at
  BEFORE UPDATE ON event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update RSVP count
CREATE OR REPLACE FUNCTION update_event_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'going' THEN
    UPDATE community_events 
    SET rsvp_count = rsvp_count + 1 + COALESCE(NEW.guest_count, 0)
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.status != NEW.status THEN
      -- Remove old count
      IF OLD.status = 'going' THEN
        UPDATE community_events 
        SET rsvp_count = rsvp_count - 1 - COALESCE(OLD.guest_count, 0)
        WHERE id = NEW.event_id;
      END IF;
      -- Add new count
      IF NEW.status = 'going' THEN
        UPDATE community_events 
        SET rsvp_count = rsvp_count + 1 + COALESCE(NEW.guest_count, 0)
        WHERE id = NEW.event_id;
      END IF;
    -- Handle guest count changes
    ELSIF OLD.guest_count != NEW.guest_count AND NEW.status = 'going' THEN
      UPDATE community_events 
      SET rsvp_count = rsvp_count + (COALESCE(NEW.guest_count, 0) - COALESCE(OLD.guest_count, 0))
      WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'going' THEN
    UPDATE community_events 
    SET rsvp_count = rsvp_count - 1 - COALESCE(OLD.guest_count, 0)
    WHERE id = OLD.event_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_rsvp_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_event_rsvp_count();

-- Row Level Security
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Public read access to published events
CREATE POLICY "Public read published events" ON community_events
  FOR SELECT USING (status = 'published');

-- Anonymous can submit events
CREATE POLICY "Anonymous can submit events" ON community_events
  FOR INSERT TO anon WITH CHECK (status = 'submitted');

-- Admin full access
CREATE POLICY "Admin full access to events" ON community_events
  FOR ALL TO authenticated USING (true);

-- Public can RSVP to published events
CREATE POLICY "Public RSVP to published events" ON event_rsvps
  FOR INSERT TO anon WITH CHECK (
    EXISTS(
      SELECT 1 FROM community_events 
      WHERE id = event_rsvps.event_id AND status = 'published'
    )
  );

-- Users can update their own RSVPs
CREATE POLICY "Users can update own RSVPs" ON event_rsvps
  FOR UPDATE TO anon USING (attendee_email = current_setting('request.jwt.claim.email', true));

-- Public can view discussions for published events
CREATE POLICY "Public read event discussions" ON event_discussions
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM community_events 
      WHERE id = event_discussions.event_id AND status = 'published'
    )
  );

-- Public can add discussions to published events
CREATE POLICY "Public add event discussions" ON event_discussions
  FOR INSERT TO anon WITH CHECK (
    EXISTS(
      SELECT 1 FROM community_events 
      WHERE id = event_discussions.event_id AND status = 'published'
    )
  );