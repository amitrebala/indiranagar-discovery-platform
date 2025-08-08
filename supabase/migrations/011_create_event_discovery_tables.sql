-- Event source configuration
CREATE TYPE source_type AS ENUM ('api', 'scraper', 'rss', 'webhook');
CREATE TYPE event_status AS ENUM ('pending', 'processing', 'approved', 'rejected', 'duplicate');
CREATE TYPE event_cost_type AS ENUM ('free', 'paid', 'donation', 'variable');
CREATE TYPE organizer_type AS ENUM ('business', 'individual', 'community', 'government');
CREATE TYPE verification_status AS ENUM ('unverified', 'verified', 'official');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE fetch_status AS ENUM ('success', 'partial', 'failed');
CREATE TYPE capacity_level AS ENUM ('empty', 'quiet', 'moderate', 'busy', 'packed');
CREATE TYPE place_status_source AS ENUM ('google', 'user', 'prediction', 'business');

CREATE TABLE IF NOT EXISTS event_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type source_type NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    rate_limit INTEGER DEFAULT 60,
    last_fetched_at TIMESTAMPTZ,
    priority INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw event data staging
CREATE TABLE IF NOT EXISTS events_staging (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES event_sources(id),
    external_id VARCHAR(255),
    raw_data JSONB NOT NULL,
    processed_data JSONB,
    status event_status DEFAULT 'pending',
    duplicate_of UUID REFERENCES events_staging(id),
    confidence_score DECIMAL(3,2),
    extraction_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_staging_status ON events_staging(status);
CREATE INDEX idx_staging_external ON events_staging(source_id, external_id);

-- Processed events
CREATE TABLE IF NOT EXISTS discovered_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staging_id UUID REFERENCES events_staging(id),
    source_id UUID REFERENCES event_sources(id),
    
    -- Core event data
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    tags TEXT[],
    
    -- Temporal data
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule JSONB,
    
    -- Location data
    venue_name VARCHAR(255),
    venue_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    plus_code VARCHAR(20),
    google_place_id VARCHAR(255),
    
    -- Organizer data
    organizer_name VARCHAR(255),
    organizer_type organizer_type,
    contact_info JSONB,
    
    -- Metadata
    external_url TEXT,
    ticket_url TEXT,
    cost_type event_cost_type,
    price_range JSONB,
    capacity INTEGER,
    registration_required BOOLEAN DEFAULT false,
    
    -- Quality & moderation
    quality_score DECIMAL(3,2),
    verification_status verification_status DEFAULT 'unverified',
    moderation_status moderation_status DEFAULT 'pending',
    moderation_notes TEXT,
    moderated_by UUID,
    moderated_at TIMESTAMPTZ,
    
    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    rsvp_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- System fields
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE INDEX idx_events_temporal ON discovered_events(start_time, end_time);
CREATE INDEX idx_events_geo ON discovered_events(latitude, longitude);
CREATE INDEX idx_events_category ON discovered_events(category, subcategory);
CREATE INDEX idx_events_status ON discovered_events(moderation_status, is_active);

-- Event images
CREATE TABLE IF NOT EXISTS event_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES discovered_events(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    source_url TEXT,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deduplication tracking
CREATE TABLE IF NOT EXISTS event_duplicates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_event_id UUID REFERENCES discovered_events(id),
    duplicate_event_id UUID REFERENCES events_staging(id),
    similarity_score DECIMAL(3,2),
    match_fields JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_duplicates_primary ON event_duplicates(primary_event_id);

-- Source fetch history
CREATE TABLE IF NOT EXISTS fetch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES event_sources(id),
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status fetch_status NOT NULL,
    events_found INTEGER DEFAULT 0,
    events_processed INTEGER DEFAULT 0,
    events_approved INTEGER DEFAULT 0,
    error_details JSONB,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time place status
CREATE TABLE IF NOT EXISTS place_live_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES places(id),
    is_open BOOLEAN,
    current_capacity capacity_level,
    wait_time_minutes INTEGER,
    special_status TEXT,
    source place_status_source DEFAULT 'prediction',
    confidence DECIMAL(3,2),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_place_status ON place_live_status(place_id, valid_until);

-- User preferences for notifications
CREATE TABLE IF NOT EXISTS user_event_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    categories TEXT[],
    keywords TEXT[],
    preferred_days VARCHAR(10)[],
    preferred_times JSONB,
    max_distance_km INTEGER DEFAULT 5,
    price_range JSONB,
    notification_channels JSONB DEFAULT '{"push": true, "email": false}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_events_fulltext ON discovered_events 
USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

CREATE INDEX idx_events_date_range ON discovered_events(start_time, end_time)
WHERE is_active = true AND moderation_status = 'approved';

-- Materialized view for trending events
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_events AS
SELECT 
    e.*,
    (e.view_count * 0.3 + e.rsvp_count * 0.5 + e.share_count * 0.2) as popularity_score
FROM discovered_events e
WHERE 
    e.start_time > NOW() 
    AND e.start_time < NOW() + INTERVAL '7 days'
    AND e.moderation_status = 'approved'
    AND e.is_active = true
ORDER BY popularity_score DESC
LIMIT 100;

CREATE INDEX idx_trending_popularity ON trending_events(popularity_score);