# 4. DATABASE SCHEMA EXTENSIONS

## 4.1 New Tables Design

```sql
-- Admin Settings Table
CREATE TABLE admin_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments Table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- 'place', 'journey', 'blog'
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
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, ip_address) -- One rating per IP
);

-- Journey Tables
CREATE TABLE journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  distance_km DECIMAL(5,2),
  difficulty VARCHAR(20),
  mood_tags TEXT[],
  optimal_times JSONB,
  weather_suitability JSONB,
  estimated_cost JSONB,
  hero_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_by VARCHAR(50) DEFAULT 'amit',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE journey_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id),
  order_index INTEGER NOT NULL,
  arrival_time_offset INTEGER, -- minutes from start
  recommended_duration INTEGER, -- minutes
  stop_type VARCHAR(50),
  notes TEXT,
  activities JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Tables
CREATE TABLE page_views (
  id SERIAL PRIMARY KEY,
  page_path TEXT NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  visitor_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE search_queries (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  results_count INTEGER,
  clicked_result UUID,
  visitor_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_ratings_entity ON ratings(entity_type, entity_id);
CREATE INDEX idx_journey_stops_journey ON journey_stops(journey_id);
CREATE INDEX idx_page_views_created ON page_views(created_at);
CREATE INDEX idx_search_queries_created ON search_queries(created_at);
```

## 4.2 Database Access Pattern
```typescript
// lib/db/admin.ts
export class AdminDB {
  static async getDashboardStats() {
    const [places, pending, views] = await Promise.all([
      supabase.from('places').select('count'),
      supabase.from('comments').select('count').eq('is_flagged', true),
      supabase.from('page_views')
        .select('count')
        .gte('created_at', new Date(Date.now() - 24*60*60*1000))
    ]);
    
    return { places, pending, views };
  }
}
```

---
