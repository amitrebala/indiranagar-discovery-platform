import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

async function runMigration() {
  console.log('🚀 Running direct event discovery migration...');
  
  // Use psql directly if available, otherwise manual table creation
  const migrations = [
    // Create ENUMs first
    `DO $$ BEGIN
      CREATE TYPE source_type AS ENUM ('api', 'scraper', 'rss', 'webhook');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    
    `DO $$ BEGIN
      CREATE TYPE event_status AS ENUM ('pending', 'processing', 'approved', 'rejected', 'duplicate');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    
    `DO $$ BEGIN
      CREATE TYPE event_cost_type AS ENUM ('free', 'paid', 'donation', 'variable');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    
    `DO $$ BEGIN
      CREATE TYPE organizer_type AS ENUM ('business', 'individual', 'community', 'government');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    
    `DO $$ BEGIN
      CREATE TYPE verification_status AS ENUM ('unverified', 'verified', 'official');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    
    `DO $$ BEGIN
      CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    
    `DO $$ BEGIN
      CREATE TYPE fetch_status AS ENUM ('success', 'partial', 'failed');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    
    `DO $$ BEGIN
      CREATE TYPE capacity_level AS ENUM ('empty', 'quiet', 'moderate', 'busy', 'packed');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    
    `DO $$ BEGIN
      CREATE TYPE place_status_source AS ENUM ('google', 'user', 'prediction', 'business');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`
  ];

  // Since we can't execute raw SQL via Supabase client, let's use the database URL directly
  // For now, we'll create simplified tables using Supabase's table creation
  
  console.log('📊 Creating event tables via Supabase dashboard is recommended');
  console.log('Alternative: Use the SQL editor in Supabase dashboard with the migration file');
  console.log('Migration file: supabase/migrations/011_create_event_discovery_tables.sql');
  
  // Let's at least seed the initial data that we can
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check if we can access existing tables
  const { error: placesError } = await supabase
    .from('places')
    .select('id')
    .limit(1);
  
  if (!placesError) {
    console.log('✅ Database connection verified');
    console.log('ℹ️  Please run the migration SQL in Supabase dashboard SQL editor');
    console.log('📁 File: /supabase/migrations/011_create_event_discovery_tables.sql');
  } else {
    console.error('❌ Cannot connect to database:', placesError);
  }
}

runMigration().catch(console.error);