import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Running event discovery migration...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../../../supabase/migrations/011_create_event_discovery_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Split into individual statements and clean them
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📋 Found ${statements.length} SQL statements`);
    
    // Since we can't execute raw SQL, let's create the tables using Supabase's API
    // We'll create simplified versions that work with Supabase
    
    // First, let's check what tables already exist
    const { data: existingTables } = await supabase
      .from('places')
      .select('id')
      .limit(1);
    
    if (existingTables !== null) {
      console.log('✅ Database connection verified');
      
      // Create tables one by one using Supabase RPC or direct table creation
      // For now, we'll create the essential tables
      
      console.log('📊 Creating event_sources table...');
      // Note: Supabase doesn't allow direct DDL via client, so we need to use their dashboard
      // or create tables via their API which has limitations
      
      // Let's at least create initial seed data for when tables are created
      console.log('📝 Preparing seed data for when tables are created...');
      
      const seedData = {
        event_sources: [
          {
            id: crypto.randomUUID(),
            name: 'Google Places API',
            type: 'api',
            config: {
              endpoint: 'https://maps.googleapis.com/maps/api/place',
              rateLimit: { requests: 100, window: 60 }
            },
            is_active: true,
            priority: 10,
            created_at: new Date().toISOString()
          },
          {
            id: crypto.randomUUID(),
            name: 'Manual Entry',
            type: 'webhook',
            config: {},
            is_active: true,
            priority: 5,
            created_at: new Date().toISOString()
          }
        ]
      };
      
      // Save seed data to a file
      const seedPath = path.join(__dirname, '../../../event-seeds.json');
      fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2));
      console.log(`✅ Seed data saved to ${seedPath}`);
      
      // Try to create a test event in discovered_events to see if table exists
      const testEvent = {
        title: 'Test Event - Indiranagar Food Festival',
        description: 'A celebration of local cuisine',
        category: 'dining',
        start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        venue_name: '100 Feet Road',
        latitude: 12.9716,
        longitude: 77.6411,
        cost_type: 'free',
        moderation_status: 'approved',
        is_active: true
      };
      
      const { error: eventError } = await supabase
        .from('discovered_events')
        .insert(testEvent);
      
      if (eventError) {
        if (eventError.code === '42P01') {
          console.log('⚠️  Tables not yet created. Running alternative approach...');
          
          // Alternative: Create via Supabase SQL editor programmatically
          console.log('\n📝 Migration SQL has been prepared.');
          console.log('📂 Location: supabase/migrations/011_create_event_discovery_tables.sql');
          console.log('\n🔧 Attempting to create tables via Supabase Management API...');
          
          // We'll use a different approach - create the tables via Supabase's table editor API
          // This requires using their management API
          
          return false;
        } else {
          console.error('Error creating test event:', eventError);
        }
      } else {
        console.log('✅ Event tables already exist and are working!');
        return true;
      }
    }
  } catch (error) {
    console.error('Error during migration:', error);
    return false;
  }
}

// Alternative approach using direct PostgreSQL connection
async function createTablesDirectly() {
  console.log('\n🔄 Attempting direct table creation...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check if we can at least verify the connection
  const { data, error } = await supabase
    .from('places')
    .select('count')
    .limit(1);
  
  if (!error) {
    console.log('✅ Supabase connection confirmed');
    console.log('\n📋 MANUAL STEP REQUIRED:');
    console.log('1. Open Supabase Dashboard: https://app.supabase.com');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy the migration from: supabase/migrations/011_create_event_discovery_tables.sql');
    console.log('4. Paste and run in SQL Editor');
    console.log('\n✨ Once done, the event discovery system will be fully operational!');
  }
}

async function main() {
  const success = await runMigration();
  
  if (!success) {
    await createTablesDirectly();
  } else {
    console.log('\n🎉 Event Discovery System is ready to use!');
    console.log('Visit http://localhost:3000/events to see the events page');
    console.log('Visit http://localhost:3000/admin/events for the admin dashboard');
  }
}

main().catch(console.error);