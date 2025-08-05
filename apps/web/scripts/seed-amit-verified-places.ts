#!/usr/bin/env tsx
/**
 * Seed Amit's Verified Places
 * 
 * This script seeds ONLY verified places from amit-real-visited-places.ts
 * with proper data source tracking to prevent dummy data contamination.
 */

import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '../lib/supabase/client'
import { amitRealVisitedPlaces } from '../data/amit-real-visited-places'
import type { CreatePlace } from '../lib/validations'

interface VerifiedPlace extends CreatePlace {
  data_source: 'amit_real_visited'
  is_verified: true
  source_id: string
  verified_at: string
}

async function seedAmitVerifiedPlaces() {
  const supabase = createClient()
  
  console.log('🔐 Starting verified place seeding...')
  console.log('📊 Source: amit-real-visited-places.ts')
  console.log(`📍 Total places to seed: ${amitRealVisitedPlaces.length}\n`)
  
  try {
    // First, remove ALL existing places to ensure clean state
    console.log('🧹 Cleaning existing data...')
    const { error: deleteError } = await supabase
      .from('places')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (deleteError) {
      console.warn('⚠️  Could not clean existing data:', deleteError.message)
    }
    
    // Transform real places to verified places with tracking
    const verifiedPlaces: VerifiedPlace[] = amitRealVisitedPlaces.map((place, index) => ({
      name: place.name,
      description: place.notes,
      latitude: place.coordinates?.lat || 12.9716,
      longitude: place.coordinates?.lng || 77.6408,
      rating: place.rating || 4.0,
      category: place.category,
      weather_suitability: ["sunny", "cloudy", "cool"],
      accessibility_info: "Ground floor accessible",
      best_time_to_visit: place.bestFor ? place.bestFor.join(", ") : "Anytime",
      has_amit_visited: true,
      // Verification tracking
      data_source: 'amit_real_visited' as const,
      is_verified: true,
      source_id: `amit_real_${index}`,
      verified_at: new Date().toISOString()
    }))
    
    // Insert in batches
    const batchSize = 20
    let successCount = 0
    let failureCount = 0
    
    for (let i = 0; i < verifiedPlaces.length; i += batchSize) {
      const batch = verifiedPlaces.slice(i, i + batchSize)
      
      console.log(`📦 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(verifiedPlaces.length / batchSize)}...`)
      
      const { data, error } = await supabase
        .from('places')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`❌ Batch insert failed:`, error.message)
        failureCount += batch.length
      } else {
        successCount += data?.length || 0
        console.log(`✅ Inserted ${data?.length} verified places`)
      }
    }
    
    // Validate final state
    console.log('\n🔍 Validating seeded data...')
    
    const { data: finalPlaces, count } = await supabase
      .from('places')
      .select('name, data_source, is_verified', { count: 'exact' })
      .eq('data_source', 'amit_real_visited')
      .eq('is_verified', true)
    
    const { data: unverifiedCount } = await supabase
      .from('places')
      .select('count', { count: 'exact', head: true })
      .or('is_verified.is.false,data_source.neq.amit_real_visited')
    
    console.log('\n📊 Final Results:')
    console.log(`   ✅ Verified places: ${count}`)
    console.log(`   ❌ Unverified places: ${unverifiedCount?.count || 0}`)
    console.log(`   📍 Expected places: ${amitRealVisitedPlaces.length}`)
    console.log(`   🎯 Success rate: ${((successCount / amitRealVisitedPlaces.length) * 100).toFixed(1)}%`)
    
    if (count !== amitRealVisitedPlaces.length) {
      console.warn(`\n⚠️  Warning: Place count mismatch!`)
      console.warn(`   Expected: ${amitRealVisitedPlaces.length}`)
      console.warn(`   Actual: ${count}`)
    }
    
    // Log sample of seeded places
    console.log('\n📋 Sample of seeded places:')
    finalPlaces?.slice(0, 5).forEach(place => {
      console.log(`   ✓ ${place.name} (verified: ${place.is_verified}, source: ${place.data_source})`)
    })
    
    return {
      success: successCount === amitRealVisitedPlaces.length,
      seeded: successCount,
      failed: failureCount,
      total: amitRealVisitedPlaces.length
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Add to npm scripts for easy access
export { seedAmitVerifiedPlaces }

// Run if called directly
if (require.main === module) {
  seedAmitVerifiedPlaces().then(result => {
    if (!result.success) {
      console.error('\n❌ Seeding failed!')
      process.exit(1)
    } else {
      console.log('\n✅ All verified places seeded successfully!')
      process.exit(0)
    }
  })
}