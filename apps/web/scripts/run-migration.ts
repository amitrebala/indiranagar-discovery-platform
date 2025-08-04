import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🚀 Running migration to add has_amit_visited field...')
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/005_add_amit_visited_field.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
    
    console.log('📝 Migration SQL:')
    console.log(migrationSQL)
    
    // Execute the migration
    const { data, error } = await supabase
      .from('places')
      .select('has_amit_visited')
      .limit(1)
    
    if (error && error.message.includes('column places.has_amit_visited does not exist')) {
      console.log('\n🔨 Column does not exist, creating it...')
      
      // Try to run the migration through RPC
      let alterError = null
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: migrationSQL
        })
        alterError = error
      } catch (e) {
        // If RPC doesn't work, we'll need to use the Supabase dashboard
        console.log('\n⚠️  Cannot run ALTER TABLE through the API.')
        console.log('Please run this SQL in your Supabase dashboard:')
        console.log('\n' + migrationSQL)
        alterError = 'manual_required'
      }
      
      if (alterError === 'manual_required') {
        console.log('\n📋 Steps to complete:')
        console.log('1. Go to your Supabase dashboard')
        console.log('2. Navigate to the SQL Editor')
        console.log('3. Paste and run the SQL above')
        console.log('4. Then run the seed script again')
        process.exit(1)
      }
      
      if (alterError) {
        throw alterError
      }
      
      console.log('✅ Migration applied successfully!')
    } else if (!error) {
      console.log('✅ Column already exists!')
    } else {
      throw error
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('\n✅ Migration check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })