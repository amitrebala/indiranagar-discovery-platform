import { createClient } from '@supabase/supabase-js'
import { amitRealVisitedPlaces } from '../data/amit-real-visited-places'
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

async function auditDatabasePlaces() {
  console.log('🔍 Auditing all places in database...\n')
  
  try {
    // Get all places from database
    const { data: dbPlaces, error } = await supabase
      .from('places')
      .select('name, has_amit_visited')
      .order('name')
    
    if (error) {
      console.error('Error fetching places:', error)
      return
    }
    
    // Get all place names from amit-real-visited-places.ts
    const codebaseNames = new Set(amitRealVisitedPlaces.map(p => p.name.toLowerCase()))
    
    // Find places in DB but not in codebase
    const notInCodebase = dbPlaces?.filter(place => 
      !codebaseNames.has(place.name.toLowerCase())
    ) || []
    
    // Find places in codebase but not in DB
    const dbNames = new Set((dbPlaces || []).map(p => p.name.toLowerCase()))
    const notInDB = amitRealVisitedPlaces.filter(place =>
      !dbNames.has(place.name.toLowerCase())
    )
    
    console.log('📊 AUDIT RESULTS:\n')
    
    console.log(`Total places in database: ${dbPlaces?.length || 0}`)
    console.log(`Total places in codebase: ${amitRealVisitedPlaces.length}`)
    console.log(`Places in DB but NOT in codebase: ${notInCodebase.length}`)
    console.log(`Places in codebase but NOT in DB: ${notInDB.length}`)
    
    if (notInCodebase.length > 0) {
      console.log('\n❌ PLACES IN DATABASE BUT NOT IN YOUR 141-PLACE LIST:')
      console.log('(These need to be removed from DB or added to your list)\n')
      notInCodebase.forEach((place, index) => {
        console.log(`${index + 1}. [ ] ${place.name} (has_amit_visited: ${place.has_amit_visited})`)
      })
    }
    
    if (notInDB.length > 0) {
      console.log('\n⚠️  PLACES IN YOUR LIST BUT NOT IN DATABASE:')
      console.log('(These should be added to the database)\n')
      notInDB.forEach((place, index) => {
        console.log(`${index + 1}. ${place.name}`)
      })
    }
    
    if (notInCodebase.length === 0 && notInDB.length === 0) {
      console.log('\n✅ Database and codebase are in sync!')
    }
    
  } catch (error) {
    console.error('❌ Audit failed:', error)
  }
}

// Run the audit
auditDatabasePlaces()