import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndAddColumn() {
  console.log('🔍 Checking if has_amit_visited column exists...')
  
  try {
    // Try to select the column
    const { data, error } = await supabase
      .from('places')
      .select('id, has_amit_visited')
      .limit(1)
    
    if (error && error.message.includes('column places.has_amit_visited does not exist')) {
      console.log('❌ Column does not exist')
      console.log('\n📋 Please run this SQL in your Supabase dashboard:')
      console.log('👉 https://supabase.com/dashboard/project/kcpontmkmfsxbdmnybpb/sql/new\n')
      console.log(`-- Add has_amit_visited field to places table
ALTER TABLE places 
ADD COLUMN has_amit_visited BOOLEAN DEFAULT false;

-- Create index for performance
CREATE INDEX idx_places_amit_visited ON places(has_amit_visited);`)
      console.log('\nThen run: npx tsx scripts/seed-amit-complete.ts')
      process.exit(1)
    } else if (error) {
      throw error
    } else {
      console.log('✅ Column already exists!')
      console.log('\nYou can now run: npx tsx scripts/seed-amit-complete.ts')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

checkAndAddColumn()