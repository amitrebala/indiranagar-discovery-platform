-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Enforce single row
  site_name VARCHAR(255) DEFAULT 'Indiranagar Discovery Platform',
  site_description TEXT,
  contact_email VARCHAR(255),
  maintenance_mode BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  allow_ratings BOOLEAN DEFAULT true,
  weather_enabled BOOLEAN DEFAULT true,
  analytics_enabled BOOLEAN DEFAULT true,
  max_upload_size INTEGER DEFAULT 5242880,
  default_map_center JSONB DEFAULT '{"lat": 12.9716, "lng": 77.5946}',
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write settings
CREATE POLICY "Admin can manage settings" ON site_settings
  FOR ALL USING (true);