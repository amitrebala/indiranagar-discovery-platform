import { createClient } from '../lib/supabase/client'
import type { CreatePlace, CreateCompanionActivity } from '../lib/validations'
import { amitRealVisitedPlaces } from '../data/amit-real-visited-places'

// Convert Amit's real visited places to CreatePlace format
const SAMPLE_PLACES: CreatePlace[] = amitRealVisitedPlaces.map(place => ({
  name: place.name,
  description: place.notes,
  latitude: place.coordinates?.lat || 12.9716, // Default to Indiranagar center
  longitude: place.coordinates?.lng || 77.6408,
  rating: place.rating || 4.0,
  category: place.category,
  weather_suitability: ["sunny", "cloudy", "cool"], // Default values
  accessibility_info: "Ground floor accessible",
  best_time_to_visit: place.bestFor ? place.bestFor.join(", ") : "Anytime",
  has_amit_visited: true
}))

// Sample companion activities
const SAMPLE_ACTIVITIES: Omit<CreateCompanionActivity, 'place_id'>[] = [
  {
    activity_type: "before",
    name: "Explore nearby cafes",
    description: "Discover local coffee culture and small eateries",
    timing_minutes: 30,
    weather_dependent: false
  },
  {
    activity_type: "after",
    name: "Walk around the area",
    description: "Take a leisurely stroll to explore the neighborhood",
    timing_minutes: 20,
    weather_dependent: true
  },
  {
    activity_type: "before",
    name: "Visit local shops",
    description: "Browse nearby retail stores and local businesses",
    timing_minutes: 45,
    weather_dependent: false
  }
]

async function seedDatabase() {
  const supabase = createClient()
  
  console.log('🌱 Starting database seeding with Amit\'s real visited places...')
  
  try {
    // Clear existing data (for development)
    console.log('🧹 Clearing existing data...')
    await supabase.from('companion_activities').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('place_images').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('places').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Insert places
    console.log('📍 Inserting places...')
    const { data: places, error: placesError } = await supabase
      .from('places')
      .insert(SAMPLE_PLACES)
      .select()
    
    if (placesError) {
      throw new Error(`Failed to insert places: ${placesError.message}`)
    }
    
    console.log(`✅ Inserted ${places?.length} places`)
    
    // Insert companion activities for each place
    console.log('🎯 Inserting companion activities...')
    let totalActivities = 0
    
    for (const place of places || []) {
      const activities = SAMPLE_ACTIVITIES.map(activity => ({
        ...activity,
        place_id: place.id
      }))
      
      const { error: activitiesError } = await supabase
        .from('companion_activities')
        .insert(activities)
      
      if (activitiesError) {
        console.warn(`⚠️ Failed to insert activities for ${place.name}: ${activitiesError.message}`)
      } else {
        totalActivities += activities.length
      }
    }
    
    console.log(`✅ Inserted ${totalActivities} companion activities`)
    
    // Summary
    console.log('\n🎉 Database seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   • Places: ${places?.length || 0}`)
    console.log(`   • Activities: ${totalActivities}`)
    console.log(`   • Ready for content management testing`)
    
    return {
      success: true,
      places: places?.length || 0,
      activities: totalActivities
    }
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Validation function for seeded data
export async function validateSeededData() {
  const supabase = createClient()
  
  try {
    // Check places count
    const { count: placesCount, error: placesError } = await supabase
      .from('places')
      .select('*', { count: 'exact', head: true })
    
    if (placesError) throw placesError
    
    // Check activities count
    const { count: activitiesCount, error: activitiesError } = await supabase
      .from('companion_activities')
      .select('*', { count: 'exact', head: true })
    
    if (activitiesError) throw activitiesError
    
    // Check coordinate boundaries
    const { data: outOfBounds, error: boundsError } = await supabase
      .from('places')
      .select('name, latitude, longitude')
      .or('latitude.lt.12.95,latitude.gt.13.00,longitude.lt.77.58,longitude.gt.77.65')
    
    if (boundsError) throw boundsError
    
    console.log('📊 Data Validation Results:')
    console.log(`   • Total places: ${placesCount}`)
    console.log(`   • Total activities: ${activitiesCount}`)
    console.log(`   • Places outside boundaries: ${outOfBounds?.length || 0}`)
    
    if (outOfBounds && outOfBounds.length > 0) {
      console.warn('⚠️ Places outside Indiranagar boundaries:', outOfBounds)
    }
    
    return {
      valid: (outOfBounds?.length || 0) === 0,
      placesCount,
      activitiesCount,
      outOfBounds
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error)
    return { valid: false, error }
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().then(result => {
    process.exit(result.success ? 0 : 1)
  })
}

export { seedDatabase }