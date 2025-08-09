import { createClient } from '@supabase/supabase-js'
import { Database } from '../lib/supabase/types'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

interface JourneyData {
  title: string
  description: string
  slug: string
  gradient: string
  icon: string
  estimated_time: string
  duration_minutes: number
  difficulty_level: 'easy' | 'moderate' | 'challenging'
  vibe_tags: string[]
  mood_category: 'contemplative' | 'energetic' | 'social' | 'cultural' | 'culinary'
  weather_suitability: string[]
  cost_estimate: string
  best_time: string
  stops: Array<{
    place_name: string
    order_index: number
    duration_minutes: number
    notes: string
    activities?: string[]
    photo_tips?: string[]
  }>
}

const journeys: JourneyData[] = [
  {
    title: "Coffee Culture Crawl",
    description: "Discover Indiranagar's finest coffee spots, from artisanal pour-overs to traditional filter coffee",
    slug: "coffee-culture-crawl",
    gradient: "from-amber-500 to-orange-600",
    icon: "☕",
    estimated_time: "3 hours",
    duration_minutes: 180,
    difficulty_level: "easy",
    vibe_tags: ["coffee", "social", "morning", "casual"],
    mood_category: "social",
    weather_suitability: ["clear", "cloudy", "mist"],
    cost_estimate: "₹500-800",
    best_time: "9:00 AM - 12:00 PM",
    stops: [
      {
        place_name: "Third Wave Coffee",
        order_index: 0,
        duration_minutes: 45,
        notes: "Start with their signature single-origin pour-over",
        activities: ["Coffee tasting", "People watching"],
        photo_tips: ["Latte art close-ups", "Window seating natural light"]
      },
      {
        place_name: "Blue Tokai Coffee",
        order_index: 1,
        duration_minutes: 60,
        notes: "Try their estate coffee and fresh pastries",
        activities: ["Coffee roasting demo", "Pastry pairing"],
        photo_tips: ["Roasting equipment", "Coffee bean displays"]
      },
      {
        place_name: "Dyu Art Cafe",
        order_index: 2,
        duration_minutes: 75,
        notes: "End with dessert coffee and art appreciation",
        activities: ["Art viewing", "Dessert tasting"],
        photo_tips: ["Art installations", "Colorful desserts"]
      }
    ]
  },
  {
    title: "Street Food Safari",
    description: "A culinary adventure through Indiranagar's best street food and local eateries",
    slug: "street-food-safari",
    gradient: "from-red-500 to-yellow-600",
    icon: "🍛",
    estimated_time: "4 hours",
    duration_minutes: 240,
    difficulty_level: "moderate",
    vibe_tags: ["foodie", "local", "adventurous", "budget"],
    mood_category: "culinary",
    weather_suitability: ["clear", "cloudy"],
    cost_estimate: "₹300-500",
    best_time: "6:00 PM - 10:00 PM",
    stops: [
      {
        place_name: "Sony Signal",
        order_index: 0,
        duration_minutes: 30,
        notes: "Start with fresh juice and chat items",
        activities: ["Street food tasting", "Local interaction"],
        photo_tips: ["Colorful food displays", "Vendor action shots"]
      },
      {
        place_name: "Shivaji Military Hotel",
        order_index: 1,
        duration_minutes: 60,
        notes: "Authentic Karnataka military hotel experience",
        activities: ["Traditional dining", "Spice exploration"],
        photo_tips: ["Traditional serving style", "Kitchen action"]
      },
      {
        place_name: "Eat Street",
        order_index: 2,
        duration_minutes: 45,
        notes: "Modern street food with a twist",
        activities: ["Fusion food tasting", "Food truck hopping"],
        photo_tips: ["Neon lights at night", "Food preparation"]
      },
      {
        place_name: "Asha Sweet Center",
        order_index: 3,
        duration_minutes: 30,
        notes: "End with traditional Indian sweets",
        activities: ["Sweet tasting", "Tea time"],
        photo_tips: ["Colorful sweet displays", "Traditional decor"]
      }
    ]
  },
  {
    title: "Art & Culture Walk",
    description: "Explore galleries, murals, and cultural spaces that define Indiranagar's creative spirit",
    slug: "art-culture-walk",
    gradient: "from-purple-500 to-pink-600",
    icon: "🎨",
    estimated_time: "3.5 hours",
    duration_minutes: 210,
    difficulty_level: "easy",
    vibe_tags: ["art", "culture", "creative", "inspiring"],
    mood_category: "cultural",
    weather_suitability: ["clear", "cloudy", "mist"],
    cost_estimate: "₹200-400",
    best_time: "10:00 AM - 2:00 PM",
    stops: [
      {
        place_name: "Gallery G",
        order_index: 0,
        duration_minutes: 60,
        notes: "Contemporary art gallery with rotating exhibitions",
        activities: ["Art viewing", "Artist interactions"],
        photo_tips: ["Gallery lighting", "Art details", "Architectural elements"]
      },
      {
        place_name: "Bookworm",
        order_index: 1,
        duration_minutes: 45,
        notes: "Independent bookstore with reading nooks",
        activities: ["Book browsing", "Reading", "Coffee break"],
        photo_tips: ["Book displays", "Cozy corners", "Vintage elements"]
      },
      {
        place_name: "The Humming Tree",
        order_index: 2,
        duration_minutes: 60,
        notes: "Live music venue and cultural space",
        activities: ["Live performance", "Art exhibitions", "Socializing"],
        photo_tips: ["Stage setup", "Crowd shots", "Ambient lighting"]
      },
      {
        place_name: "Dyu Art Cafe",
        order_index: 3,
        duration_minutes: 45,
        notes: "Art cafe with exhibitions and workshops",
        activities: ["Art workshop", "Creative dining"],
        photo_tips: ["Artwork displays", "Creative food presentation"]
      }
    ]
  },
  {
    title: "Sunrise Serenity",
    description: "Early morning journey through peaceful parks and breakfast spots",
    slug: "sunrise-serenity",
    gradient: "from-yellow-400 to-orange-500",
    icon: "🌅",
    estimated_time: "2.5 hours",
    duration_minutes: 150,
    difficulty_level: "easy",
    vibe_tags: ["peaceful", "morning", "healthy", "refreshing"],
    mood_category: "contemplative",
    weather_suitability: ["clear", "mist"],
    cost_estimate: "₹300-500",
    best_time: "6:00 AM - 8:30 AM",
    stops: [
      {
        place_name: "Defence Colony Park",
        order_index: 0,
        duration_minutes: 45,
        notes: "Morning walk and meditation in the park",
        activities: ["Walking", "Meditation", "Yoga"],
        photo_tips: ["Golden hour light", "Morning mist", "Nature shots"]
      },
      {
        place_name: "MTR 1924",
        order_index: 1,
        duration_minutes: 60,
        notes: "Traditional South Indian breakfast",
        activities: ["Traditional breakfast", "Coffee ritual"],
        photo_tips: ["Traditional service", "Steam from hot food"]
      },
      {
        place_name: "Yogisthaan",
        order_index: 2,
        duration_minutes: 45,
        notes: "Healthy breakfast and smoothie bowls",
        activities: ["Healthy eating", "Juice cleanse"],
        photo_tips: ["Colorful smoothie bowls", "Natural lighting"]
      }
    ]
  },
  {
    title: "Pub Hopping Paradise",
    description: "Experience Indiranagar's legendary nightlife through its best pubs and breweries",
    slug: "pub-hopping-paradise",
    gradient: "from-blue-600 to-purple-700",
    icon: "🍺",
    estimated_time: "5 hours",
    duration_minutes: 300,
    difficulty_level: "moderate",
    vibe_tags: ["nightlife", "party", "social", "drinks"],
    mood_category: "energetic",
    weather_suitability: ["clear", "cloudy"],
    cost_estimate: "₹2000-3500",
    best_time: "7:00 PM - 12:00 AM",
    stops: [
      {
        place_name: "Toit Brewpub",
        order_index: 0,
        duration_minutes: 90,
        notes: "Start with craft beers and pub grub",
        activities: ["Beer tasting", "Socializing", "Live music"],
        photo_tips: ["Brewery equipment", "Beer flights", "Crowd energy"]
      },
      {
        place_name: "The Fatty Bao",
        order_index: 1,
        duration_minutes: 75,
        notes: "Asian fusion with creative cocktails",
        activities: ["Cocktail tasting", "Asian tapas"],
        photo_tips: ["Cocktail presentations", "Dim lighting ambiance"]
      },
      {
        place_name: "Monkey Bar",
        order_index: 2,
        duration_minutes: 75,
        notes: "Gastropub with innovative drinks",
        activities: ["Signature cocktails", "Bar games"],
        photo_tips: ["Neon signs", "Creative drinks", "Bar atmosphere"]
      },
      {
        place_name: "The Black Rabbit",
        order_index: 3,
        duration_minutes: 60,
        notes: "End the night with live music and cocktails",
        activities: ["Live band", "Dancing", "Late night bites"],
        photo_tips: ["Stage performances", "Night lights"]
      }
    ]
  },
  {
    title: "Wellness & Spa Circuit",
    description: "Rejuvenate your mind and body at Indiranagar's wellness centers",
    slug: "wellness-spa-circuit",
    gradient: "from-green-400 to-teal-600",
    icon: "🧘",
    estimated_time: "4 hours",
    duration_minutes: 240,
    difficulty_level: "easy",
    vibe_tags: ["wellness", "relaxation", "health", "spa"],
    mood_category: "contemplative",
    weather_suitability: ["clear", "cloudy", "rain"],
    cost_estimate: "₹3000-5000",
    best_time: "10:00 AM - 2:00 PM",
    stops: [
      {
        place_name: "The Four Fountains Spa",
        order_index: 0,
        duration_minutes: 90,
        notes: "Start with a relaxing massage",
        activities: ["Massage therapy", "Steam room"],
        photo_tips: ["Spa ambiance", "Wellness products"]
      },
      {
        place_name: "Akshar Yoga",
        order_index: 1,
        duration_minutes: 60,
        notes: "Yoga and meditation session",
        activities: ["Yoga class", "Meditation", "Breathing exercises"],
        photo_tips: ["Yoga poses", "Serene spaces"]
      },
      {
        place_name: "Enerjuvate Studio",
        order_index: 2,
        duration_minutes: 45,
        notes: "Healthy lunch and wellness consultation",
        activities: ["Nutrition consultation", "Healthy dining"],
        photo_tips: ["Healthy food", "Studio interiors"]
      },
      {
        place_name: "O2 Spa",
        order_index: 3,
        duration_minutes: 45,
        notes: "End with facial treatment",
        activities: ["Facial treatment", "Relaxation"],
        photo_tips: ["Spa products", "Relaxation areas"]
      }
    ]
  },
  {
    title: "Shopping Spree Special",
    description: "From boutiques to street markets, discover Indiranagar's shopping gems",
    slug: "shopping-spree-special",
    gradient: "from-pink-500 to-rose-600",
    icon: "🛍️",
    estimated_time: "4 hours",
    duration_minutes: 240,
    difficulty_level: "easy",
    vibe_tags: ["shopping", "fashion", "local", "trendy"],
    mood_category: "social",
    weather_suitability: ["clear", "cloudy"],
    cost_estimate: "Variable",
    best_time: "11:00 AM - 3:00 PM",
    stops: [
      {
        place_name: "100 Feet Road Boutiques",
        order_index: 0,
        duration_minutes: 90,
        notes: "Explore designer boutiques and fashion stores",
        activities: ["Fashion shopping", "Window shopping"],
        photo_tips: ["Store displays", "Fashion finds"]
      },
      {
        place_name: "Indiranagar 2nd Stage Market",
        order_index: 1,
        duration_minutes: 60,
        notes: "Local market for unique finds",
        activities: ["Bargain hunting", "Local crafts"],
        photo_tips: ["Market scenes", "Colorful displays"]
      },
      {
        place_name: "BDA Complex",
        order_index: 2,
        duration_minutes: 45,
        notes: "Shopping complex with variety",
        activities: ["Shopping", "Food court break"],
        photo_tips: ["Architecture", "Shopping bags"]
      },
      {
        place_name: "Soul Santhe",
        order_index: 3,
        duration_minutes: 45,
        notes: "Weekend flea market (Sundays only)",
        activities: ["Flea market browsing", "Artisan products"],
        photo_tips: ["Vendor stalls", "Handmade products"]
      }
    ]
  },
  {
    title: "Family Fun Day",
    description: "Kid-friendly journey with activities for the whole family",
    slug: "family-fun-day",
    gradient: "from-cyan-400 to-blue-500",
    icon: "👨‍👩‍👧‍👦",
    estimated_time: "4 hours",
    duration_minutes: 240,
    difficulty_level: "easy",
    vibe_tags: ["family", "kids", "fun", "educational"],
    mood_category: "energetic",
    weather_suitability: ["clear", "cloudy"],
    cost_estimate: "₹1500-2500",
    best_time: "10:00 AM - 2:00 PM",
    stops: [
      {
        place_name: "Defence Colony Park",
        order_index: 0,
        duration_minutes: 60,
        notes: "Kids playground and open space",
        activities: ["Playground time", "Picnic", "Games"],
        photo_tips: ["Kids playing", "Family moments"]
      },
      {
        place_name: "Smaaash",
        order_index: 1,
        duration_minutes: 90,
        notes: "Gaming and entertainment center",
        activities: ["Arcade games", "VR experiences", "Bowling"],
        photo_tips: ["Action shots", "Gaming moments"]
      },
      {
        place_name: "Corner House Ice Cream",
        order_index: 2,
        duration_minutes: 45,
        notes: "Ice cream treat for everyone",
        activities: ["Ice cream tasting", "Family bonding"],
        photo_tips: ["Ice cream joy", "Colorful desserts"]
      },
      {
        place_name: "Just Bake",
        order_index: 3,
        duration_minutes: 45,
        notes: "Cake and pastry selection",
        activities: ["Cake selection", "Tea time"],
        photo_tips: ["Cake displays", "Happy faces"]
      }
    ]
  },
  {
    title: "Monsoon Magic Walk",
    description: "Embrace the rain with indoor experiences and cozy cafes",
    slug: "monsoon-magic-walk",
    gradient: "from-gray-500 to-blue-600",
    icon: "🌧️",
    estimated_time: "3 hours",
    duration_minutes: 180,
    difficulty_level: "easy",
    vibe_tags: ["monsoon", "cozy", "indoor", "romantic"],
    mood_category: "contemplative",
    weather_suitability: ["rain", "thunderstorm"],
    cost_estimate: "₹800-1200",
    best_time: "Any time during rain",
    stops: [
      {
        place_name: "Cafe Max",
        order_index: 0,
        duration_minutes: 60,
        notes: "European cafe with rain views",
        activities: ["Coffee and books", "Rain watching"],
        photo_tips: ["Rain on windows", "Cozy interiors"]
      },
      {
        place_name: "Bookworm",
        order_index: 1,
        duration_minutes: 60,
        notes: "Browse books while it rains",
        activities: ["Book reading", "Hot chocolate"],
        photo_tips: ["Reading nooks", "Book stacks"]
      },
      {
        place_name: "Glen's Bakehouse",
        order_index: 2,
        duration_minutes: 60,
        notes: "Comfort food and warm ambiance",
        activities: ["Comfort dining", "Bakery treats"],
        photo_tips: ["Comfort food", "Warm lighting"]
      }
    ]
  },
  {
    title: "Heritage & History Hunt",
    description: "Discover the historical and architectural gems of old Indiranagar",
    slug: "heritage-history-hunt",
    gradient: "from-amber-600 to-brown-700",
    icon: "🏛️",
    estimated_time: "3 hours",
    duration_minutes: 180,
    difficulty_level: "moderate",
    vibe_tags: ["heritage", "history", "architecture", "educational"],
    mood_category: "cultural",
    weather_suitability: ["clear", "cloudy", "mist"],
    cost_estimate: "₹200-400",
    best_time: "9:00 AM - 12:00 PM",
    stops: [
      {
        place_name: "Old Indiranagar Market",
        order_index: 0,
        duration_minutes: 45,
        notes: "Traditional market with decades of history",
        activities: ["Market exploration", "Local stories"],
        photo_tips: ["Old architecture", "Market life"]
      },
      {
        place_name: "Holy Trinity Church",
        order_index: 1,
        duration_minutes: 45,
        notes: "Historic church with beautiful architecture",
        activities: ["Architecture viewing", "History learning"],
        photo_tips: ["Church architecture", "Stained glass"]
      },
      {
        place_name: "BDA Complex",
        order_index: 2,
        duration_minutes: 45,
        notes: "Planned development from the 1970s",
        activities: ["Urban planning observation", "Photography"],
        photo_tips: ["Architectural details", "Urban landscapes"]
      },
      {
        place_name: "Defence Colony",
        order_index: 3,
        duration_minutes: 45,
        notes: "Ex-servicemen colony with unique history",
        activities: ["Walking tour", "Story collection"],
        photo_tips: ["Colony gates", "Tree-lined streets"]
      }
    ]
  },
  {
    title: "Fitness Fanatic Route",
    description: "Active journey through gyms, health cafes, and sports facilities",
    slug: "fitness-fanatic-route",
    gradient: "from-orange-500 to-red-600",
    icon: "💪",
    estimated_time: "4 hours",
    duration_minutes: 240,
    difficulty_level: "challenging",
    vibe_tags: ["fitness", "active", "health", "sports"],
    mood_category: "energetic",
    weather_suitability: ["clear", "cloudy"],
    cost_estimate: "₹500-1000",
    best_time: "6:00 AM - 10:00 AM",
    stops: [
      {
        place_name: "Cult Fit Indiranagar",
        order_index: 0,
        duration_minutes: 60,
        notes: "Group fitness class to start the day",
        activities: ["Workout class", "Stretching"],
        photo_tips: ["Gym action", "Fitness motivation"]
      },
      {
        place_name: "Defence Colony Park",
        order_index: 1,
        duration_minutes: 45,
        notes: "Outdoor workout and running",
        activities: ["Running", "Calisthenics"],
        photo_tips: ["Outdoor exercise", "Park fitness"]
      },
      {
        place_name: "Greenr Cafe",
        order_index: 2,
        duration_minutes: 60,
        notes: "Protein-rich breakfast and smoothies",
        activities: ["Healthy eating", "Nutrition planning"],
        photo_tips: ["Healthy meals", "Smoothie bowls"]
      },
      {
        place_name: "Decathlon",
        order_index: 3,
        duration_minutes: 45,
        notes: "Sports equipment shopping",
        activities: ["Equipment browsing", "Sports gear testing"],
        photo_tips: ["Sports equipment", "Active lifestyle"]
      },
      {
        place_name: "Play Arena",
        order_index: 4,
        duration_minutes: 30,
        notes: "Sports activities and games",
        activities: ["Sports games", "Team activities"],
        photo_tips: ["Sports action", "Team moments"]
      }
    ]
  },
  {
    title: "Date Night Delights",
    description: "Romantic journey through intimate cafes and scenic spots",
    slug: "date-night-delights",
    gradient: "from-red-500 to-pink-600",
    icon: "❤️",
    estimated_time: "4 hours",
    duration_minutes: 240,
    difficulty_level: "easy",
    vibe_tags: ["romantic", "intimate", "couples", "special"],
    mood_category: "contemplative",
    weather_suitability: ["clear", "mist"],
    cost_estimate: "₹2000-3500",
    best_time: "5:00 PM - 9:00 PM",
    stops: [
      {
        place_name: "The Flying Squirrel",
        order_index: 0,
        duration_minutes: 60,
        notes: "Rooftop cafe with sunset views",
        activities: ["Sunset watching", "Coffee date"],
        photo_tips: ["Golden hour", "Couple shots"]
      },
      {
        place_name: "Olive Beach",
        order_index: 1,
        duration_minutes: 90,
        notes: "Mediterranean restaurant with romantic ambiance",
        activities: ["Fine dining", "Wine tasting"],
        photo_tips: ["Candlelit dinner", "Ambient lighting"]
      },
      {
        place_name: "The Hole in the Wall Cafe",
        order_index: 2,
        duration_minutes: 60,
        notes: "Cozy cafe with intimate seating",
        activities: ["Dessert sharing", "Conversation"],
        photo_tips: ["Cozy corners", "Dessert plates"]
      },
      {
        place_name: "Corner House Ice Cream",
        order_index: 3,
        duration_minutes: 30,
        notes: "End with Death by Chocolate",
        activities: ["Ice cream sharing", "Sweet ending"],
        photo_tips: ["Ice cream moments", "Happy endings"]
      }
    ]
  }
]

async function seedJourneys() {
  console.log('🌱 Starting journey seed...')
  
  try {
    // First, get all existing places
    const { data: places, error: placesError } = await supabase
      .from('places')
      .select('id, name')
    
    if (placesError) {
      console.error('Error fetching places:', placesError)
      return
    }

    console.log(`Found ${places?.length || 0} places in database`)

    // Create a map of place names to IDs
    const placeMap = new Map<string, string>()
    places?.forEach(place => {
      placeMap.set(place.name.toLowerCase(), place.id)
      // Also map common variations
      placeMap.set(place.name.toLowerCase().replace(/-/g, ' '), place.id)
    })

    let successCount = 0
    let errorCount = 0

    for (const journeyData of journeys) {
      console.log(`\n📍 Creating journey: ${journeyData.title}`)
      
      // Check if this migration table exists, if not use the legacy structure
      // For now, let's use the simpler legacy structure
      const { data: journey, error: journeyError } = await supabase
        .from('journeys')
        .insert({
          title: journeyData.title,
          description: journeyData.description,
          gradient: journeyData.gradient,
          icon: journeyData.icon,
          estimated_time: journeyData.estimated_time,
          vibe_tags: journeyData.vibe_tags
        })
        .select()
        .single()

      if (journeyError) {
        console.error(`  ❌ Error creating journey:`, journeyError)
        errorCount++
        continue
      }

      console.log(`  ✅ Journey created with ID: ${journey.id}`)

      // Insert journey stops
      let stopCount = 0
      for (const stop of journeyData.stops) {
        // Try to find the place ID
        let placeId = placeMap.get(stop.place_name.toLowerCase())
        
        if (!placeId) {
          // Create a placeholder place if it doesn't exist
          console.log(`    ⚠️  Place not found: ${stop.place_name}, creating placeholder...`)
          const { data: newPlace, error: placeError } = await supabase
            .from('places')
            .insert({
              name: stop.place_name.toLowerCase().replace(/\s+/g, '-'),
              description: `${stop.place_name} - Popular spot in Indiranagar`,
              category: 'restaurant',
              subcategory: 'casual_dining',
              coordinates: [
                12.9716 + (Math.random() - 0.5) * 0.02, // Random coordinates near Indiranagar
                77.5946 + (Math.random() - 0.5) * 0.02
              ],
              price_level: 2,
              rating: 4.0 + Math.random() * 0.5,
              opening_hours: {
                monday: '10:00 AM - 10:00 PM',
                tuesday: '10:00 AM - 10:00 PM',
                wednesday: '10:00 AM - 10:00 PM',
                thursday: '10:00 AM - 10:00 PM',
                friday: '10:00 AM - 11:00 PM',
                saturday: '10:00 AM - 11:00 PM',
                sunday: '10:00 AM - 10:00 PM'
              }
            })
            .select()
            .single()

          if (!placeError && newPlace) {
            placeId = newPlace.id
            placeMap.set(stop.place_name.toLowerCase(), placeId)
            console.log(`    ✅ Created placeholder place: ${stop.place_name}`)
          } else {
            console.error(`    ❌ Error creating place:`, placeError)
            continue
          }
        }

        // Insert journey_places (legacy table structure)
        const { data: journeyStop, error: stopError } = await supabase
          .from('journey_places')
          .insert({
            journey_id: journey.id,
            place_id: placeId,
            order_index: stop.order_index,
            notes: stop.notes
          })
          .select()
          .single()

        if (stopError) {
          console.error(`    ❌ Error creating stop:`, stopError)
        } else {
          stopCount++
          console.log(`    ✅ Stop ${stop.order_index + 1}: ${stop.place_name}`)
        }
      }

      console.log(`  ✅ Created ${stopCount} stops for journey`)
      successCount++
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Successfully created ${successCount} journeys`)
    if (errorCount > 0) {
      console.log(`⚠️  Failed to create ${errorCount} journeys`)
    }
    console.log('='.repeat(50))

  } catch (error) {
    console.error('Fatal error during seeding:', error)
  }
}

// Run the seed
seedJourneys()
  .then(() => {
    console.log('\n✨ Journey seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Journey seeding failed:', error)
    process.exit(1)
  })