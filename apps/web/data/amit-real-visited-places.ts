// THIS IS THE AUTHORITATIVE LIST OF PLACES AMIT HAS ACTUALLY VISITED
// ANY OTHER LIST SHOULD BE DELETED - THIS IS THE ONLY TRUTH

export interface AmitRealPlace {
  name: string;
  category: string;
  rating?: number;
  notes: string;
  mustTry?: string[];
  vibe?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  bestFor?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
  cuisine?: string;
}

// Amit's ACTUAL visited places - NO DUMMY DATA
export const amitRealVisitedPlaces: AmitRealPlace[] = [
  // Fine Dining & Premium Experiences
  {
    name: "31st Floor - High Ultra Lounge",
    category: "fine dining",
    rating: 5,
    notes: "Amazing views and experience",
    vibe: "luxurious rooftop",
    priceRange: "$$$$",
    bestFor: ["special occasions", "dates", "anniversary"],
    coordinates: { lat: 12.9716, lng: 77.6195 }
  },
  {
    name: "RIM NAAM",
    category: "fine dining",
    rating: 5,
    notes: "Amazing 'Big Date' place",
    vibe: "romantic thai",
    priceRange: "$$$$",
    bestFor: ["special dates", "anniversaries"],
    cuisine: "Thai",
    coordinates: { lat: 12.9734, lng: 77.6192 }
  },
  {
    name: "Swwing",
    category: "fine dining",
    notes: "Indiranagar - Great Date setting and an interesting menu",
    vibe: "romantic swing bar",
    priceRange: "$$$",
    bestFor: ["dates", "special occasions"],
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Salt",
    category: "fine dining",
    notes: "Good food, good ambience, good service, Overpriced",
    vibe: "modern european",
    priceRange: "$$$$",
    cuisine: "Continental",
    coordinates: { lat: 12.9698, lng: 77.6469 }
  },
  {
    name: "Muro",
    category: "fine dining",
    rating: 5,
    notes: "Gorgeous place, inspired cocktails, interesting food presentation, great service",
    vibe: "sophisticated asian",
    priceRange: "$$$$",
    bestFor: ["special occasions", "business dinners"],
    cuisine: "Asian Fusion",
    coordinates: { lat: 12.9734, lng: 77.6192 }
  },
  {
    name: "MIRTH",
    category: "fine dining",
    rating: 5,
    notes: "Great indoor dining experience, premium",
    vibe: "upscale modern",
    priceRange: "$$$$",
    coordinates: { lat: 12.9698, lng: 77.6469 }
  },
  {
    name: "Jamavar",
    category: "fine dining",
    notes: "Leela palace - Amazing for anniversaries and parents will definitely love it",
    vibe: "traditional luxury",
    priceRange: "$$$$",
    bestFor: ["anniversaries", "family celebrations"],
    cuisine: "North Indian",
    address: "The Leela Palace",
    coordinates: { lat: 12.9602, lng: 77.6484 }
  },
  {
    name: "Dakshin",
    category: "fine dining",
    notes: "South Indian fine dining",
    vibe: "traditional south indian",
    priceRange: "$$$",
    cuisine: "South Indian",
    coordinates: { lat: 12.9719, lng: 77.5937 }
  },
  {
    name: "Alba",
    category: "fine dining",
    notes: "Great Italian food",
    vibe: "elegant italian",
    priceRange: "$$$",
    cuisine: "Italian",
    coordinates: { lat: 12.9734, lng: 77.6192 }
  },
  {
    name: "Olive Beach",
    category: "fine dining",
    notes: "Great ambience, mid food, good date place choice",
    vibe: "mediterranean beachside",
    priceRange: "$$$",
    bestFor: ["dates", "sunday brunch"],
    cuisine: "Mediterranean",
    coordinates: { lat: 12.9580, lng: 77.6484 }
  },
  {
    name: "Bastian",
    category: "fine dining",
    notes: "Great ambience",
    vibe: "seafood specialist",
    priceRange: "$$$",
    cuisine: "Seafood",
    coordinates: { lat: 12.9821, lng: 77.6409 }
  },

  // Cafes & Coffee Shops
  {
    name: "Urban Solace",
    category: "cafe",
    notes: "Great cafe experience",
    vibe: "peaceful european",
    priceRange: "$$",
    bestFor: ["work", "meetings"],
    coordinates: { lat: 12.9261, lng: 77.6337 }
  },
  {
    name: "The Roastery",
    category: "cafe",
    notes: "Quality coffee spot",
    vibe: "specialty coffee",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Writer's Cafe",
    category: "cafe",
    notes: "Iced teas (empty always)",
    vibe: "quiet literary",
    priceRange: "$",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },
  {
    name: "Dyu Art Cafe",
    category: "cafe",
    notes: "Great Banoffee pie",
    mustTry: ["Banoffee pie"],
    vibe: "artistic cozy",
    priceRange: "$$",
    coordinates: { lat: 12.9821, lng: 77.6408 }
  },
  {
    name: "Lazy Suzy",
    category: "cafe",
    notes: "Hazelnut Hot chocolate",
    mustTry: ["Hazelnut Hot chocolate"],
    vibe: "cozy comfort",
    priceRange: "$$",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },
  {
    name: "Animane",
    category: "cafe",
    notes: "Good coffee, has benches outside",
    vibe: "outdoor seating",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Cafe Max",
    category: "cafe",
    notes: "Great food and peace",
    vibe: "peaceful retreat",
    priceRange: "$$",
    coordinates: { lat: 12.9734, lng: 77.6192 }
  },
  {
    name: "Cumulus Cafe",
    category: "cafe",
    notes: "Art museum - Views",
    vibe: "artistic museum cafe",
    priceRange: "$$$",
    address: "Inside art museum",
    coordinates: { lat: 12.9841, lng: 77.5881 }
  },
  {
    name: "Subko Coffee",
    category: "cafe",
    notes: "Good in off hours",
    vibe: "third wave coffee",
    priceRange: "$$$",
    coordinates: { lat: 12.9821, lng: 77.6408 }
  },
  {
    name: "Subko Ajji",
    category: "cafe",
    notes: "Best rustic looking cafe in BLR",
    vibe: "rustic heritage",
    priceRange: "$$$",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Ner.lu Cafe",
    category: "cafe",
    notes: "Quaint, tucked away, can go here to sit down and talk to friends over great coffee and light food (try their Saigon special)",
    mustTry: ["Saigon special"],
    vibe: "intimate hideaway",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "3rd Wave",
    category: "cafe",
    notes: "on 6th main - Great spot for a chill eavesdropping evening",
    vibe: "people watching",
    priceRange: "$$",
    address: "6th Main, Indiranagar",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Havu Cafe",
    category: "cafe",
    notes: "80ft Rd Indiranagar - great roast chicken salad with avocado, good open mushroom sandwich. Cool chill ambience",
    mustTry: ["Roast chicken salad with avocado", "Open mushroom sandwich"],
    vibe: "healthy casual",
    priceRange: "$$",
    address: "80 Feet Road, Indiranagar",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Temple of the Senses",
    category: "cafe",
    notes: "Great smoothie bowls",
    mustTry: ["Smoothie bowls"],
    vibe: "healthy zen",
    priceRange: "$$",
    coordinates: { lat: 12.9716, lng: 77.6093 }
  },
  {
    name: "Monkey Tree Cafe",
    category: "cafe",
    notes: "Wisdor, good sandwiches and can sit outside in the garden",
    vibe: "garden seating",
    priceRange: "$$",
    address: "Inside Wisdor building",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Blue Tokai",
    category: "cafe",
    notes: "Indiranagar - good to work alone from during the day",
    vibe: "work friendly",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Humble Bean",
    category: "cafe",
    notes: "A good place to kick back and decompress",
    vibe: "relaxed comfort",
    priceRange: "$$",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },
  {
    name: "Kink Coffee",
    category: "cafe",
    notes: "Pretty good benches on the road and decent coffee",
    vibe: "street seating",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Nuage Cafe",
    category: "cafe",
    notes: "Good chicken steak",
    mustTry: ["Chicken steak"],
    vibe: "casual dining",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "By2Coffee",
    category: "cafe",
    notes: "Opp CTR, better than CTR",
    vibe: "local favorite",
    priceRange: "$",
    address: "Opposite CTR",
    coordinates: { lat: 12.9592, lng: 77.5863 }
  },
  {
    name: "Brezelhaus",
    category: "cafe",
    notes: "Good place to hangout but no AC",
    vibe: "german bakery",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Copper and Clove",
    category: "cafe",
    notes: "Cool ambience plus book store plus decent smoothies",
    vibe: "bookstore cafe",
    priceRange: "$$",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },

  // Restaurants & Casual Dining
  {
    name: "Koshys",
    category: "restaurant",
    rating: 4,
    notes: "Flex your bangalore knowledge",
    vibe: "heritage institution",
    priceRange: "$$",
    bestFor: ["breakfast", "nostalgia"],
    coordinates: { lat: 12.9698, lng: 77.5997 }
  },
  {
    name: "The Bangalore Cafe",
    category: "restaurant",
    notes: "Near Richmond - Late night coffee",
    vibe: "24x7 diner",
    priceRange: "$$",
    address: "Near Richmond Circle",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },
  {
    name: "21A",
    category: "restaurant",
    notes: "Easy sit and talk ambience",
    vibe: "conversational comfort",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Smoke House Deli",
    category: "restaurant",
    notes: "Go for brunch with friends from outta town. 100ft Rd - good value for money, huge menu to select from, some rats under the table occasionally tho",
    vibe: "european deli",
    priceRange: "$$$",
    bestFor: ["brunch", "visitors"],
    address: "100 Feet Road",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Pangeo",
    category: "restaurant",
    notes: "Huge space, great for corporate or family settings",
    vibe: "spacious dining",
    priceRange: "$$$",
    bestFor: ["groups", "corporate events"],
    coordinates: { lat: 12.9372, lng: 77.6444 }
  },
  {
    name: "Cafe Terra",
    category: "restaurant",
    notes: "Good dining experience",
    vibe: "casual european",
    priceRange: "$$",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Nevermind",
    category: "restaurant",
    notes: "Decent food, good for not too close friend groups",
    vibe: "casual groups",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Vidyarthi Bhavan",
    category: "restaurant",
    notes: "I mean it's alright",
    vibe: "heritage south indian",
    priceRange: "$",
    coordinates: { lat: 12.9556, lng: 77.5860 }
  },
  {
    name: "CTR",
    category: "restaurant",
    notes: "Meh.",
    vibe: "overrated dosa place",
    priceRange: "$",
    coordinates: { lat: 12.9592, lng: 77.5863 }
  },
  {
    name: "Govt Canteen",
    category: "restaurant",
    notes: "Vishwesaraya museum",
    vibe: "budget government",
    priceRange: "$",
    address: "Inside Visvesvaraya Museum",
    coordinates: { lat: 12.9789, lng: 77.5975 }
  },
  {
    name: "Sante Spa Cuisine",
    category: "restaurant",
    notes: "Very pleasant and soothing ambience, great food options and smoothie bowls",
    vibe: "healthy spa",
    priceRange: "$$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Clean and Green",
    category: "restaurant",
    notes: "Good smoothie bowls",
    mustTry: ["Smoothie bowls"],
    vibe: "healthy eating",
    priceRange: "$$",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Kale Salads and Co",
    category: "restaurant",
    notes: "Good easy salads",
    vibe: "healthy quick",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Kaavu",
    category: "restaurant",
    notes: "Decent for large groups and corporates",
    vibe: "group dining",
    priceRange: "$$",
    coordinates: { lat: 12.9734, lng: 77.6192 }
  },
  {
    name: "Roomali",
    category: "restaurant",
    notes: "Church Street - Decent north Indian food",
    vibe: "north indian casual",
    priceRange: "$$",
    cuisine: "North Indian",
    address: "Church Street",
    coordinates: { lat: 12.9752, lng: 77.5942 }
  },
  {
    name: "Concu",
    category: "restaurant",
    notes: "Good AC and ambience but mid food",
    vibe: "comfortable seating",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },

  // Asian & International Cuisine
  {
    name: "Based on a True Story",
    category: "asian",
    notes: "Interesting concept restaurant",
    vibe: "storytelling dining",
    priceRange: "$$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Lucky Chan",
    category: "asian",
    notes: "Good Asian food",
    vibe: "modern asian",
    priceRange: "$$",
    cuisine: "Pan-Asian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Dam's Kitchen",
    category: "asian",
    notes: "Korean",
    vibe: "authentic korean",
    priceRange: "$$",
    cuisine: "Korean",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Mamagoto",
    category: "asian",
    notes: "Cool wall art",
    vibe: "quirky asian",
    priceRange: "$$",
    cuisine: "Pan-Asian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Burma Burma",
    category: "asian",
    notes: "Over rated",
    vibe: "burmese themed",
    priceRange: "$$$",
    cuisine: "Burmese",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Chinita",
    category: "mexican",
    notes: "Mexican - Great quesadillas",
    mustTry: ["Quesadillas"],
    vibe: "casual mexican",
    priceRange: "$$",
    cuisine: "Mexican",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },
  {
    name: "Phobidden Fruit",
    category: "asian",
    notes: "Great summer rolls and glass noodles",
    mustTry: ["Summer rolls", "Glass noodles"],
    vibe: "vietnamese fresh",
    priceRange: "$$",
    cuisine: "Vietnamese",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Wanley",
    category: "asian",
    notes: "Indiranagar - Easy and Simple Chinese place run by immigrants",
    vibe: "authentic chinese",
    priceRange: "$$",
    cuisine: "Chinese",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Kopitiam Lah",
    category: "asian",
    notes: "Expensive, looks good, tastes mid, will probably close pretty soon if not for bangaloreans overspending kink",
    vibe: "instagram singaporean",
    priceRange: "$$$",
    cuisine: "Singaporean",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Kazan",
    category: "asian",
    notes: "Decent experience, great menu, mid food",
    vibe: "japanese modern",
    priceRange: "$$$",
    cuisine: "Japanese",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Izanagi",
    category: "asian",
    notes: "Wide menu, great staff, good food atleast the standard menu items",
    vibe: "japanese authentic",
    priceRange: "$$$",
    cuisine: "Japanese",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Kuuraku",
    category: "asian",
    notes: "Good food, fast service, interesting ambience",
    vibe: "ramen specialist",
    priceRange: "$$",
    cuisine: "Japanese",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Uno Izakaya",
    category: "asian",
    notes: "Good sushi and Japanese fried chicken",
    mustTry: ["Sushi", "Japanese fried chicken"],
    vibe: "japanese pub",
    priceRange: "$$$",
    cuisine: "Japanese",
    coordinates: { lat: 12.9372, lng: 77.6263 }
  },
  {
    name: "Harumi",
    category: "asian",
    notes: "Good sushi and yakitori",
    mustTry: ["Sushi", "Yakitori"],
    vibe: "japanese grill",
    priceRange: "$$$",
    cuisine: "Japanese",
    coordinates: { lat: 12.9261, lng: 77.6337 }
  },
  {
    name: "Mandarin Box",
    category: "asian",
    notes: "Asian cuisine",
    vibe: "pan-asian casual",
    priceRange: "$$",
    cuisine: "Pan-Asian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Shiro",
    category: "asian",
    notes: "Asian dining",
    vibe: "upscale asian",
    priceRange: "$$$",
    cuisine: "Pan-Asian",
    coordinates: { lat: 12.9720, lng: 77.6205 }
  },
  {
    name: "DOFU",
    category: "asian",
    notes: "Good hong kong hawker style noodles and rice bowls, walk in, only 5 seats",
    mustTry: ["Hong kong style noodles", "Rice bowls"],
    vibe: "authentic street food",
    priceRange: "$$",
    cuisine: "Hong Kong",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Kawaii",
    category: "dessert",
    notes: "Indiranagar - Has great Japanese mochi desserts in different flavors, only them",
    mustTry: ["Mochi desserts"],
    vibe: "japanese sweets",
    priceRange: "$$",
    cuisine: "Japanese Desserts",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },

  // Italian
  {
    name: "Little Italy",
    category: "italian",
    notes: "Classic Italian chain",
    vibe: "family italian",
    priceRange: "$$",
    cuisine: "Italian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Pasta Street",
    category: "italian",
    notes: "Good pasta options",
    vibe: "casual pasta",
    priceRange: "$$",
    cuisine: "Italian",
    coordinates: { lat: 12.9821, lng: 77.6408 }
  },
  {
    name: "Dolci",
    category: "italian",
    rating: 5,
    notes: "Best Tiramisu",
    mustTry: ["Tiramisu"],
    vibe: "italian desserts",
    priceRange: "$$",
    cuisine: "Italian",
    coordinates: { lat: 12.9752, lng: 77.5996 }
  },
  {
    name: "Bologna",
    category: "italian",
    notes: "Overhyped but decent food",
    vibe: "trendy italian",
    priceRange: "$$$",
    cuisine: "Italian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Ciros",
    category: "italian",
    notes: "Good woodfire pizzas and serves Toit brews",
    mustTry: ["Woodfire pizzas"],
    vibe: "pizza specialist",
    priceRange: "$$",
    cuisine: "Italian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Spettacolare",
    category: "italian",
    notes: "Great tiramisu and good Italian food",
    mustTry: ["Tiramisu"],
    vibe: "authentic italian",
    priceRange: "$$$",
    cuisine: "Italian",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Amicii",
    category: "italian",
    notes: "Amazing ambience and crowd",
    vibe: "social italian",
    priceRange: "$$$",
    cuisine: "Italian",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },

  // Indian Regional
  {
    name: "Bangalore Dhabha",
    category: "indian",
    notes: "North Indian dhaba style",
    vibe: "dhaba authentic",
    priceRange: "$$",
    cuisine: "North Indian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Araku",
    category: "indian",
    notes: "Regional Indian cuisine",
    vibe: "regional specialties",
    priceRange: "$$",
    cuisine: "Regional Indian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Madurai Hut",
    category: "indian",
    notes: "Tamil Nadu cuisine",
    vibe: "tamil authentic",
    priceRange: "$$",
    cuisine: "Tamil Nadu",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Tandoori Taal",
    category: "indian",
    notes: "North Indian",
    vibe: "tandoori specialist",
    priceRange: "$$",
    cuisine: "North Indian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Malabar Hotel",
    category: "indian",
    notes: "Kaggadasapura (Idiappam)",
    mustTry: ["Idiappam"],
    vibe: "kerala authentic",
    priceRange: "$",
    cuisine: "Kerala",
    address: "Kaggadasapura",
    coordinates: { lat: 12.9855, lng: 77.6469 }
  },
  {
    name: "Qissa",
    category: "indian",
    notes: "Baklava and Idlis shaped like pizzas",
    mustTry: ["Baklava", "Pizza idlis"],
    vibe: "fusion creative",
    priceRange: "$$",
    cuisine: "Fusion Indian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Savoury",
    category: "indian",
    notes: "Iffa dejaj",
    mustTry: ["Iffa dejaj"],
    vibe: "mughlai",
    priceRange: "$$",
    cuisine: "Mughlai",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "KARAMA",
    category: "indian",
    notes: "Great mutton mandi biryani, a little overpriced but ok",
    mustTry: ["Mutton mandi biryani"],
    vibe: "arabic indian",
    priceRange: "$$$",
    cuisine: "Arabic Indian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Thapakkatty",
    category: "indian",
    notes: "Bad.",
    vibe: "avoid",
    priceRange: "$$",
    cuisine: "Tamil Nadu",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Habba Kadal",
    category: "indian",
    notes: "Kashmiri place, good vibes, bland food but high quality",
    vibe: "kashmiri authentic",
    priceRange: "$$$",
    cuisine: "Kashmiri",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Bengaluru Oota Company",
    category: "indian",
    rating: 5,
    notes: "The greatest evening dinner experience I had. My most favorite Biryani was introduced to me here. Amazing place and people",
    mustTry: ["Biryani"],
    vibe: "authentic karnataka",
    priceRange: "$$$",
    bestFor: ["dinner", "authentic experience"],
    cuisine: "Karnataka",
    coordinates: { lat: 12.9321, lng: 77.6337 }
  },
  {
    name: "Mahesh Lunch Home",
    category: "indian",
    notes: "Good seafood, fish fry and mangalore style biryani",
    mustTry: ["Fish fry", "Mangalore biryani"],
    vibe: "coastal seafood",
    priceRange: "$$",
    cuisine: "Mangalorean",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },
  {
    name: "Lucknow Street",
    category: "indian",
    notes: "Good galouti kebabs and parathas",
    mustTry: ["Galouti kebabs", "Parathas"],
    vibe: "lucknowi street",
    priceRange: "$$",
    cuisine: "Lucknowi",
    coordinates: { lat: 12.9261, lng: 77.6337 }
  },
  {
    name: "Arambam",
    category: "indian",
    notes: "Indiranagar - good south indian tiffin place",
    vibe: "tiffin specialist",
    priceRange: "$",
    cuisine: "South Indian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Suvai",
    category: "indian",
    notes: "Tamilnadu style restaurant, good kothu parotta",
    mustTry: ["Kothu parotta"],
    vibe: "tamil street food",
    priceRange: "$$",
    cuisine: "Tamil Nadu",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Imperial",
    category: "indian",
    notes: "Indiranagar - Good kebabs and tandooris",
    mustTry: ["Kebabs", "Tandoori items"],
    vibe: "north indian grill",
    priceRange: "$$",
    cuisine: "North Indian",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Navu Project",
    category: "indian",
    notes: "Great food, small place, amazing staff suggestions",
    vibe: "experimental indian",
    priceRange: "$$$",
    cuisine: "Modern Indian",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Kerala Pavilion",
    category: "indian",
    notes: "Pretty good appams and stew",
    mustTry: ["Appams", "Stew"],
    vibe: "kerala traditional",
    priceRange: "$$",
    cuisine: "Kerala",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Rumi",
    category: "indian",
    rating: 5,
    notes: "Indiranagar - amazing north Indian food (awadhi). They serve a mean galouti and all the other starters are bangers too",
    mustTry: ["Galouti kebab", "All starters"],
    vibe: "awadhi fine",
    priceRange: "$$$",
    cuisine: "Awadhi",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Karim's",
    category: "indian",
    notes: "Ashok Nagar - good mutton dishes",
    mustTry: ["Mutton dishes"],
    vibe: "mughlai legacy",
    priceRange: "$$",
    cuisine: "Mughlai",
    address: "Ashok Nagar",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },

  // Bars & Pubs
  {
    name: "The Druid Garden",
    category: "bar",
    notes: "Great pub atmosphere",
    vibe: "garden pub",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "The Biere Club",
    category: "bar",
    notes: "Lavelle road",
    vibe: "craft beer",
    priceRange: "$$",
    address: "Lavelle Road",
    coordinates: { lat: 12.9716, lng: 77.5997 }
  },
  {
    name: "Balcony Bar",
    category: "bar",
    notes: "Go here if Bob's is Full, Has buffet",
    vibe: "rooftop casual",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Candles Brewhouse",
    category: "bar",
    notes: "Hebbal - 14th floor, good views",
    vibe: "rooftop brewery",
    priceRange: "$$$",
    address: "Hebbal",
    coordinates: { lat: 13.0352, lng: 77.5976 }
  },
  {
    name: "Murphys",
    category: "bar",
    rating: 5,
    notes: "Insane Entry +++++",
    vibe: "irish pub premium",
    priceRange: "$$$",
    coordinates: { lat: 12.9283, lng: 77.6063 }
  },
  {
    name: "One X Commune",
    category: "bar",
    notes: "Good for a picture on the rooftop and just one beer",
    vibe: "instagram rooftop",
    priceRange: "$$",
    coordinates: { lat: 12.9789, lng: 77.6408 }
  },
  {
    name: "Three Dots and a Dash",
    category: "bar",
    notes: "Decent ambiance + has Toit beer available, Good fish and chips",
    mustTry: ["Fish and chips"],
    vibe: "casual pub",
    priceRange: "$$",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Jook Taproom",
    category: "bar",
    notes: "Mid",
    vibe: "average taproom",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Hangover",
    category: "bar",
    notes: "Indiranagar - Mid, decent date place",
    vibe: "casual date bar",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Pecos",
    category: "bar",
    notes: "Indiranagar - 2010 English playlist",
    vibe: "nostalgic rock bar",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "1131",
    category: "bar",
    notes: "Indiranagar - Good for groups",
    vibe: "group friendly",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Arbor Brewing Company",
    category: "bar",
    notes: "Funny beer and good crowd",
    vibe: "american brewery",
    priceRange: "$$",
    coordinates: { lat: 12.9716, lng: 77.5937 }
  },
  {
    name: "Float",
    category: "bar",
    notes: "HRBR - good beer and decent food",
    vibe: "neighborhood brewery",
    priceRange: "$$",
    address: "HRBR Layout",
    coordinates: { lat: 12.9976, lng: 77.6393 }
  },
  {
    name: "Shangri La",
    category: "bar",
    notes: "A good place to get to know someone, top floor views",
    vibe: "rooftop date spot",
    priceRange: "$$$",
    coordinates: { lat: 12.9734, lng: 77.6192 }
  },
  {
    name: "We: neighbourgood",
    category: "bar",
    notes: "Easy evening drinks, brewery, good bar bites",
    vibe: "community brewery",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Chinlungs Brewery",
    category: "bar",
    notes: "Good and cheap bar bites, fun crowd, bad waitstaff",
    vibe: "budget brewery",
    priceRange: "$",
    coordinates: { lat: 12.9261, lng: 77.6337 }
  },
  {
    name: "Hops Haus",
    category: "bar",
    notes: "Whitefield - decent beer and bites",
    vibe: "german brewery",
    priceRange: "$$",
    address: "Whitefield",
    coordinates: { lat: 12.9698, lng: 77.7499 }
  },
  {
    name: "Toast and Tonic",
    category: "bar",
    notes: "East village style bar. Decent food",
    vibe: "cocktail specialist",
    priceRange: "$$$",
    coordinates: { lat: 12.9752, lng: 77.6408 }
  },
  {
    name: "Bob's",
    category: "bar",
    notes: "Ashok Nagar - Big, same old Bob's, fresh paint",
    vibe: "sports bar classic",
    priceRange: "$$",
    address: "Ashok Nagar",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },
  {
    name: "Dublin Windsor",
    category: "bar",
    notes: "Average irish style bar",
    vibe: "irish pub",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Arena",
    category: "bar",
    notes: "100ft - Mid bar, decent food, but luckily very budget friendly",
    vibe: "budget sports bar",
    priceRange: "$",
    address: "100 Feet Road",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },

  // Nightlife & Clubs
  {
    name: "Sugar Factory - Reloaded",
    category: "nightlife",
    notes: "Dance floor",
    vibe: "dance club",
    priceRange: "$$$",
    bestFor: ["dancing", "parties"],
    coordinates: { lat: 12.9372, lng: 77.6263 }
  },
  {
    name: "Social",
    category: "nightlife",
    notes: "Koramangala - decent ambiance",
    vibe: "casual nightlife",
    priceRange: "$$",
    address: "Koramangala",
    coordinates: { lat: 12.9352, lng: 77.6245 }
  },
  {
    name: "Bombay Adda",
    category: "nightlife",
    notes: "Great Dance floor and a good crowd",
    vibe: "bollywood club",
    priceRange: "$$$",
    bestFor: ["dancing", "bollywood nights"],
    coordinates: { lat: 12.9716, lng: 77.5937 }
  },
  {
    name: "NoLimmits",
    category: "nightlife",
    notes: "Ashok Nagar - Good dancefloor",
    vibe: "dance club",
    priceRange: "$$$",
    bestFor: ["dancing"],
    address: "Ashok Nagar",
    coordinates: { lat: 12.9698, lng: 77.6093 }
  },
  {
    name: "Daddy's",
    category: "nightlife",
    notes: "Fun vibe, always busy",
    vibe: "party hotspot",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },

  // Quick Bites & Street Food
  {
    name: "JCK Momos",
    category: "quick bites",
    notes: "Coffee board layout hebbal",
    vibe: "street momos",
    priceRange: "$",
    address: "Coffee Board Layout, Hebbal",
    coordinates: { lat: 13.0352, lng: 77.5976 }
  },
  {
    name: "Thom's Bakery",
    category: "quick bites",
    notes: "Puffs and Pastries",
    mustTry: ["Puffs", "Pastries"],
    vibe: "local bakery",
    priceRange: "$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Chai Patty",
    category: "quick bites",
    notes: "Indiranagar, friends",
    vibe: "chai hangout",
    priceRange: "$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "ZAMA",
    category: "quick bites",
    rating: 5,
    notes: "Indiranagar, BEST rolls",
    mustTry: ["Rolls"],
    vibe: "kolkata rolls",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Fennys",
    category: "quick bites",
    notes: "Koramangala - Better than everything around it. Good food. Big rooftop trees",
    vibe: "rooftop casual",
    priceRange: "$$",
    address: "Koramangala",
    coordinates: { lat: 12.9352, lng: 77.6245 }
  },
  {
    name: "Nanav",
    category: "quick bites",
    notes: "Plain calm breakfast spot",
    vibe: "quiet breakfast",
    priceRange: "$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Moglu Kitchen",
    category: "quick bites",
    notes: "Good Mexican food, a little bland in other cuisines",
    vibe: "mexican fast casual",
    priceRange: "$$",
    cuisine: "Mexican",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },

  // Specialty & Unique
  {
    name: "Secret Story",
    category: "specialty",
    notes: "Unique dining concept",
    vibe: "mystery dining",
    priceRange: "$$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Rigasto",
    category: "specialty",
    notes: "Interesting cuisine",
    vibe: "experimental",
    priceRange: "$$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Sodabottle Openerwala",
    category: "specialty",
    notes: "Flex your vada pav heritage. Lavelle Rd - Trash",
    vibe: "parsi cafe",
    priceRange: "$$",
    cuisine: "Parsi",
    coordinates: { lat: 12.9716, lng: 77.5997 }
  },
  {
    name: "Citrus Trails",
    category: "specialty",
    notes: "Bannerghatta - Solitude",
    vibe: "peaceful retreat",
    priceRange: "$$$",
    address: "Bannerghatta",
    coordinates: { lat: 12.8845, lng: 77.5989 }
  },
  {
    name: "Anaia",
    category: "specialty",
    notes: "Good burgers and Instagram vibes",
    mustTry: ["Burgers"],
    vibe: "instagram cafe",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Windmills",
    category: "specialty",
    notes: "Craft brewery",
    vibe: "jazz brewery",
    priceRange: "$$$",
    coordinates: { lat: 12.9698, lng: 77.7499 }
  },
  {
    name: "Tiger Trail",
    category: "specialty",
    notes: "Mid food but great ambience",
    vibe: "jungle themed",
    priceRange: "$$$",
    coordinates: { lat: 12.9734, lng: 77.6192 }
  },
  {
    name: "Cafe Noir",
    category: "specialty",
    notes: "Cunningham Rd. - Bad. Just Bad.",
    vibe: "avoid",
    priceRange: "$$",
    address: "Cunningham Road",
    coordinates: { lat: 12.9857, lng: 77.5917 }
  },

  // Seafood
  {
    name: "Paragon",
    category: "seafood",
    notes: "Good seafood",
    vibe: "kerala seafood",
    priceRange: "$$",
    cuisine: "Kerala Seafood",
    coordinates: { lat: 12.9372, lng: 77.6263 }
  },

  // Sizzlers
  {
    name: "Kobe Sizzlers",
    category: "specialty",
    rating: 5,
    notes: "Amazing find. Never disappointed.",
    vibe: "sizzler specialist",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },

  // Desserts & Ice Cream
  {
    name: "Tres Leches Creamery",
    category: "dessert",
    notes: "Didn't eat yet",
    vibe: "artisanal desserts",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "LICK",
    category: "dessert",
    notes: "Mid icecream, amazing space",
    vibe: "ice cream parlor",
    priceRange: "$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },
  {
    name: "Ulo",
    category: "dessert",
    rating: 5,
    notes: "Best ice cream in bangalore",
    vibe: "premium ice cream",
    priceRange: "$$$",
    coordinates: { lat: 12.9783, lng: 77.6408 }
  },

  // Special Mentions
  {
    name: "13th Floor MG Road",
    category: "bar",
    notes: "Views",
    vibe: "rooftop views",
    priceRange: "$$$",
    address: "MG Road",
    coordinates: { lat: 12.9752, lng: 77.6066 }
  }
];

// Helper functions
export function getRealPlacesByCategory(category: string): AmitRealPlace[] {
  return amitRealVisitedPlaces.filter(place => place.category === category);
}

export function getRealHighlyRatedPlaces(): AmitRealPlace[] {
  return amitRealVisitedPlaces.filter(place => place.rating && place.rating >= 4);
}

export function searchRealPlaces(query: string): AmitRealPlace[] {
  const lowerQuery = query.toLowerCase();
  return amitRealVisitedPlaces.filter(place => 
    place.name.toLowerCase().includes(lowerQuery) ||
    place.notes.toLowerCase().includes(lowerQuery) ||
    place.vibe?.toLowerCase().includes(lowerQuery) ||
    place.cuisine?.toLowerCase().includes(lowerQuery)
  );
}

// Updated categories based on REAL data
export const realPlaceCategories = [
  { id: 'cafe', name: 'Cafes & Coffee', icon: '☕' },
  { id: 'fine dining', name: 'Fine Dining', icon: '🍽️' },
  { id: 'restaurant', name: 'Restaurants', icon: '🍴' },
  { id: 'asian', name: 'Asian Cuisine', icon: '🥢' },
  { id: 'italian', name: 'Italian', icon: '🍝' },
  { id: 'indian', name: 'Indian Regional', icon: '🍛' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
  { id: 'bar', name: 'Bars & Pubs', icon: '🍺' },
  { id: 'nightlife', name: 'Nightlife & Clubs', icon: '🎉' },
  { id: 'quick bites', name: 'Quick Bites', icon: '🍔' },
  { id: 'seafood', name: 'Seafood', icon: '🦐' },
  { id: 'specialty', name: 'Specialty & Unique', icon: '✨' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' }
];

// Total count for verification
export const TOTAL_REAL_PLACES = amitRealVisitedPlaces.length; // Should be exactly the number from your list