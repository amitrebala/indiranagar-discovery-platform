-- Create suggestions table for community questions
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL CHECK (length(question) >= 10 AND length(question) <= 1000),
  location VARCHAR(200),
  contact_name VARCHAR(100) NOT NULL,
  contact_email VARCHAR(255) NOT NULL CHECK (contact_email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
  contact_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'answered', 'archived')),
  response TEXT,
  responded_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_submitted_at ON suggestions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_contact_email ON suggestions(contact_email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER suggestions_updated_at
  BEFORE UPDATE ON suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_suggestions_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert suggestions
CREATE POLICY "Allow anonymous insert" ON suggestions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only authenticated users (Amit) can read/update suggestions
CREATE POLICY "Authenticated users can view all" ON suggestions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update" ON suggestions
  FOR UPDATE TO authenticated
  USING (true);

-- Create comments for documentation
COMMENT ON TABLE suggestions IS 'Community questions and suggestions submitted through the "Has Amit Been Here?" feature';
COMMENT ON COLUMN suggestions.question IS 'The main question or suggestion from the user';
COMMENT ON COLUMN suggestions.location IS 'Optional location context for the question';
COMMENT ON COLUMN suggestions.status IS 'Current status: new, in_progress, answered, archived';
COMMENT ON COLUMN suggestions.response IS 'Amit''s response to the question';
COMMENT ON COLUMN suggestions.ip_address IS 'IP address for rate limiting and spam prevention';