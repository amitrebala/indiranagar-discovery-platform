import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
  try {
    console.log('🔍 Inspecting current schema...');

    // Test existing journeys table structure
    const { data: existingJourneys, error: journeysError } = await supabase
      .from('journeys')
      .select('*')
      .limit(1);
    
    if (journeysError) {
      console.log('❌ Journeys table error:', journeysError.message);
    } else {
      console.log('✅ Journeys table exists');
      console.log('Sample data structure:', existingJourneys);
    }

    // Test journey_stops
    const { data: existingStops, error: stopsError } = await supabase
      .from('journey_stops')
      .select('*')
      .limit(1);
    
    if (stopsError) {
      console.log('❌ Journey stops table error:', stopsError.message);
    } else {
      console.log('✅ Journey stops table exists');
      console.log('Sample data structure:', existingStops);
    }

    // Test companion_activities
    const { data: existingCompanions, error: companionsError } = await supabase
      .from('companion_activities')
      .select('*')
      .limit(1);
    
    if (companionsError) {
      console.log('❌ Companion activities table error:', companionsError.message);
    } else {
      console.log('✅ Companion activities table exists');
      console.log('Sample data structure:', existingCompanions);
    }

    // Test saved_journeys
    const { data: existingSaved, error: savedError } = await supabase
      .from('saved_journeys')
      .select('*')
      .limit(1);
    
    if (savedError) {
      console.log('❌ Saved journeys table error:', savedError.message);
    } else {
      console.log('✅ Saved journeys table exists');
      console.log('Sample data structure:', existingSaved);
    }
    
  } catch (error) {
    console.error('❌ Schema inspection failed:', error);
  }
}

inspectSchema();