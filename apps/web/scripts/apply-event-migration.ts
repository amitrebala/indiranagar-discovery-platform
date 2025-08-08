import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyEventMigration() {
  console.log('🚀 Applying event discovery system migration...');
  
  try {
    const migrationPath = path.join(
      __dirname,
      '../../../supabase/migrations/011_create_event_discovery_tables.sql'
    );
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚙️  Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql: statement + ';' 
      }).single();
      
      if (error) {
        if (error.message?.includes('already exists')) {
          console.log(`⚠️  Object already exists, skipping...`);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error);
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('✨ Event discovery migration completed!');
    
    console.log('\n📊 Seeding initial event sources...');
    
    const { error: sourceError } = await supabase
      .from('event_sources')
      .upsert([
        {
          name: 'Google Places API',
          type: 'api',
          config: {
            endpoint: 'https://maps.googleapis.com/maps/api/place',
            rateLimit: { requests: 100, window: 60 }
          },
          is_active: true,
          priority: 10
        }
      ], { onConflict: 'name' });
    
    if (sourceError) {
      console.error('Error seeding event sources:', sourceError);
    } else {
      console.log('✅ Event sources seeded successfully');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyEventMigration().catch(console.error);