import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '../lib/supabase/client'
import type { CreatePlace } from '../lib/validations'
import { amitRealVisitedPlaces } from '../data/amit-real-visited-places'

// Convert Amit's actual places to CreatePlace format
const AMIT_ALL_PLACES: CreatePlace[] = amitRealVisitedPlaces.map(place => ({
  name: place.name,
  description: place.notes,
  category: place.category,
  rating: place.rating || 4.0,
  latitude: place.coordinates?.lat || 12.9716, // Default to Indiranagar center
  longitude: place.coordinates?.lng || 77.6408,
  weather_suitability: ["sunny", "cloudy", "cool"], // Default values
  accessibility_info: "Ground floor accessible",
  best_time_to_visit: "Anytime",
  has_amit_visited: true
}))


// Function to add "has_amit_visited" field and ensure coordinates are within Indiranagar bounds
function processPlacesData(places: CreatePlace[]): (CreatePlace & { has_amit_visited: boolean })[] {
  return places.map(place => {
    // Ensure coordinates are within Indiranagar boundaries
    // If slightly outside, adjust to nearest boundary
    let { latitude, longitude } = place
    
    if (latitude < 12.95) latitude = 12.95
    if (latitude > 13.00) latitude = 13.00
    if (longitude < 77.58) longitude = 77.58
    if (longitude > 77.65) longitude = 77.65
    
    return {
      ...place,
      latitude,
      longitude,
      has_amit_visited: true // All places in this list have been visited by Amit
    }
  })
}

async function seedAmitPlaces() {
  const supabase = createClient()
  
  console.log('🌟 Starting to seed Amit\'s visited places...')
  
  try {
    // Process and validate places data
    const processedPlaces = processPlacesData(AMIT_ALL_PLACES)
    
    console.log(`📍 Processing ${processedPlaces.length} places...`)
    
    // Insert places in batches to avoid timeout
    const batchSize = 20
    let successCount = 0
    
    for (let i = 0; i < processedPlaces.length; i += batchSize) {
      const batch = processedPlaces.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('places')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`❌ Error inserting batch ${i/batchSize + 1}:`, error.message)
      } else {
        successCount += data?.length || 0
        console.log(`✅ Inserted batch ${i/batchSize + 1} (${data?.length} places)`)
      }
    }
    
    console.log(`\n🎉 Successfully seeded ${successCount} out of ${processedPlaces.length} places!`)
    
    // Validate the data
    const { count } = await supabase
      .from('places')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Total places in database: ${count}`)
    
    return {
      success: true,
      placesSeeded: successCount,
      totalPlaces: count
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Add companion activities for featured places
async function seedFeaturedActivities() {
  const supabase = createClient()
  
  // Define featured places that should have companion activities
  const featuredPlaceNames = [
    "Blue Tokai",
    "31st Floor - High Ultra Lounge",
    "RIM NAAM",
    "Bengaluru Oota Company"
  ]
  
  try {
    // Get featured places
    const { data: featuredPlaces, error: fetchError } = await supabase
      .from('places')
      .select('id, name')
      .in('name', featuredPlaceNames)
    
    if (fetchError) throw fetchError
    
    // Define companion activities for each type of place
    const activitiesMap = {
      "Blue Tokai": [
        {
          activity_type: "before" as const,
          name: "Morning walk in Defence Colony Park",
          description: "Start your day with a refreshing walk before your coffee",
          timing_minutes: 30,
          weather_dependent: true
        },
        {
          activity_type: "after" as const,
          name: "Browse Blossom Book House",
          description: "Pick up a book to enjoy with your coffee memories",
          timing_minutes: 45,
          weather_dependent: false
        }
      ],
      "31st Floor - High Ultra Lounge": [
        {
          activity_type: "before" as const,
          name: "Sunset viewing at nearby park",
          description: "Watch the sunset before heading to the rooftop lounge",
          timing_minutes: 30,
          weather_dependent: true
        },
        {
          activity_type: "after" as const,
          name: "Night walk in Bangalore CBD",
          description: "Take a leisurely walk through the illuminated city",
          timing_minutes: 45,
          weather_dependent: true
        }
      ],
      "RIM NAAM": [
        {
          activity_type: "before" as const,
          name: "Pre-dinner drinks at the hotel bar",
          description: "Start your evening with cocktails at the elegant bar",
          timing_minutes: 45,
          weather_dependent: false
        },
        {
          activity_type: "after" as const,
          name: "Walk through the hotel gardens",
          description: "Romantic stroll through the beautifully lit gardens",
          timing_minutes: 30,
          weather_dependent: true
        }
      ],
      "Bengaluru Oota Company": [
        {
          activity_type: "before" as const,
          name: "Visit to local market",
          description: "Explore the nearby traditional market for authentic vibes",
          timing_minutes: 45,
          weather_dependent: false
        },
        {
          activity_type: "after" as const,
          name: "Digestive walk around the neighborhood",
          description: "Traditional post-meal walk to aid digestion",
          timing_minutes: 30,
          weather_dependent: true
        }
      ]
    }
    
    // Insert activities
    for (const place of featuredPlaces || []) {
      const activities = activitiesMap[place.name as keyof typeof activitiesMap]
      if (activities) {
        const activitiesToInsert = activities.map(activity => ({
          ...activity,
          place_id: place.id
        }))
        
        const { error: insertError } = await supabase
          .from('companion_activities')
          .insert(activitiesToInsert)
        
        if (insertError) {
          console.warn(`⚠️ Failed to insert activities for ${place.name}:`, insertError.message)
        } else {
          console.log(`✅ Added companion activities for ${place.name}`)
        }
      }
    }
    
    console.log('✅ Featured activities seeded successfully!')
    
  } catch (error) {
    console.error('❌ Failed to seed featured activities:', error)
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedAmitPlaces().then(async (result) => {
    if (result.success) {
      await seedFeaturedActivities()
    }
    process.exit(result.success ? 0 : 1)
  })
}

export { seedAmitPlaces, seedFeaturedActivities }