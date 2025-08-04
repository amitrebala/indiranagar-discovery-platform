import { createClient } from '../lib/supabase/client'
import type { CreatePlace, CreateCompanionActivity } from '../lib/validations'

// Sample Indiranagar places data for seeding
const SAMPLE_PLACES: CreatePlace[] = [
  {
    name: "Toit Brewpub",
    description: "Popular craft brewery and restaurant known for its microbrews and wood-fired pizzas. Great atmosphere with indoor and outdoor seating.",
    latitude: 12.9716,
    longitude: 77.6412,
    rating: 4.3,
    category: "Restaurant & Bar",
    weather_suitability: ["sunny", "cloudy", "cool"],
    accessibility_info: "Ground floor accessible, limited parking",
    best_time_to_visit: "Evening 6-10 PM"
  },
  {
    name: "Phoenix MarketCity",
    description: "Large shopping mall with retail stores, food court, and entertainment options. One of Bangalore's premier shopping destinations.",
    latitude: 12.9698,
    longitude: 77.6469,
    rating: 4.1,
    category: "Shopping Mall",
    weather_suitability: ["rainy", "hot", "humid"],
    accessibility_info: "Fully wheelchair accessible, ample parking",
    best_time_to_visit: "Weekdays 11 AM - 2 PM"
  },
  {
    name: "Cubbon Park",
    description: "Historic park in the heart of Bangalore, perfect for morning walks, jogging, and relaxation. Beautiful colonial architecture nearby.",
    latitude: 12.9698,
    longitude: 77.6388,
    rating: 4.5,
    category: "Park & Recreation",
    weather_suitability: ["sunny", "cool", "cloudy"],
    accessibility_info: "Multiple entry points, some paved paths",
    best_time_to_visit: "Early morning 6-9 AM"
  },
  {
    name: "Commercial Street",
    description: "Famous shopping street with local stores, street food, and traditional markets. Great for bargain shopping and local experience.",
    latitude: 12.9716,
    longitude: 77.6093,
    rating: 4.0,
    category: "Shopping Street",
    weather_suitability: ["sunny", "cloudy"],
    accessibility_info: "Crowded pedestrian area, limited vehicle access",
    best_time_to_visit: "Afternoon 2-6 PM"
  },
  {
    name: "Vidhana Soudha",
    description: "Iconic government building and architectural landmark. Symbol of Bangalore with beautiful Dravidian architecture and gardens.",
    latitude: 12.9798,
    longitude: 77.5906,
    rating: 4.2,
    category: "Historical Landmark",
    weather_suitability: ["sunny", "cloudy"],
    accessibility_info: "External viewing only, security restrictions",
    best_time_to_visit: "Morning 10 AM - 12 PM"
  }
]

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
  
  console.log('🌱 Starting database seeding...')
  
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