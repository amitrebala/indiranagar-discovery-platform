-- Community Features: Comments, Ratings, and Comment Likes
-- Migration for SESSION-2-COMMUNITY-FEATURES implementation

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  parent_id UUID REFERENCES comments(id),
  author_name VARCHAR(100) DEFAULT 'Anonymous',
  author_ip INET,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ratings Table  
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, ip_address)
);

-- Comment Likes Table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(comment_id, ip_address)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_entity ON ratings(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);

-- Enable RLS (Row Level Security)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for comments
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Public read/write policies for ratings
CREATE POLICY "Ratings are viewable by everyone" ON ratings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create ratings" ON ratings
  FOR INSERT WITH CHECK (true);

-- Public read/write policies for comment likes
CREATE POLICY "Comment likes are viewable by everyone" ON comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create comment likes" ON comment_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete their comment likes" ON comment_likes
  FOR DELETE USING (true);