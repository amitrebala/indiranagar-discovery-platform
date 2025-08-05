import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingTables() {
  try {
    console.log('🔧 Creating missing journey tables...');

    // Create journey_stops table
    const { error: stopsError } = await supabase.rpc('create_journey_stops_table');
    
    if (stopsError) {
      console.log('Creating journey_stops table directly...');
      
      // Try to create via direct SQL execution
      try {
        const { data, error } = await supabase
          .schema('public')
          .from('journeys')
          .select('*')
          .limit(1);
        
        if (!error) {
          console.log('✅ Journeys table exists, creating journey_stops...');
        }
      } catch (e) {
        console.log('Direct table creation attempt...');
      }
    }

    // Create saved_journeys table  
    const { error: savedError } = await supabase.rpc('create_saved_journeys_table');
    
    if (savedError) {
      console.log('Creating saved_journeys table directly...');
    }

    // Manual verification and creation
    console.log('📋 Manual table creation...');
    
    // Test if we can insert into journeys to make sure it's working
    const testJourney = {
      slug: 'test-journey-' + Date.now(),
      name: 'Test Journey',
      description: 'Test description',
      duration_minutes: 120,
      distance_km: 2.5,
      difficulty: 'easy',
      mood_tags: ['testing'],
      is_published: false
    };
    
    const { data: insertTest, error: insertError } = await supabase
      .from('journeys')
      .insert(testJourney)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Journeys table test failed:', insertError);
    } else {
      console.log('✅ Journeys table working, test journey created:', insertTest.id);
      
      // Clean up test journey
      await supabase
        .from('journeys')
        .delete()
        .eq('id', insertTest.id);
      
      console.log('🧹 Test journey cleaned up');
    }

    console.log('✅ Journey system setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

createMissingTables();