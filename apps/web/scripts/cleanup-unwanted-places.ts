import { createClient } from '@supabase/supabase-js'
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

// Places marked with N (to be removed from database)
const PLACES_TO_REMOVE = [
  // From your code but marked N
  'Govt Canteen',
  
  // Dummy data marked N
  'The Yoga Room',
  'Karavalli',
  'Gallery Sumukha',
  
  // From database marked N
  '136.1 Crossfit',
  '99 Variety Idli & Dosa',
  'Akshar Yoga',
  'Albert Bakery',
  'Alliance Française',
  'Anand Sweets',
  'Aromas of Coorg',
  'Barbeque Nation - Indiranagar',
  'Blue Bar - Taj West End',
  'Bootlegger',
  'Brewsky',
  'Bugle Rock Park',
  'Bull Temple',
  'Burma Bazaar',
  'Butterfly Park',
  'Cafe Thulp',
  'Century Club',
  'Chickpet Market',
  'Chisel Fitness',
  'Coles Park',
  'Conrad Bengaluru',
  'CrossFit Himalaya',
  'Cult Fit Indiranagar',
  'District 6',
  'Dodda Alada Mara',
  'Eat Street',
  'F45 Training',
  'Fitness First',
  'Foodhall',
  'Forage',
  'Freedom Park',
  'Gandhi Bazaar',
  'Garuda Mall',
  'Gavi Gangadhareshwara Temple',
  'Gold\'s Gym',
  'Grameen Kulfi',
  'Hari Super Sandwich',
  'Indian Music Experience Museum',
  'Jayamahal Park',
  'Jayanagar 4th Block Complex',
  'Jayanagar Shopping Complex',
  'JC Road Park',
  'JP Park',
  'Kanteerava Indoor Stadium',
  'Karnataka Chitrakala Parishath',
  'Khawa Karpo',
  'Kosmic Fitness',
  'Life Yoga',
  'Lumbini Gardens',
  'Malleswaram Market',
  'Mangalore Pearl',
  'MultiFit',
  'National Market',
  'Nature\'s Basket',
  'Pink Fitness',
  'Pink Fitness Studio',
  'Priyadarshini Tea Stall',
  'Prost Brew Pub',
  'Ranga Shankara',
  'Ranganna Military Hotel',
  'Rangashankara Theatre',
  'Roti Ghar',
  'Russell Market',
  'Shao',
  'Shivaji Military Hotel',
  'SLV Corner',
  'Snap Fitness',
  'Sony\'s Rolls',
  'SP Road',
  'St. Mary\'s Basilica',
  'Sunday Soul Sante',
  'Taj West End',
  'The Black Rabbit',
  'The Boozy Griffin',
  'The Flying Elephant',
  'The Flying Squirrel',
  'The Hole In The Wall Cafe', // duplicate
  'The Humming Tree',
  'The Park Bangalore',
  'The Permit Room',
  'The Pump House',
  'The Space',
  'Tipu Sultan\'s Summer Palace',
  'Total Mall - Sarjapur Road',
  'Venkatappa Art Gallery',
  'Zorba Yoga'
]

async function cleanupUnwantedPlaces() {
  console.log('🧹 Starting cleanup of unwanted places...\n')
  
  try {
    let totalDeleted = 0
    let errors = 0
    
    for (const placeName of PLACES_TO_REMOVE) {
      console.log(`Removing: ${placeName}`)
      
      // First get the place to find its ID
      const { data: place, error: fetchError } = await supabase
        .from('places')
        .select('id, name')
        .eq('name', placeName)
        .single()
      
      if (fetchError || !place) {
        console.log(`  ⚠️  Not found in database: ${placeName}`)
        continue
      }
      
      // Delete related data first (due to foreign key constraints)
      // Delete companion activities
      await supabase
        .from('companion_activities')
        .delete()
        .eq('place_id', place.id)
      
      // Delete place images
      await supabase
        .from('place_images')
        .delete()
        .eq('place_id', place.id)
      
      // Delete the place
      const { error: deleteError } = await supabase
        .from('places')
        .delete()
        .eq('id', place.id)
      
      if (deleteError) {
        console.error(`  ❌ Error deleting ${placeName}:`, deleteError.message)
        errors++
      } else {
        console.log(`  ✅ Deleted successfully`)
        totalDeleted++
      }
    }
    
    console.log('\n📊 Cleanup Summary:')
    console.log(`   Total places to remove: ${PLACES_TO_REMOVE.length}`)
    console.log(`   Successfully deleted: ${totalDeleted}`)
    console.log(`   Errors: ${errors}`)
    console.log(`   Not found: ${PLACES_TO_REMOVE.length - totalDeleted - errors}`)
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  }
}

// Run cleanup
cleanupUnwantedPlaces()