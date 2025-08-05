import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const newJourneys = [
  // Morning journeys
  {
    title: 'Early Bird Special',
    description: 'Catch the neighborhood waking up with sunrise spots and morning rituals',
    gradient: 'from-yellow-400 to-orange-500',
    icon: 'map',
    estimated_time: '3 hours',
    vibe_tags: ['morning', 'peaceful', 'photographer']
  },
  {
    title: 'Breakfast Champion',
    description: "Ultimate breakfast crawl through Amit's favorite morning spots",
    gradient: 'from-red-400 to-pink-500',
    icon: 'map',
    estimated_time: '4 hours',
    vibe_tags: ['foodie', 'breakfast', 'coffee']
  },
  // Cultural journeys
  {
    title: 'Heritage Walk',
    description: 'Discover the historical gems and cultural landmarks',
    gradient: 'from-indigo-500 to-purple-600',
    icon: 'compass',
    estimated_time: '3 hours',
    vibe_tags: ['cultural', 'historical', 'educational']
  },
  {
    title: 'Art & Soul',
    description: 'Gallery hopping and creative spaces tour',
    gradient: 'from-pink-500 to-rose-600',
    icon: 'compass',
    estimated_time: '5 hours',
    vibe_tags: ['artistic', 'creative', 'inspiring']
  },
  // Food-focused journeys
  {
    title: 'Street Food Safari',
    description: "Amit's guide to the best street food vendors",
    gradient: 'from-green-500 to-teal-600',
    icon: 'map',
    estimated_time: '4 hours',
    vibe_tags: ['foodie', 'street-food', 'adventurous']
  },
  {
    title: 'Craft Beer Trail',
    description: 'Microbreweries and gastropubs circuit',
    gradient: 'from-amber-600 to-yellow-600',
    icon: 'compass',
    estimated_time: '5 hours',
    vibe_tags: ['drinks', 'social', 'evening']
  },
  // Wellness journeys
  {
    title: 'Wellness Wednesday',
    description: 'Yoga studios, healthy cafes, and peaceful parks',
    gradient: 'from-cyan-500 to-blue-600',
    icon: 'home',
    estimated_time: '4 hours',
    vibe_tags: ['wellness', 'healthy', 'mindful']
  },
  {
    title: 'Nature Escape',
    description: 'Green spaces and tranquil spots in the urban jungle',
    gradient: 'from-green-600 to-emerald-600',
    icon: 'home',
    estimated_time: '3 hours',
    vibe_tags: ['nature', 'peaceful', 'relaxing']
  },
  // Shopping & lifestyle
  {
    title: 'Retail Therapy',
    description: 'Boutiques, bookstores, and unique shopping finds',
    gradient: 'from-purple-500 to-pink-500',
    icon: 'map',
    estimated_time: '5 hours',
    vibe_tags: ['shopping', 'lifestyle', 'trendy']
  },
  {
    title: 'Sunday Funday',
    description: 'Perfect lazy Sunday with brunches and chill spots',
    gradient: 'from-blue-500 to-indigo-600',
    icon: 'home',
    estimated_time: '6 hours',
    vibe_tags: ['relaxed', 'brunch', 'social']
  },
  // Evening journeys
  {
    title: 'Date Night Special',
    description: 'Romantic spots for the perfect evening',
    gradient: 'from-red-500 to-pink-600',
    icon: 'compass',
    estimated_time: '4 hours',
    vibe_tags: ['romantic', 'evening', 'special']
  },
  {
    title: 'Night Owl Circuit',
    description: 'Late-night haunts and 24-hour spots',
    gradient: 'from-gray-700 to-gray-900',
    icon: 'map',
    estimated_time: '5 hours',
    vibe_tags: ['nightlife', 'late-night', 'social']
  },
  // Seasonal specials
  {
    title: 'Monsoon Magic',
    description: 'Best spots to enjoy the rainy season',
    gradient: 'from-blue-600 to-indigo-700',
    icon: 'compass',
    estimated_time: '3 hours',
    vibe_tags: ['seasonal', 'monsoon', 'cozy']
  },
  {
    title: 'Summer Chill',
    description: 'Beat the heat with AC havens and cold treats',
    gradient: 'from-cyan-400 to-blue-500',
    icon: 'home',
    estimated_time: '4 hours',
    vibe_tags: ['seasonal', 'summer', 'refreshing']
  }
]

async function applyJourneys() {
  console.log('🚀 Adding more journeys to the database...\n')

  try {
    // Check existing journeys
    const { data: existingJourneys, error: fetchError } = await supabase
      .from('journeys')
      .select('title')
    
    if (fetchError) {
      console.error('❌ Error fetching existing journeys:', fetchError)
      return
    }

    const existingTitles = new Set(existingJourneys?.map(j => j.title) || [])
    console.log(`📊 Found ${existingTitles.size} existing journeys\n`)

    // Filter out journeys that already exist
    const journeysToAdd = newJourneys.filter(j => !existingTitles.has(j.title))
    
    if (journeysToAdd.length === 0) {
      console.log('✅ All journeys already exist in the database!')
      return
    }

    console.log(`📝 Adding ${journeysToAdd.length} new journeys...\n`)

    // Insert new journeys
    const { data, error } = await supabase
      .from('journeys')
      .insert(journeysToAdd)
      .select()

    if (error) {
      console.error('❌ Error inserting journeys:', error)
      return
    }

    console.log('✅ Successfully added new journeys:')
    data?.forEach(journey => {
      console.log(`   - ${journey.title} (${journey.estimated_time})`)
    })

    // Update existing journeys' updated_at timestamp
    const { error: updateError } = await supabase
      .from('journeys')
      .update({ updated_at: new Date().toISOString() })
      .not('title', 'in', `(${journeysToAdd.map(j => j.title).join(',')})`)

    if (updateError) {
      console.error('⚠️  Warning: Could not update timestamps:', updateError)
    }

    console.log('\n🎉 Journey database update complete!')
    console.log(`📊 Total journeys now: ${existingTitles.size + journeysToAdd.length}`)

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the script
applyJourneys().then(() => process.exit(0))