import { createClient } from '@supabase/supabase-js'
import { AMIT_COMPLETE_PLACES } from '../data/amit-places-complete'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedAmitPlaces() {
  console.log('🌱 Starting to seed Amit\'s 186 visited places...')
  
  try {
    // First, clear existing places with has_amit_visited = true
    console.log('🧹 Clearing existing Amit-visited places...')
    const { error: deleteError } = await supabase
      .from('places')
      .delete()
      .eq('has_amit_visited', true)
    
    if (deleteError) {
      console.error('Error clearing existing places:', deleteError)
    }
    
    // Insert places in batches of 20 to avoid timeout
    const batchSize = 20
    let totalInserted = 0
    
    for (let i = 0; i < AMIT_COMPLETE_PLACES.length; i += batchSize) {
      const batch = AMIT_COMPLETE_PLACES.slice(i, i + batchSize)
      
      console.log(`📍 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(AMIT_COMPLETE_PLACES.length / batchSize)}...`)
      
      const { data, error } = await supabase
        .from('places')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`❌ Error inserting batch starting at index ${i}:`, error)
        console.error('Failed batch:', batch.map(p => p.name))
        continue
      }
      
      totalInserted += data?.length || 0
      console.log(`✅ Inserted ${data?.length} places (Total: ${totalInserted}/${AMIT_COMPLETE_PLACES.length})`)
    }
    
    // Verify the total count
    const { count, error: countError } = await supabase
      .from('places')
      .select('*', { count: 'exact', head: true })
      .eq('has_amit_visited', true)
    
    if (countError) {
      console.error('Error counting places:', countError)
    } else {
      console.log(`\n🎉 Success! Total Amit-visited places in database: ${count}`)
    }
    
    // Show a few sample places
    const { data: samples } = await supabase
      .from('places')
      .select('name, category, rating')
      .eq('has_amit_visited', true)
      .limit(5)
    
    console.log('\n📋 Sample places:')
    samples?.forEach(place => {
      console.log(`   - ${place.name} (${place.category}) - ${place.rating}★`)
    })
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding
seedAmitPlaces()
  .then(() => {
    console.log('\n✅ Seeding completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  })