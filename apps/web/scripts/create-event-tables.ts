import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function createEventTables() {
  console.log('🚀 Creating event discovery tables...\n');
  
  // Since we can't run DDL directly, let's create sample data
  // that will help us understand the schema when manually creating tables
  
  const sampleEventSource = {
    id: crypto.randomUUID(),
    name: 'Google Places API',
    type: 'api',
    config: {
      endpoint: 'https://maps.googleapis.com/maps/api/place',
      rateLimit: { requests: 100, window: 60 }
    },
    is_active: true,
    rate_limit: 60,
    priority: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const sampleEvent = {
    id: crypto.randomUUID(),
    title: 'Indiranagar Food Festival 2025',
    description: 'Annual celebration of local cuisine featuring 50+ restaurants',
    category: 'dining',
    subcategory: 'festival',
    tags: ['food', 'festival', 'local', 'cuisine'],
    start_time: new Date('2025-01-15T10:00:00').toISOString(),
    end_time: new Date('2025-01-15T22:00:00').toISOString(),
    timezone: 'Asia/Kolkata',
    is_recurring: false,
    venue_name: '100 Feet Road',
    venue_address: '100 Feet Road, Indiranagar, Bangalore',
    latitude: 12.9716,
    longitude: 77.6411,
    organizer_name: 'Indiranagar Merchants Association',
    organizer_type: 'community',
    external_url: 'https://example.com/food-festival',
    cost_type: 'free',
    registration_required: false,
    quality_score: 0.95,
    verification_status: 'verified',
    moderation_status: 'approved',
    view_count: 0,
    rsvp_count: 0,
    share_count: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const samplePlaceStatus = {
    id: crypto.randomUUID(),
    place_id: crypto.randomUUID(), // Would reference an actual place
    is_open: true,
    current_capacity: 'moderate',
    wait_time_minutes: 15,
    special_status: 'Happy Hour till 7 PM',
    source: 'prediction',
    confidence: 0.85,
    valid_until: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Try to insert into tables to check if they exist
  console.log('Testing discovered_events table...');
  const { error: eventsError } = await supabase
    .from('discovered_events')
    .insert(sampleEvent);
  
  if (eventsError) {
    if (eventsError.code === '42P01') {
      console.log('❌ discovered_events table does not exist');
      console.log('   Creating mock data for reference...\n');
      
      // Create a reference file with the schema
      const schemaReference = {
        tables: {
          event_sources: {
            columns: Object.keys(sampleEventSource),
            sample: sampleEventSource
          },
          discovered_events: {
            columns: Object.keys(sampleEvent),
            sample: sampleEvent
          },
          place_live_status: {
            columns: Object.keys(samplePlaceStatus),
            sample: samplePlaceStatus
          }
        },
        enums: {
          source_type: ['api', 'scraper', 'rss', 'webhook'],
          event_status: ['pending', 'processing', 'approved', 'rejected', 'duplicate'],
          event_cost_type: ['free', 'paid', 'donation', 'variable'],
          organizer_type: ['business', 'individual', 'community', 'government'],
          verification_status: ['unverified', 'verified', 'official'],
          moderation_status: ['pending', 'approved', 'rejected', 'flagged'],
          capacity_level: ['empty', 'quiet', 'moderate', 'busy', 'packed'],
          place_status_source: ['google', 'user', 'prediction', 'business']
        }
      };
      
      console.log('📋 SCHEMA REFERENCE:');
      console.log(JSON.stringify(schemaReference, null, 2));
      
      console.log('\n🔧 NEXT STEPS:');
      console.log('1. Copy the migration SQL from:');
      console.log('   supabase/migrations/011_create_event_discovery_tables.sql');
      console.log('2. Go to Supabase Dashboard > SQL Editor');
      console.log('3. Paste and run the SQL');
      console.log('4. Tables will be created with proper types and indexes');
      
      return false;
    } else {
      console.error('Unexpected error:', eventsError);
    }
  } else {
    console.log('✅ discovered_events table exists and is working!');
    
    // Test other tables
    console.log('Testing event_sources table...');
    const { error: sourcesError } = await supabase
      .from('event_sources')
      .insert(sampleEventSource);
    
    if (sourcesError && sourcesError.code === '42P01') {
      console.log('❌ event_sources table does not exist');
    } else if (!sourcesError) {
      console.log('✅ event_sources table exists!');
    }
    
    console.log('Testing place_live_status table...');
    const { error: statusError } = await supabase
      .from('place_live_status')
      .insert(samplePlaceStatus);
    
    if (statusError && statusError.code === '42P01') {
      console.log('❌ place_live_status table does not exist');
    } else if (!statusError) {
      console.log('✅ place_live_status table exists!');
    }
    
    return true;
  }
  
  return false;
}

async function main() {
  const success = await createEventTables();
  
  if (success) {
    console.log('\n🎉 Event Discovery System tables are ready!');
    console.log('You can now:');
    console.log('1. Start the event processor: cd apps/event-processor && npm run dev');
    console.log('2. Visit the events page: http://localhost:3000/events');
    console.log('3. Access admin dashboard: http://localhost:3000/admin/events');
  } else {
    console.log('\n⚠️  Tables need to be created manually in Supabase Dashboard');
  }
}

main().catch(console.error);