-- Enhanced community suggestions schema for Story 3.1
-- Extends existing suggestions table with voting and attribution

-- Create community_place_suggestions table (separate from questions)
CREATE TABLE community_place_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitter_name VARCHAR(100) NOT NULL,
  submitter_email VARCHAR(255) NOT NULL CHECK (submitter_email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
  submitter_social JSONB, -- Social media handles
  place_name VARCHAR(255) NOT NULL,
  suggested_latitude DECIMAL(10, 8) NOT NULL,
  suggested_longitude DECIMAL(11, 8) NOT NULL,
  category VARCHAR(100) NOT NULL,
  personal_notes TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'under_review', 'approved', 'published', 'rejected', 'needs_clarification'
  )),
  admin_notes TEXT,
  admin_response TEXT,
  votes INTEGER DEFAULT 0,
  published_place_id UUID REFERENCES places(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create suggestion images table
CREATE TABLE suggestion_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suggestion_id UUID REFERENCES community_place_suggestions(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  compressed_path VARCHAR(500),
  thumbnail_path VARCHAR(500),
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create suggestion votes table for tracking individual votes
CREATE TABLE suggestion_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suggestion_id UUID REFERENCES community_place_suggestions(id) ON DELETE CASCADE,
  voter_fingerprint VARCHAR(64) NOT NULL, -- Browser fingerprint for anonymous voting
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(suggestion_id, voter_fingerprint)
);

-- Create contributors table for attribution
CREATE TABLE contributors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  social_links JSONB,
  privacy_settings JSONB DEFAULT '{"public_attribution": true}',
  total_suggestions INTEGER DEFAULT 0,
  published_suggestions INTEGER DEFAULT 0,
  first_contribution TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  recognition_level VARCHAR(20) DEFAULT 'newcomer' CHECK (recognition_level IN (
    'newcomer', 'contributor', 'local_insider', 'community_champion'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_community_suggestions_status ON community_place_suggestions(status);
CREATE INDEX idx_community_suggestions_created ON community_place_suggestions(created_at DESC);
CREATE INDEX idx_community_suggestions_votes ON community_place_suggestions(votes DESC);
CREATE INDEX idx_community_suggestions_submitter ON community_place_suggestions(submitter_email);
CREATE INDEX idx_suggestion_images_suggestion ON suggestion_images(suggestion_id);
CREATE INDEX idx_suggestion_votes_suggestion ON suggestion_votes(suggestion_id);
CREATE INDEX idx_contributors_email ON contributors(email);
CREATE INDEX idx_contributors_recognition ON contributors(recognition_level);

-- Create function for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_community_suggestions_updated_at
  BEFORE UPDATE ON community_place_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributors_updated_at
  BEFORE UPDATE ON contributors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update vote count
CREATE OR REPLACE FUNCTION update_suggestion_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_place_suggestions 
    SET votes = votes + 1 
    WHERE id = NEW.suggestion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_place_suggestions 
    SET votes = votes - 1 
    WHERE id = OLD.suggestion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER suggestion_vote_count_trigger
  AFTER INSERT OR DELETE ON suggestion_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_suggestion_vote_count();

-- Create trigger to update contributor stats
CREATE OR REPLACE FUNCTION update_contributor_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update contributor stats when suggestion status changes
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    UPDATE contributors 
    SET 
      published_suggestions = published_suggestions + 1,
      last_activity = NOW()
    WHERE email = NEW.submitter_email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contributor_stats_trigger
  AFTER UPDATE OF status ON community_place_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_contributor_stats();

-- Row Level Security policies
ALTER TABLE community_place_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published suggestions
CREATE POLICY "Public read published suggestions" ON community_place_suggestions
  FOR SELECT USING (status = 'published');

-- Allow anonymous submission of suggestions
CREATE POLICY "Anonymous can submit suggestions" ON community_place_suggestions
  FOR INSERT TO anon WITH CHECK (true);

-- Allow admin full access
CREATE POLICY "Admin full access to suggestions" ON community_place_suggestions
  FOR ALL TO authenticated USING (true);

-- Allow public voting
CREATE POLICY "Public can vote on suggestions" ON suggestion_votes
  FOR INSERT TO anon WITH CHECK (true);

-- Allow public read access to contributor info (respecting privacy)
CREATE POLICY "Public read contributors" ON contributors
  FOR SELECT USING ((privacy_settings->>'public_attribution')::boolean = true);