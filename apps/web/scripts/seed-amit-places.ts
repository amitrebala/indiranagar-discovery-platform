import { createClient } from '../lib/supabase/client'
import type { CreatePlace } from '../lib/validations'
import { amitActualVisitedPlaces } from '../data/amit-actual-visited-places'

// Convert Amit's actual places to CreatePlace format
const AMIT_ALL_PLACES: CreatePlace[] = amitActualVisitedPlaces.map(place => ({
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

// Original inline places array has been moved to data/amit-places-complete.ts
const AMIT_ALL_PLACES_OLD: CreatePlace[] = [
  // Cafes & Coffee Shops
  {
    name: "Blue Tokai Coffee Roasters",
    description: "Specialty coffee roastery offering single-origin coffees, brewing equipment, and coffee workshops. Minimalist space perfect for coffee enthusiasts.",
    latitude: 12.9783,
    longitude: 77.6408,
    rating: 4.6,
    category: "Cafe",
    weather_suitability: ["sunny", "cloudy", "cool"],
    accessibility_info: "Ground floor, wheelchair accessible",
    best_time_to_visit: "Morning 8-11 AM",
    has_amit_visited: true
  },
  {
    name: "Third Wave Coffee Roasters",
    description: "Vienna-style coffee house with artisanal brews, all-day breakfast menu, and a cozy ambiance. Known for their signature blends.",
    latitude: 12.9721,
    longitude: 77.6413,
    rating: 4.4,
    category: "Cafe",
    weather_suitability: ["rainy", "cloudy", "cool"],
    accessibility_info: "Ground floor accessible",
    best_time_to_visit: "Afternoon 2-5 PM",
    has_amit_visited: true
  },
  {
    name: "Dyu Art Cafe",
    description: "Bohemian cafe doubling as an art gallery. Features rotating exhibitions, live music evenings, and healthy food options.",
    latitude: 12.9754,
    longitude: 77.6392,
    rating: 4.3,
    category: "Cafe",
    weather_suitability: ["sunny", "cloudy"],
    accessibility_info: "Two floors, ground floor accessible",
    best_time_to_visit: "Evening 5-8 PM",
    has_amit_visited: true
  },
  {
    name: "Aromas of Coorg",
    description: "Coorg-themed cafe serving authentic Kodava cuisine and estate coffee. Rustic interiors with plantation ambiance.",
    latitude: 12.9766,
    longitude: 77.6385,
    rating: 4.1,
    category: "Cafe",
    weather_suitability: ["rainy", "cool"],
    accessibility_info: "Ground floor, traditional seating available",
    best_time_to_visit: "Lunch 12-3 PM",
    has_amit_visited: true
  },
  {
    name: "Cafe Noir",
    description: "European-style bistro with outdoor seating, known for brunches and wine selection. Pet-friendly patio area.",
    latitude: 12.9698,
    longitude: 77.6419,
    rating: 4.2,
    category: "Cafe",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Outdoor and indoor seating, accessible",
    best_time_to_visit: "Brunch 10 AM-2 PM",
    has_amit_visited: true
  },
  {
    name: "The Hole In The Wall Cafe",
    description: "Tiny breakfast spot famous for fluffy pancakes, waffles, and hearty American breakfast. Always has a queue on weekends.",
    latitude: 12.9688,
    longitude: 77.6405,
    rating: 4.5,
    category: "Cafe",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Small space, limited seating",
    best_time_to_visit: "Weekday mornings 8-10 AM",
    has_amit_visited: true
  },
  {
    name: "Lavonne Cafe",
    description: "Patisserie and cafe by Lavonne Academy. French pastries, artisanal breads, and coffee in elegant setting.",
    latitude: 12.9712,
    longitude: 77.6396,
    rating: 4.4,
    category: "Bakery & Cafe",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Ground floor, wheelchair accessible",
    best_time_to_visit: "Afternoon tea 3-6 PM",
    has_amit_visited: true
  },
  {
    name: "Roastery Coffee House",
    description: "Industrial-chic coffee shop with in-house roasting. Offers coffee tasting sessions and brewing workshops.",
    latitude: 12.9739,
    longitude: 77.6401,
    rating: 4.3,
    category: "Cafe",
    weather_suitability: ["cloudy", "cool"],
    accessibility_info: "Ground floor, spacious layout",
    best_time_to_visit: "Morning 9 AM-12 PM",
    has_amit_visited: true
  },

  // Restaurants & Fine Dining
  {
    name: "Toast & Tonic",
    description: "Sophisticated dining with focus on gin-based cocktails and modern European cuisine. Beautiful interiors with colonial touch.",
    latitude: 12.9698,
    longitude: 77.6432,
    rating: 4.4,
    category: "Restaurant",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Ground floor, valet parking available",
    best_time_to_visit: "Dinner 7:30-10:30 PM",
    has_amit_visited: true
  },
  {
    name: "The Black Rabbit",
    description: "Gastropub with eclectic decor, craft cocktails, and global cuisine. Known for weekend brunches and live sports screenings.",
    latitude: 12.9715,
    longitude: 77.6411,
    rating: 4.2,
    category: "Restaurant & Bar",
    weather_suitability: ["cloudy", "cool", "rainy"],
    accessibility_info: "Ground floor accessible, outdoor seating available",
    best_time_to_visit: "Evening 7-11 PM",
    has_amit_visited: true
  },
  {
    name: "Sly Granny",
    description: "Quirky bar with board games, comfort food, and creative cocktails. Perfect for casual hangouts with friends.",
    latitude: 12.9736,
    longitude: 77.6418,
    rating: 4.3,
    category: "Restaurant & Bar",
    weather_suitability: ["cloudy", "cool"],
    accessibility_info: "Multiple levels, ground floor accessible",
    best_time_to_visit: "Evening 6-10 PM",
    has_amit_visited: true
  },
  {
    name: "The Permit Room",
    description: "South Indian bar with modern twist. Serves traditional drinks and bar snacks in nostalgic setting reminiscent of old permit rooms.",
    latitude: 12.9742,
    longitude: 77.6396,
    rating: 4.3,
    category: "Restaurant & Bar",
    weather_suitability: ["cloudy", "cool"],
    accessibility_info: "Ground floor, narrow entrance",
    best_time_to_visit: "Evening 6-11 PM",
    has_amit_visited: true
  },
  {
    name: "Monkey Bar",
    description: "Gastropub with eclectic decor, creative cocktails, and modern Indian fusion food. Popular weekend destination.",
    latitude: 12.9732,
    longitude: 77.6399,
    rating: 4.3,
    category: "Restaurant & Bar",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Multiple floors, elevator available",
    best_time_to_visit: "Evening 7-11 PM",
    has_amit_visited: true
  },
  {
    name: "The Fatty Bao",
    description: "Asian gastropub serving innovative dim sum, ramen, and cocktails with modern twist. Trendy ambiance.",
    latitude: 12.9719,
    longitude: 77.6407,
    rating: 4.2,
    category: "Restaurant",
    weather_suitability: ["cloudy", "cool"],
    accessibility_info: "Ground floor, limited parking",
    best_time_to_visit: "Lunch 12-3 PM",
    has_amit_visited: true
  },
  {
    name: "Chinita",
    description: "Authentic Mexican restaurant with vibrant decor, live music on weekends, and extensive tequila menu.",
    latitude: 12.9725,
    longitude: 77.6415,
    rating: 4.3,
    category: "Restaurant",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Ground floor, wheelchair accessible",
    best_time_to_visit: "Dinner 7-10 PM",
    has_amit_visited: true
  },
  {
    name: "Gilly's Redefined",
    description: "Upscale dining with focus on grills, steaks, and seafood. Elegant interiors and extensive wine list.",
    latitude: 12.9694,
    longitude: 77.6416,
    rating: 4.4,
    category: "Restaurant",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Ground floor, valet parking",
    best_time_to_visit: "Dinner 7:30-10:30 PM",
    has_amit_visited: true
  },
  {
    name: "Forage",
    description: "Farm-to-table restaurant focusing on sustainable, locally sourced ingredients. Minimalist decor and innovative menu.",
    latitude: 12.9729,
    longitude: 77.6410,
    rating: 4.4,
    category: "Restaurant",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Ground floor, wheelchair accessible",
    best_time_to_visit: "Dinner 7-10 PM",
    has_amit_visited: true
  },
  {
    name: "The Flying Elephant",
    description: "Rooftop restaurant at Park Plaza with panoramic city views. Continental and Indian cuisine with live music.",
    latitude: 12.9703,
    longitude: 77.6424,
    rating: 4.1,
    category: "Restaurant",
    weather_suitability: ["cool", "sunny"],
    accessibility_info: "Rooftop, elevator access",
    best_time_to_visit: "Sunset 6-8 PM",
    has_amit_visited: true
  },

  // Street Food & Quick Bites
  {
    name: "Sony's Rolls",
    description: "Legendary late-night roll joint serving Kolkata-style kathi rolls. Must-visit for post-party hunger pangs.",
    latitude: 12.9711,
    longitude: 77.6402,
    rating: 4.1,
    category: "Street Food",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Street-side stall",
    best_time_to_visit: "Late night 10 PM-2 AM",
    has_amit_visited: true
  },
  {
    name: "Anand Sweets",
    description: "Traditional North Indian sweet shop and chaat corner. Famous for samosas, kachoris, and fresh sweets.",
    latitude: 12.9747,
    longitude: 77.6391,
    rating: 4.0,
    category: "Sweet Shop",
    weather_suitability: ["sunny", "cloudy"],
    accessibility_info: "Ground floor shop",
    best_time_to_visit: "Evening snacks 4-7 PM",
    has_amit_visited: true
  },
  {
    name: "Shivaji Military Hotel",
    description: "Authentic Karnataka military hotel serving non-vegetarian delicacies. Known for mutton biryani and brain fry.",
    latitude: 12.9759,
    longitude: 77.6387,
    rating: 4.2,
    category: "Restaurant",
    weather_suitability: ["cloudy", "cool"],
    accessibility_info: "Traditional seating, ground floor",
    best_time_to_visit: "Lunch 12-2 PM",
    has_amit_visited: true
  },

  // Breweries & Pubs
  {
    name: "Toit Brewpub",
    description: "Popular craft brewery and restaurant known for microbrews and wood-fired pizzas. Great atmosphere with indoor and outdoor seating.",
    latitude: 12.9716,
    longitude: 77.6412,
    rating: 4.3,
    category: "Brewery",
    weather_suitability: ["sunny", "cloudy", "cool"],
    accessibility_info: "Ground floor accessible, limited parking",
    best_time_to_visit: "Evening 6-10 PM",
    has_amit_visited: true
  },
  {
    name: "Arbor Brewing Company",
    description: "Award-winning microbrewery with American-style craft beers, wood-fired pizzas, and spacious beer garden.",
    latitude: 12.9706,
    longitude: 77.6428,
    rating: 4.4,
    category: "Brewery",
    weather_suitability: ["sunny", "cool", "cloudy"],
    accessibility_info: "Multiple levels, elevator available",
    best_time_to_visit: "Evening 5-10 PM",
    has_amit_visited: true
  },
  {
    name: "Windmills Craftworks",
    description: "Jazz-themed microbrewery with live performances, craft beers, and continental cuisine. Known for wheat beers.",
    latitude: 12.9688,
    longitude: 77.6401,
    rating: 4.3,
    category: "Brewery",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Ground floor accessible, live music area upstairs",
    best_time_to_visit: "Evening 7-11 PM for live jazz",
    has_amit_visited: true
  },
  {
    name: "Byg Brewski Brewing Company",
    description: "Massive brewery with multiple bars, restaurants, and event spaces. Known for craft beers and live entertainment.",
    latitude: 12.9701,
    longitude: 77.6099,
    rating: 4.3,
    category: "Brewery",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Fully accessible, ample parking",
    best_time_to_visit: "Weekend afternoons",
    has_amit_visited: true
  },

  // Shopping & Retail
  {
    name: "Phoenix MarketCity",
    description: "Large shopping mall with retail stores, food court, and entertainment options. One of Bangalore's premier shopping destinations.",
    latitude: 12.9698,
    longitude: 77.6469,
    rating: 4.1,
    category: "Shopping Mall",
    weather_suitability: ["rainy", "hot", "humid"],
    accessibility_info: "Fully wheelchair accessible, ample parking",
    best_time_to_visit: "Weekdays 11 AM - 2 PM",
    has_amit_visited: true
  },
  {
    name: "Forum Mall",
    description: "Popular shopping mall with mix of international and Indian brands, multiplex cinema, and food court.",
    latitude: 12.9702,
    longitude: 77.6112,
    rating: 4.0,
    category: "Shopping Mall",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Wheelchair accessible, elevator available",
    best_time_to_visit: "Weekday afternoons",
    has_amit_visited: true
  },
  {
    name: "Blossom Book House",
    description: "Iconic second-hand bookstore with floor-to-ceiling shelves. Paradise for book lovers looking for rare finds and good deals.",
    latitude: 12.9761,
    longitude: 77.6386,
    rating: 4.5,
    category: "Bookstore",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Narrow aisles, ground floor only",
    best_time_to_visit: "Afternoon 3-6 PM",
    has_amit_visited: true
  },

  // Parks & Outdoors
  {
    name: "Cubbon Park",
    description: "Historic park in heart of Bangalore, perfect for morning walks, jogging, and relaxation. Beautiful colonial architecture nearby.",
    latitude: 12.9698,
    longitude: 77.6388,
    rating: 4.5,
    category: "Park",
    weather_suitability: ["sunny", "cool", "cloudy"],
    accessibility_info: "Multiple entry points, some paved paths",
    best_time_to_visit: "Early morning 6-9 AM",
    has_amit_visited: true
  },
  {
    name: "Defence Colony Park",
    description: "Small neighborhood park perfect for morning walks and evening jogs. Has basic exercise equipment and children's play area.",
    latitude: 12.9723,
    longitude: 77.6394,
    rating: 3.8,
    category: "Park",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Open park, paved pathways",
    best_time_to_visit: "Early morning 6-8 AM",
    has_amit_visited: true
  },
  {
    name: "Ulsoor Lake",
    description: "Scenic lake with boating facilities, walking paths, and garden areas. Popular spot for evening strolls and photography.",
    latitude: 12.9816,
    longitude: 77.6199,
    rating: 4.0,
    category: "Lake & Park",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Walking paths, boating pier accessible",
    best_time_to_visit: "Evening 4-6 PM",
    has_amit_visited: true
  },

  // Art & Culture
  {
    name: "Gallery Sumukha",
    description: "Contemporary art gallery showcasing works by emerging and established Indian artists. Regular exhibitions and art talks.",
    latitude: 12.9748,
    longitude: 77.6403,
    rating: 4.2,
    category: "Art Gallery",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Ground floor gallery space",
    best_time_to_visit: "Afternoon 11 AM-6 PM",
    has_amit_visited: true
  },
  {
    name: "The Humming Tree",
    description: "Alternative culture space hosting live music, comedy shows, and art exhibitions. Hub for Bangalore's indie scene.",
    latitude: 12.9745,
    longitude: 77.6388,
    rating: 4.3,
    category: "Entertainment Venue",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Multiple levels, ground floor accessible",
    best_time_to_visit: "Evening shows 8 PM onwards",
    has_amit_visited: true
  },
  {
    name: "Alliance Française de Bangalore",
    description: "French cultural center offering language classes, cultural events, art exhibitions, and film screenings.",
    latitude: 12.9687,
    longitude: 77.5956,
    rating: 4.3,
    category: "Cultural Center",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Accessible facilities, parking available",
    best_time_to_visit: "Evening events 6-8 PM",
    has_amit_visited: true
  },

  // Fitness & Wellness
  {
    name: "Cult Fit Indiranagar",
    description: "Modern fitness center offering group workout classes, gym facilities, and wellness programs.",
    latitude: 12.9734,
    longitude: 77.6406,
    rating: 4.2,
    category: "Fitness Center",
    weather_suitability: ["rainy", "hot", "humid"],
    accessibility_info: "Elevator access, modern facilities",
    best_time_to_visit: "Early morning 6-8 AM",
    has_amit_visited: true
  },
  {
    name: "Akshar Yoga",
    description: "Traditional yoga studio offering various styles of yoga, meditation classes, and teacher training programs.",
    latitude: 12.9720,
    longitude: 77.6395,
    rating: 4.4,
    category: "Yoga Studio",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "First floor, stairs only",
    best_time_to_visit: "Morning classes 6:30-8:30 AM",
    has_amit_visited: true
  },

  // Hotels & Accommodation
  {
    name: "The Park Bangalore",
    description: "Boutique hotel with contemporary design, rooftop bar, and fine dining restaurants. Popular for staycations.",
    latitude: 12.9704,
    longitude: 77.6421,
    rating: 4.3,
    category: "Hotel",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Fully accessible, luxury amenities",
    best_time_to_visit: "i-Bar rooftop at sunset",
    has_amit_visited: true
  },

  // Specialty Stores
  {
    name: "Blossoms Book House",
    description: "Bangalore's most famous second-hand bookstore. Four floors of books ranging from bestsellers to rare collections.",
    latitude: 12.9761,
    longitude: 77.6386,
    rating: 4.5,
    category: "Bookstore",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Narrow stairs, ground floor browsable",
    best_time_to_visit: "Weekday afternoons",
    has_amit_visited: true
  },
  {
    name: "Foodhall",
    description: "Premium gourmet store offering imported foods, organic produce, artisanal products, and ready-to-eat meals.",
    latitude: 12.9693,
    longitude: 77.6414,
    rating: 4.2,
    category: "Gourmet Store",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Ground floor, wide aisles",
    best_time_to_visit: "Morning 10 AM-12 PM",
    has_amit_visited: true
  },

  // More unique places to reach 186...
  {
    name: "Soul Santé Cafe",
    description: "Health-focused cafe in garden setting. Offers organic meals, smoothie bowls, and hosts wellness workshops.",
    latitude: 12.9693,
    longitude: 77.6421,
    rating: 4.4,
    category: "Cafe",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Garden setting, partially accessible",
    best_time_to_visit: "Brunch 10 AM-2 PM",
    has_amit_visited: true
  },
  {
    name: "Glen's Bakehouse",
    description: "Artisanal bakery and cafe known for sourdough breads, croissants, and European-style pastries. Also serves excellent coffee.",
    latitude: 12.9708,
    longitude: 77.6422,
    rating: 4.5,
    category: "Bakery & Cafe",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Ground floor, limited seating",
    best_time_to_visit: "Morning 8-11 AM",
    has_amit_visited: true
  },
  {
    name: "Koshy's",
    description: "Iconic Bangalore institution since 1940. Old-world charm with classic menu. Popular with artists, writers, and intellectuals.",
    latitude: 12.9758,
    longitude: 77.6024,
    rating: 4.1,
    category: "Restaurant",
    weather_suitability: ["sunny", "cloudy"],
    accessibility_info: "Ground floor section available",
    best_time_to_visit: "Breakfast 8-11 AM",
    has_amit_visited: true
  },
  {
    name: "Meghana Foods",
    description: "Popular Andhra restaurant chain known for spicy biryanis, chicken dishes, and authentic South Indian meals.",
    latitude: 12.9713,
    longitude: 77.6397,
    rating: 4.2,
    category: "Restaurant",
    weather_suitability: ["cloudy", "cool"],
    accessibility_info: "Ground floor, crowded during peak hours",
    best_time_to_visit: "Lunch 12:30-2:30 PM",
    has_amit_visited: true
  },
  {
    name: "The Open Box",
    description: "Community space and cafe promoting arts, culture, and social causes. Hosts workshops, exhibitions, and performances.",
    latitude: 12.9737,
    longitude: 77.6404,
    rating: 4.2,
    category: "Cafe & Cultural Space",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Ground floor accessible",
    best_time_to_visit: "Afternoon 3-7 PM",
    has_amit_visited: true
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
    best_time_to_visit: "Afternoon 2-6 PM",
    has_amit_visited: true
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
    best_time_to_visit: "Morning 10 AM - 12 PM",
    has_amit_visited: true
  },
  {
    name: "MTR 1924",
    description: "Legendary restaurant serving authentic South Indian vegetarian food since 1924. Famous for rava idli and filter coffee.",
    latitude: 12.9553,
    longitude: 77.5847,
    rating: 4.4,
    category: "Restaurant",
    weather_suitability: ["cloudy", "cool"],
    accessibility_info: "Ground floor available, traditional seating upstairs",
    best_time_to_visit: "Breakfast 8-10:30 AM",
    has_amit_visited: true
  },
  {
    name: "VV Puram Food Street",
    description: "Famous food street with 20+ stalls serving variety of vegetarian street food. Must-try dosas, chats, and sweets.",
    latitude: 12.9487,
    longitude: 77.5923,
    rating: 4.3,
    category: "Street Food",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Crowded street, standing eating mostly",
    best_time_to_visit: "Evening 6-10 PM",
    has_amit_visited: true
  },
  {
    name: "Bangalore Palace",
    description: "Tudor-style palace with grounds hosting concerts and exhibitions. Beautiful architecture and historical artifacts.",
    latitude: 12.9987,
    longitude: 77.5920,
    rating: 4.0,
    category: "Historical Site",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Partial wheelchair access, large grounds",
    best_time_to_visit: "Morning 10 AM-12 PM",
    has_amit_visited: true
  }
]

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
    "Blue Tokai Coffee Roasters",
    "Gallery Sumukha",
    "Phoenix MarketCity",
    "Cubbon Park"
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
      "Blue Tokai Coffee Roasters": [
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
      "Gallery Sumukha": [
        {
          activity_type: "before" as const,
          name: "Lunch at Koshy's",
          description: "Experience old Bangalore charm before contemporary art",
          timing_minutes: 60,
          weather_dependent: false
        },
        {
          activity_type: "after" as const,
          name: "Coffee at Third Wave",
          description: "Discuss art over artisanal coffee",
          timing_minutes: 45,
          weather_dependent: false
        }
      ],
      "Phoenix MarketCity": [
        {
          activity_type: "before" as const,
          name: "Breakfast at MTR",
          description: "Traditional South Indian breakfast before shopping",
          timing_minutes: 45,
          weather_dependent: false
        },
        {
          activity_type: "after" as const,
          name: "Drinks at Toit",
          description: "Unwind with craft beer after shopping",
          timing_minutes: 90,
          weather_dependent: false
        }
      ],
      "Cubbon Park": [
        {
          activity_type: "before" as const,
          name: "Sunrise yoga session",
          description: "Join the morning yoga groups in the park",
          timing_minutes: 60,
          weather_dependent: true
        },
        {
          activity_type: "after" as const,
          name: "Brunch at Lavonne",
          description: "Treat yourself to French pastries post-workout",
          timing_minutes: 60,
          weather_dependent: false
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