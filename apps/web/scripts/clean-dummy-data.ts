#!/usr/bin/env tsx
/**
 * Clean Dummy Data Script
 * 
 * This script permanently removes all dummy data from the database
 * and ensures only Amit's real visited places remain.
 */

import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '../lib/supabase/client'
import { amitRealVisitedPlaces } from '../data/amit-real-visited-places'

// List of known dummy place names that should NOT exist
const KNOWN_DUMMY_PLACES = [
  'The Yoga Room',
  'Karavalli',
  'Toit Brewpub', // If this isn't in real data
  'Gallery Sumukha',
  'Phoenix MarketCity',
  'Cubbon Park',
  'Commercial Street',
  'Vidhana Soudha'
]

async function cleanDummyData() {
  const supabase = createClient()
  
  console.log('🧹 Starting dummy data cleanup...\n')
  
  try {
    // Step 1: Get all current places from database
    const { data: allPlaces, error: fetchError } = await supabase
      .from('places')
      .select('id, name, created_at')
      .order('name')
    
    if (fetchError) {
      throw new Error(`Failed to fetch places: ${fetchError.message}`)
    }
    
    console.log(`📊 Found ${allPlaces?.length || 0} total places in database\n`)
    
    // Step 2: Create a Set of valid place names from real data
    const validPlaceNames = new Set(amitRealVisitedPlaces.map(p => p.name.toLowerCase().trim()))
    
    // Step 3: Identify places to delete
    const placesToDelete: typeof allPlaces = []
    const placesToKeep: typeof allPlaces = []
    
    for (const place of allPlaces || []) {
      const normalizedName = place.name.toLowerCase().trim()
      
      // Check if it's a known dummy place OR not in our real data
      if (KNOWN_DUMMY_PLACES.some(dummy => 
        normalizedName.includes(dummy.toLowerCase())
      ) || !validPlaceNames.has(normalizedName)) {
        placesToDelete.push(place)
      } else {
        placesToKeep.push(place)
      }
    }
    
    console.log(`🔍 Analysis Results:`)
    console.log(`   ✅ Valid places to keep: ${placesToKeep.length}`)
    console.log(`   ❌ Dummy places to delete: ${placesToDelete.length}\n`)
    
    if (placesToDelete.length > 0) {
      console.log('🗑️  Places to be deleted:')
      placesToDelete.forEach(place => {
        console.log(`   - ${place.name} (created: ${new Date(place.created_at).toLocaleDateString()})`)
      })
      console.log('')
      
      // Step 4: Delete dummy places (CASCADE will handle related records)
      console.log('🔥 Deleting dummy places...')
      
      for (const place of placesToDelete) {
        const { error: deleteError } = await supabase
          .from('places')
          .delete()
          .eq('id', place.id)
        
        if (deleteError) {
          console.error(`   ❌ Failed to delete "${place.name}": ${deleteError.message}`)
        } else {
          console.log(`   ✅ Deleted "${place.name}"`)
        }
      }
    }
    
    // Step 5: Verify final state
    console.log('\n📊 Verifying final state...')
    
    const { count: finalCount } = await supabase
      .from('places')
      .select('*', { count: 'exact', head: true })
    
    const { data: remainingPlaces } = await supabase
      .from('places')
      .select('name')
      .order('name')
    
    console.log(`\n✨ Cleanup Complete!`)
    console.log(`   Total places in database: ${finalCount}`)
    console.log(`   Expected real places: ${amitRealVisitedPlaces.length}`)
    
    // Step 6: Show any discrepancies
    if (finalCount !== amitRealVisitedPlaces.length) {
      console.log(`\n⚠️  Warning: Place count mismatch!`)
      
      // Find missing places
      const dbPlaceNames = new Set((remainingPlaces || []).map(p => p.name.toLowerCase().trim()))
      const missingInDb = amitRealVisitedPlaces.filter(p => 
        !dbPlaceNames.has(p.name.toLowerCase().trim())
      )
      
      if (missingInDb.length > 0) {
        console.log(`\n📍 Places in real data but missing from database:`)
        missingInDb.forEach(p => console.log(`   - ${p.name}`))
        console.log(`\n💡 Run 'npm run seed:amit-places' to add missing places`)
      }
    }
    
    return {
      success: true,
      deleted: placesToDelete.length,
      remaining: finalCount
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Add a verification function
async function verifyNoMoreDummies() {
  const supabase = createClient()
  
  console.log('\n🔍 Running verification check...')
  
  // Check for any known dummy names
  for (const dummyName of KNOWN_DUMMY_PLACES) {
    const { data, error } = await supabase
      .from('places')
      .select('name')
      .ilike('name', `%${dummyName}%`)
    
    if (!error && data && data.length > 0) {
      console.log(`   ⚠️  Found dummy place: "${data[0].name}"`)
    }
  }
  
  console.log('✅ Verification complete')
}

// Run the cleanup
if (require.main === module) {
  cleanDummyData().then(async (result) => {
    if (result.success) {
      await verifyNoMoreDummies()
    }
    process.exit(result.success ? 0 : 1)
  })
}

export { cleanDummyData, verifyNoMoreDummies }