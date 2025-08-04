export interface AmitPlace {
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
}

export const amitVisitedPlaces: AmitPlace[] = [
  // Cafes & Coffee
  {
    name: "Urban Solace",
    category: "cafe",
    notes: "Great cafe experience",
    vibe: "peaceful",
    priceRange: "$$"
  },
  {
    name: "The Roastery",
    category: "cafe",
    notes: "Quality coffee spot",
    vibe: "modern",
    priceRange: "$$"
  },
  {
    name: "Writer's Cafe",
    category: "cafe",
    notes: "Iced teas (empty always)",
    vibe: "quiet",
    priceRange: "$"
  },
  {
    name: "Dyu Art Cafe",
    category: "cafe",
    notes: "Great Banoffee pie",
    mustTry: ["Banoffee pie"],
    vibe: "artistic",
    priceRange: "$$"
  },
  {
    name: "Lazy Suzy",
    category: "cafe",
    notes: "Hazelnut Hot chocolate",
    mustTry: ["Hazelnut Hot chocolate"],
    vibe: "cozy",
    priceRange: "$$"
  },
  {
    name: "Animane",
    category: "cafe",
    notes: "Good coffee, has benches outside",
    vibe: "outdoor seating",
    priceRange: "$$"
  },
  {
    name: "Cafe Max",
    category: "cafe",
    notes: "Great food and peace",
    vibe: "peaceful",
    priceRange: "$$"
  },
  {
    name: "Cumulus Cafe",
    category: "cafe",
    notes: "Art museum - Views",
    vibe: "artistic",
    priceRange: "$$$"
  },
  {
    name: "Subko Coffee",
    category: "cafe",
    notes: "Good in off hours",
    vibe: "specialty coffee",
    priceRange: "$$$"
  },
  {
    name: "Subko Ajji",
    category: "cafe",
    notes: "Best rustic looking cafe in BLR",
    vibe: "rustic",
    priceRange: "$$$"
  },
  {
    name: "Ner.lu Cafe",
    category: "cafe",
    notes: "Quaint, tucked away, can go here to sit down and talk to friends over great coffee and light food (try their Saigon special)",
    mustTry: ["Saigon special"],
    vibe: "intimate",
    priceRange: "$$"
  },
  {
    name: "3rd Wave",
    category: "cafe",
    notes: "on 6th main - Great spot for a chill eavesdropping evening",
    vibe: "people watching",
    priceRange: "$$"
  },
  {
    name: "Havu Cafe",
    category: "cafe",
    notes: "80ft Rd Indiranagar - great roast chicken salad with avocado, good open mushroom sandwich. Cool chill ambience",
    mustTry: ["Roast chicken salad with avocado", "Open mushroom sandwich"],
    vibe: "chill",
    priceRange: "$$"
  },
  {
    name: "Temple of the Senses",
    category: "cafe",
    notes: "Great smoothie bowls",
    mustTry: ["Smoothie bowls"],
    vibe: "healthy",
    priceRange: "$$"
  },
  {
    name: "Monkey Tree Cafe",
    category: "cafe",
    notes: "Wisdor, good sandwiches and can sit outside in the garden",
    vibe: "garden seating",
    priceRange: "$$"
  },
  {
    name: "Blue Tokai",
    category: "cafe",
    notes: "Indiranagar - good to work alone from during the day",
    vibe: "work friendly",
    priceRange: "$$"
  },
  {
    name: "Humble Bean",
    category: "cafe",
    notes: "A good place to kick back and decompress",
    vibe: "relaxed",
    priceRange: "$$"
  },
  {
    name: "Kink Coffee",
    category: "cafe",
    notes: "Pretty good benches on the road and decent coffee",
    vibe: "street seating",
    priceRange: "$$"
  },
  {
    name: "Nuage Cafe",
    category: "cafe",
    notes: "Good chicken steak",
    mustTry: ["Chicken steak"],
    vibe: "casual",
    priceRange: "$$"
  },
  {
    name: "By2Coffee",
    category: "cafe",
    notes: "Opp CTR, better than CTR",
    vibe: "local favorite",
    priceRange: "$"
  },
  {
    name: "Brezelhaus",
    category: "cafe",
    notes: "Good place to hangout but no AC",
    vibe: "casual hangout",
    priceRange: "$$"
  },
  {
    name: "Copper and Clove",
    category: "cafe",
    notes: "Cool ambience plus book store plus decent smoothies",
    vibe: "bookstore cafe",
    priceRange: "$$"
  },

  // Fine Dining & Premium
  {
    name: "31st Floor - High Ultra Lounge",
    category: "fine dining",
    rating: 5,
    notes: "Amazing views and experience",
    vibe: "luxurious",
    priceRange: "$$$$",
    bestFor: ["special occasions", "dates"]
  },
  {
    name: "13th Floor MG Road",
    category: "fine dining",
    notes: "Views",
    vibe: "rooftop",
    priceRange: "$$$",
    bestFor: ["dates", "celebrations"]
  },
  {
    name: "RIM NAAM",
    category: "fine dining",
    rating: 5,
    notes: "Amazing 'Big Date' place",
    vibe: "romantic",
    priceRange: "$$$$",
    bestFor: ["special dates", "anniversaries"]
  },
  {
    name: "Swwing",
    category: "fine dining",
    notes: "Indiranagar - Great Date setting and an interesting menu",
    vibe: "romantic",
    priceRange: "$$$",
    bestFor: ["dates"]
  },
  {
    name: "Salt",
    category: "fine dining",
    notes: "Good food, good ambience, good service, Overpriced",
    vibe: "upscale",
    priceRange: "$$$$"
  },
  {
    name: "Muro",
    category: "fine dining",
    rating: 5,
    notes: "Gorgeous place, inspired cocktails, interesting food presentation, great service",
    vibe: "sophisticated",
    priceRange: "$$$$",
    bestFor: ["special occasions"]
  },
  {
    name: "MIRTH",
    category: "fine dining",
    rating: 5,
    notes: "Great indoor dining experience, premium",
    vibe: "premium",
    priceRange: "$$$$"
  },
  {
    name: "Jamavar",
    category: "fine dining",
    notes: "Leela palace - Amazing for anniversaries and parents will definitely love it",
    vibe: "traditional luxury",
    priceRange: "$$$$",
    bestFor: ["anniversaries", "family celebrations"]
  },
  {
    name: "Dakshin",
    category: "fine dining",
    notes: "South Indian fine dining",
    vibe: "traditional",
    priceRange: "$$$"
  },
  {
    name: "Alba",
    category: "fine dining",
    notes: "Great Italian food",
    vibe: "elegant",
    priceRange: "$$$"
  },
  {
    name: "Olive Beach",
    category: "fine dining",
    notes: "Great ambience, mid food, good date place choice",
    vibe: "beachside",
    priceRange: "$$$",
    bestFor: ["dates"]
  },
  {
    name: "Bastian",
    category: "fine dining",
    notes: "Great ambience",
    vibe: "modern",
    priceRange: "$$$"
  },

  // Casual Dining & Restaurants
  {
    name: "Koshys",
    category: "restaurant",
    rating: 4,
    notes: "Flex your bangalore knowledge",
    vibe: "heritage",
    priceRange: "$$",
    bestFor: ["breakfast", "nostalgia"]
  },
  {
    name: "The Bangalore Cafe",
    category: "restaurant",
    notes: "Near Richmond - Late night coffee",
    vibe: "late night",
    priceRange: "$$"
  },
  {
    name: "21A",
    category: "restaurant",
    notes: "Easy sit and talk ambience",
    vibe: "conversational",
    priceRange: "$$"
  },
  {
    name: "Smoke House Deli",
    category: "restaurant",
    notes: "Go for brunch with friends from outta town",
    vibe: "brunch spot",
    priceRange: "$$$",
    bestFor: ["brunch", "visitors"]
  },
  {
    name: "Pangeo",
    category: "restaurant",
    notes: "Huge space, great for corporate or family settings",
    vibe: "spacious",
    priceRange: "$$$",
    bestFor: ["groups", "corporate"]
  },
  {
    name: "Cafe Terra",
    category: "restaurant",
    notes: "Good dining experience",
    vibe: "casual",
    priceRange: "$$"
  },
  {
    name: "Nevermind",
    category: "restaurant",
    notes: "Decent food, good for not too close friend groups",
    vibe: "casual groups",
    priceRange: "$$"
  },
  {
    name: "Vidyarthi Bhavan",
    category: "restaurant",
    notes: "I mean it's alright",
    vibe: "heritage",
    priceRange: "$"
  },
  {
    name: "CTR",
    category: "restaurant",
    notes: "Meh.",
    vibe: "overrated",
    priceRange: "$"
  },
  {
    name: "Govt Canteen",
    category: "restaurant",
    notes: "Vishwesaraya museum",
    vibe: "budget friendly",
    priceRange: "$"
  },
  {
    name: "Sante Spa Cuisine",
    category: "restaurant",
    notes: "Very pleasant and soothing ambience, great food options and smoothie bowls",
    vibe: "healthy",
    priceRange: "$$$"
  },
  {
    name: "Clean and Green",
    category: "restaurant",
    notes: "Good smoothie bowls",
    mustTry: ["Smoothie bowls"],
    vibe: "healthy",
    priceRange: "$$"
  },
  {
    name: "Kale Salads and Co",
    category: "restaurant",
    notes: "Good easy salads",
    vibe: "healthy",
    priceRange: "$$"
  },
  {
    name: "Kaavu",
    category: "restaurant",
    notes: "Decent for large groups and corporates",
    vibe: "group dining",
    priceRange: "$$"
  },
  {
    name: "Roomali",
    category: "restaurant",
    notes: "Church Street - Decent north Indian food",
    vibe: "casual",
    priceRange: "$$"
  },
  {
    name: "Concu",
    category: "restaurant",
    notes: "Good AC and ambience but mid food",
    vibe: "comfortable",
    priceRange: "$$"
  },

  // Asian & International
  {
    name: "Based on a True Story",
    category: "asian",
    notes: "Interesting concept restaurant",
    vibe: "unique",
    priceRange: "$$$"
  },
  {
    name: "Lucky Chan",
    category: "asian",
    notes: "Good Asian food",
    vibe: "modern asian",
    priceRange: "$$"
  },
  {
    name: "Dam's Kitchen",
    category: "asian",
    notes: "Korean",
    vibe: "authentic korean",
    priceRange: "$$"
  },
  {
    name: "Mamagoto",
    category: "asian",
    notes: "Cool wall art",
    vibe: "quirky",
    priceRange: "$$"
  },
  {
    name: "Burma Burma",
    category: "asian",
    notes: "Over rated",
    vibe: "themed",
    priceRange: "$$$"
  },
  {
    name: "Chinita",
    category: "asian",
    notes: "Mexican - Great quesadillas",
    mustTry: ["Quesadillas"],
    vibe: "casual mexican",
    priceRange: "$$"
  },
  {
    name: "Phobidden Fruit",
    category: "asian",
    notes: "Great summer rolls and glass noodles",
    mustTry: ["Summer rolls", "Glass noodles"],
    vibe: "vietnamese",
    priceRange: "$$"
  },
  {
    name: "Wanley",
    category: "asian",
    notes: "Indiranagar - Easy and Simple Chinese place run by immigrants",
    vibe: "authentic chinese",
    priceRange: "$$"
  },
  {
    name: "Kopitiam Lah",
    category: "asian",
    notes: "Expensive, looks good, tastes mid, will probably close pretty soon if not for bangaloreans overspending kink",
    vibe: "instagram worthy",
    priceRange: "$$$"
  },
  {
    name: "Kazan",
    category: "asian",
    notes: "Decent experience, great menu, mid food",
    vibe: "japanese",
    priceRange: "$$$"
  },
  {
    name: "Izanagi",
    category: "asian",
    notes: "Wide menu, great staff, good food atleast the standard menu items",
    vibe: "japanese",
    priceRange: "$$$"
  },
  {
    name: "Kuuraku",
    category: "asian",
    notes: "Good food, fast service, interesting ambience",
    vibe: "ramen bar",
    priceRange: "$$"
  },
  {
    name: "Uno Izakaya",
    category: "asian",
    notes: "Good sushi and Japanese fried chicken",
    mustTry: ["Sushi", "Japanese fried chicken"],
    vibe: "japanese pub",
    priceRange: "$$$"
  },
  {
    name: "Harumi",
    category: "asian",
    notes: "Good sushi and yakitori",
    mustTry: ["Sushi", "Yakitori"],
    vibe: "japanese",
    priceRange: "$$$"
  },
  {
    name: "Mandarin Box",
    category: "asian",
    notes: "Asian cuisine",
    vibe: "pan-asian",
    priceRange: "$$"
  },
  {
    name: "Shiro",
    category: "asian",
    notes: "Asian dining",
    vibe: "upscale asian",
    priceRange: "$$$"
  },
  {
    name: "DOFU",
    category: "asian",
    notes: "Good hong kong hawker style noodles and rice bowls, walk in, only 5 seats",
    mustTry: ["Hong kong style noodles", "Rice bowls"],
    vibe: "authentic street food",
    priceRange: "$$"
  },
  {
    name: "Kawaii",
    category: "asian",
    notes: "Indiranagar - Has great Japanese mochi desserts in different flavors, only them",
    mustTry: ["Mochi desserts"],
    vibe: "dessert specialist",
    priceRange: "$$"
  },

  // Italian
  {
    name: "Little Italy",
    category: "italian",
    notes: "Classic Italian chain",
    vibe: "family friendly",
    priceRange: "$$"
  },
  {
    name: "Pasta Street",
    category: "italian",
    notes: "Good pasta options",
    vibe: "casual",
    priceRange: "$$"
  },
  {
    name: "Dolci",
    category: "italian",
    rating: 5,
    notes: "Best Tiramisu",
    mustTry: ["Tiramisu"],
    vibe: "dessert focused",
    priceRange: "$$"
  },
  {
    name: "Bologna",
    category: "italian",
    notes: "Overhyped but decent food",
    vibe: "trendy",
    priceRange: "$$$"
  },
  {
    name: "Ciros",
    category: "italian",
    notes: "Good woodfire pizzas and serves Toit brews",
    mustTry: ["Woodfire pizzas"],
    vibe: "casual",
    priceRange: "$$"
  },
  {
    name: "Spettacolare",
    category: "italian",
    notes: "Great tiramisu and good Italian food",
    mustTry: ["Tiramisu"],
    vibe: "authentic",
    priceRange: "$$$"
  },
  {
    name: "Amicii",
    category: "italian",
    notes: "Amazing ambience and crowd",
    vibe: "upscale social",
    priceRange: "$$$"
  },

  // Indian Regional
  {
    name: "Bangalore Dhabha",
    category: "indian",
    notes: "North Indian dhaba style",
    vibe: "dhaba",
    priceRange: "$$"
  },
  {
    name: "Araku",
    category: "indian",
    notes: "Regional Indian cuisine",
    vibe: "regional",
    priceRange: "$$"
  },
  {
    name: "Madurai Hut",
    category: "indian",
    notes: "Tamil Nadu cuisine",
    vibe: "south indian",
    priceRange: "$$"
  },
  {
    name: "Tandoori Taal",
    category: "indian",
    notes: "North Indian",
    vibe: "north indian",
    priceRange: "$$"
  },
  {
    name: "Malabar Hotel",
    category: "indian",
    notes: "Kaggadasapura (Idiappam)",
    mustTry: ["Idiappam"],
    vibe: "kerala cuisine",
    priceRange: "$"
  },
  {
    name: "Qissa",
    category: "indian",
    notes: "Baklava and Idlis shaped like pizzas",
    mustTry: ["Baklava", "Pizza idlis"],
    vibe: "fusion",
    priceRange: "$$"
  },
  {
    name: "Savoury",
    category: "indian",
    notes: "Iffa dejaj",
    mustTry: ["Iffa dejaj"],
    vibe: "mughlai",
    priceRange: "$$"
  },
  {
    name: "KARAMA",
    category: "indian",
    notes: "Great mutton mandi biryani, a little overpriced but ok",
    mustTry: ["Mutton mandi biryani"],
    vibe: "arabic indian",
    priceRange: "$$$"
  },
  {
    name: "Thapakkatty",
    category: "indian",
    notes: "Bad.",
    vibe: "avoid",
    priceRange: "$$"
  },
  {
    name: "Habba Kadal",
    category: "indian",
    notes: "Kashmiri place, good vibes, bland food but high quality",
    vibe: "kashmiri",
    priceRange: "$$$"
  },
  {
    name: "Bengaluru Oota Company",
    category: "indian",
    rating: 5,
    notes: "The greatest evening dinner experience I had. My most favorite Biryani was introduced to me here. Amazing place and people",
    mustTry: ["Biryani"],
    vibe: "authentic karnataka",
    priceRange: "$$$",
    bestFor: ["dinner", "authentic experience"]
  },
  {
    name: "Mahesh Lunch Home",
    category: "indian",
    notes: "Good seafood, fish fry and mangalore style biryani",
    mustTry: ["Fish fry", "Mangalore biryani"],
    vibe: "coastal",
    priceRange: "$$"
  },
  {
    name: "Lucknow Street",
    category: "indian",
    notes: "Good galouti kebabs and parathas",
    mustTry: ["Galouti kebabs", "Parathas"],
    vibe: "lucknowi",
    priceRange: "$$"
  },
  {
    name: "Arambam",
    category: "indian",
    notes: "Indiranagar - good south indian tiffin place",
    vibe: "tiffin center",
    priceRange: "$"
  },
  {
    name: "Suvai",
    category: "indian",
    notes: "Tamilnadu style restaurant, good kothu parotta",
    mustTry: ["Kothu parotta"],
    vibe: "tamil cuisine",
    priceRange: "$$"
  },
  {
    name: "Imperial",
    category: "indian",
    notes: "Indiranagar - Good kebabs and tandooris",
    mustTry: ["Kebabs", "Tandoori items"],
    vibe: "north indian",
    priceRange: "$$"
  },
  {
    name: "Navu Project",
    category: "indian",
    notes: "Great food, small place, amazing staff suggestions",
    vibe: "experimental indian",
    priceRange: "$$$"
  },
  {
    name: "Kerala Pavilion",
    category: "indian",
    notes: "Pretty good appams and stew",
    mustTry: ["Appams", "Stew"],
    vibe: "kerala",
    priceRange: "$$"
  },
  {
    name: "Rumi",
    category: "indian",
    rating: 5,
    notes: "Indiranagar - amazing north Indian food (awadhi). They serve a mean galouti and all the other starters are bangers too",
    mustTry: ["Galouti kebab", "All starters"],
    vibe: "awadhi",
    priceRange: "$$$"
  },
  {
    name: "Karim's",
    category: "indian",
    notes: "Ashok Nagar - good mutton dishes",
    mustTry: ["Mutton dishes"],
    vibe: "mughlai",
    priceRange: "$$"
  },

  // Bars & Pubs
  {
    name: "The Druid Garden",
    category: "bar",
    notes: "Great pub atmosphere",
    vibe: "garden pub",
    priceRange: "$$"
  },
  {
    name: "The Biere Club",
    category: "bar",
    notes: "Lavelle road",
    vibe: "craft beer",
    priceRange: "$$"
  },
  {
    name: "Balcony Bar",
    category: "bar",
    notes: "Go here if Bob's is Full, Has buffet",
    vibe: "rooftop",
    priceRange: "$$"
  },
  {
    name: "Candles Brewhouse",
    category: "bar",
    notes: "Hebbal - 14th floor, good views",
    vibe: "rooftop brewery",
    priceRange: "$$$"
  },
  {
    name: "Murphys",
    category: "bar",
    rating: 5,
    notes: "Insane Entry +++++",
    vibe: "irish pub",
    priceRange: "$$$"
  },
  {
    name: "One X Commune",
    category: "bar",
    notes: "Good for a picture on the rooftop and just one beer",
    vibe: "instagram spot",
    priceRange: "$$"
  },
  {
    name: "Three Dots and a Dash",
    category: "bar",
    notes: "Decent ambiance + has Toit beer available, Good fish and chips",
    mustTry: ["Fish and chips"],
    vibe: "casual pub",
    priceRange: "$$"
  },
  {
    name: "Jook Taproom",
    category: "bar",
    notes: "Mid",
    vibe: "average",
    priceRange: "$$"
  },
  {
    name: "Hangover",
    category: "bar",
    notes: "Indiranagar - Mid, decent date place",
    vibe: "casual date spot",
    priceRange: "$$"
  },
  {
    name: "Pecos",
    category: "bar",
    notes: "Indiranagar - 2010 English playlist",
    vibe: "nostalgic",
    priceRange: "$$"
  },
  {
    name: "1131",
    category: "bar",
    notes: "Indiranagar - Good for groups",
    vibe: "group friendly",
    priceRange: "$$"
  },
  {
    name: "Arbor Brewing Company",
    category: "bar",
    notes: "Funny beer and good crowd",
    vibe: "brewery",
    priceRange: "$$"
  },
  {
    name: "Float",
    category: "bar",
    notes: "HRBR - good beer and decent food",
    vibe: "brewery",
    priceRange: "$$"
  },
  {
    name: "Shangri La",
    category: "bar",
    notes: "A good place to get to know someone, top floor views",
    vibe: "rooftop date spot",
    priceRange: "$$$"
  },
  {
    name: "We: neighbourgood",
    category: "bar",
    notes: "Easy evening drinks, brewery, good bar bites",
    vibe: "neighborhood brewery",
    priceRange: "$$"
  },
  {
    name: "Chinlungs Brewery",
    category: "bar",
    notes: "Good and cheap bar bites, fun crowd, bad waitstaff",
    vibe: "budget brewery",
    priceRange: "$"
  },
  {
    name: "Hops Haus",
    category: "bar",
    notes: "Whitefield - decent beer and bites",
    vibe: "german brewery",
    priceRange: "$$"
  },
  {
    name: "Toast and Tonic",
    category: "bar",
    notes: "East village style bar. Decent food",
    vibe: "cocktail bar",
    priceRange: "$$$"
  },
  {
    name: "Bob's",
    category: "bar",
    notes: "Ashok Nagar - Big, same old Bob's, fresh paint",
    vibe: "sports bar",
    priceRange: "$$"
  },
  {
    name: "Dublin Windsor",
    category: "bar",
    notes: "Average irish style bar",
    vibe: "irish pub",
    priceRange: "$$"
  },
  {
    name: "Arena",
    category: "bar",
    notes: "100ft - Mid bar, decent food, but luckily very budget friendly",
    vibe: "budget bar",
    priceRange: "$"
  },

  // Nightlife & Clubs
  {
    name: "Sugar Factory - Reloaded",
    category: "nightlife",
    notes: "Dance floor",
    vibe: "club",
    priceRange: "$$$",
    bestFor: ["dancing", "parties"]
  },
  {
    name: "Social",
    category: "nightlife",
    notes: "Koramangala - decent ambiance",
    vibe: "casual nightlife",
    priceRange: "$$"
  },
  {
    name: "Bombay Adda",
    category: "nightlife",
    notes: "Great Dance floor and a good crowd",
    vibe: "dance club",
    priceRange: "$$$",
    bestFor: ["dancing"]
  },
  {
    name: "NoLimmits",
    category: "nightlife",
    notes: "Ashok Nagar - Good dancefloor",
    vibe: "dance club",
    priceRange: "$$$",
    bestFor: ["dancing"]
  },
  {
    name: "Daddy's",
    category: "nightlife",
    notes: "Fun vibe, always busy",
    vibe: "party spot",
    priceRange: "$$"
  },

  // Quick Bites & Street Food
  {
    name: "JCK Momos",
    category: "quick bites",
    notes: "Coffee board layout hebbal",
    vibe: "street food",
    priceRange: "$"
  },
  {
    name: "Thom's Bakery",
    category: "quick bites",
    notes: "Puffs and Pastries",
    mustTry: ["Puffs", "Pastries"],
    vibe: "bakery",
    priceRange: "$"
  },
  {
    name: "Chai Patty",
    category: "quick bites",
    notes: "Indiranagar, friends",
    vibe: "chai spot",
    priceRange: "$"
  },
  {
    name: "ZAMA",
    category: "quick bites",
    rating: 5,
    notes: "Indiranagar, BEST rolls",
    mustTry: ["Rolls"],
    vibe: "roll specialist",
    priceRange: "$$"
  },
  {
    name: "Fennys",
    category: "quick bites",
    notes: "Koramangala - Better than everything around it. Good food. Big rooftop trees",
    vibe: "rooftop casual",
    priceRange: "$$"
  },
  {
    name: "Nanav",
    category: "quick bites",
    notes: "Plain calm breakfast spot",
    vibe: "breakfast",
    priceRange: "$"
  },
  {
    name: "Moglu Kitchen",
    category: "quick bites",
    notes: "Good Mexican food, a little bland in other cuisines",
    vibe: "mexican fast casual",
    priceRange: "$$"
  },

  // Specialty & Unique
  {
    name: "Secret Story",
    category: "specialty",
    notes: "Unique dining concept",
    vibe: "mystery dining",
    priceRange: "$$$"
  },
  {
    name: "Rigasto",
    category: "specialty",
    notes: "Interesting cuisine",
    vibe: "experimental",
    priceRange: "$$$"
  },
  {
    name: "Sodabottle Openerwala",
    category: "specialty",
    notes: "Flex your vada pav heritage",
    vibe: "parsi",
    priceRange: "$$"
  },
  {
    name: "Citrus Trails",
    category: "specialty",
    notes: "Bannerghatta - Solitude",
    vibe: "peaceful escape",
    priceRange: "$$$"
  },
  {
    name: "Anaia",
    category: "specialty",
    notes: "Good burgers and Instagram vibes",
    mustTry: ["Burgers"],
    vibe: "instagram worthy",
    priceRange: "$$"
  },
  {
    name: "Sodabottle Opener Wala",
    category: "specialty",
    notes: "Lavelle Rd - Trash",
    vibe: "avoid",
    priceRange: "$$"
  },
  {
    name: "Windmills",
    category: "specialty",
    notes: "Craft brewery",
    vibe: "brewery",
    priceRange: "$$$"
  },
  {
    name: "Tiger Trail",
    category: "specialty",
    notes: "Mid food but great ambience",
    vibe: "ambience focused",
    priceRange: "$$$"
  },
  {
    name: "Cafe Noir",
    category: "specialty",
    notes: "Cunningham Rd. - Bad. Just Bad.",
    vibe: "avoid",
    priceRange: "$$"
  },

  // Seafood
  {
    name: "Paragon",
    category: "seafood",
    notes: "Good seafood",
    vibe: "coastal",
    priceRange: "$$"
  },

  // Other Specialty
  {
    name: "Kobe Sizzlers",
    category: "specialty",
    rating: 5,
    notes: "Amazing find. Never disappointed.",
    vibe: "sizzlers",
    priceRange: "$$"
  },

  // Desserts
  {
    name: "Tres Leches Creamery",
    category: "dessert",
    notes: "Didn't eat yet",
    vibe: "ice cream",
    priceRange: "$$"
  },
  {
    name: "LICK",
    category: "dessert",
    notes: "Mid icecream, amazing space",
    vibe: "ice cream parlor",
    priceRange: "$$"
  },
  {
    name: "Ulo",
    category: "dessert",
    rating: 5,
    notes: "Best ice cream in bangalore",
    vibe: "artisanal ice cream",
    priceRange: "$$$"
  }
];

// Helper function to get places by category
export function getPlacesByCategory(category: string): AmitPlace[] {
  return amitVisitedPlaces.filter(place => place.category === category);
}

// Helper function to get highly rated places (4+ rating)
export function getHighlyRatedPlaces(): AmitPlace[] {
  return amitVisitedPlaces.filter(place => place.rating && place.rating >= 4);
}

// Helper function to search places by name
export function searchPlaces(query: string): AmitPlace[] {
  const lowerQuery = query.toLowerCase();
  return amitVisitedPlaces.filter(place => 
    place.name.toLowerCase().includes(lowerQuery) ||
    place.notes.toLowerCase().includes(lowerQuery)
  );
}

// Categories for filtering
export const placeCategories = [
  { id: 'cafe', name: 'Cafes & Coffee', icon: '☕' },
  { id: 'fine dining', name: 'Fine Dining', icon: '🍽️' },
  { id: 'restaurant', name: 'Restaurants', icon: '🍴' },
  { id: 'asian', name: 'Asian Cuisine', icon: '🥢' },
  { id: 'italian', name: 'Italian', icon: '🍝' },
  { id: 'indian', name: 'Indian Regional', icon: '🍛' },
  { id: 'bar', name: 'Bars & Pubs', icon: '🍺' },
  { id: 'nightlife', name: 'Nightlife & Clubs', icon: '🎉' },
  { id: 'quick bites', name: 'Quick Bites', icon: '🍔' },
  { id: 'seafood', name: 'Seafood', icon: '🦐' },
  { id: 'specialty', name: 'Specialty & Unique', icon: '✨' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' }
];