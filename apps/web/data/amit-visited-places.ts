import type { CreatePlace } from '../lib/validations'

// Amit's personally visited places in Indiranagar
export const AMIT_VISITED_PLACES: CreatePlace[] = [
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
    name: "Hole In The Wall Cafe",
    description: "Tiny breakfast spot famous for their fluffy pancakes, waffles, and hearty American breakfast. Always has a queue on weekends.",
    latitude: 12.9688,
    longitude: 77.6405,
    rating: 4.5,
    category: "Cafe",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Small space, limited seating",
    best_time_to_visit: "Weekday mornings 8-10 AM",
    has_amit_visited: true
  },
  
  // Restaurants & Bars
  {
    name: "The Black Rabbit",
    description: "Gastropub with eclectic decor, craft cocktails, and global cuisine. Known for their weekend brunches and live sports screenings.",
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
    name: "Toast & Tonic",
    description: "Sophisticated dining with a focus on gin-based cocktails and modern European cuisine. Beautiful interiors with a colonial touch.",
    latitude: 12.9698,
    longitude: 77.6432,
    rating: 4.4,
    category: "Restaurant & Bar",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Ground floor, valet parking available",
    best_time_to_visit: "Dinner 7:30-10:30 PM",
    has_amit_visited: true
  },
  {
    name: "The Permit Room",
    description: "South Indian bar with a modern twist. Serves traditional drinks and bar snacks in a nostalgic setting reminiscent of old permit rooms.",
    latitude: 12.9742,
    longitude: 77.6396,
    rating: 4.3,
    category: "Restaurant & Bar",
    weather_suitability: ["cloudy", "cool"],
    accessibility_info: "Ground floor, narrow entrance",
    best_time_to_visit: "Evening 6-11 PM",
    has_amit_visited: true
  },
  
  // Street Food & Quick Bites
  {
    name: "Sony's Rolls",
    description: "Legendary late-night roll joint serving Kolkata-style kathi rolls. A must-visit for post-party hunger pangs.",
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
    name: "Chinita",
    description: "Authentic Mexican restaurant with vibrant decor, live music on weekends, and an extensive tequila menu.",
    latitude: 12.9725,
    longitude: 77.6415,
    rating: 4.3,
    category: "Restaurant",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Ground floor, wheelchair accessible",
    best_time_to_visit: "Lunch 12-3 PM or Dinner 7-10 PM",
    has_amit_visited: true
  },
  
  // Shopping & Lifestyle
  {
    name: "Soul Santé Cafe",
    description: "Health-focused cafe in a garden setting. Offers organic meals, smoothie bowls, and hosts wellness workshops.",
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
    name: "Blossom Book House",
    description: "Iconic second-hand bookstore with floor-to-ceiling shelves. A paradise for book lovers looking for rare finds and good deals.",
    latitude: 12.9761,
    longitude: 77.6386,
    rating: 4.5,
    category: "Bookstore",
    weather_suitability: ["rainy", "hot"],
    accessibility_info: "Narrow aisles, ground floor only",
    best_time_to_visit: "Afternoon 3-6 PM",
    has_amit_visited: true
  },
  
  // Breweries
  {
    name: "Arbor Brewing Company",
    description: "Award-winning microbrewery with American-style craft beers, wood-fired pizzas, and a spacious beer garden.",
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
    description: "Jazz-themed microbrewery with live performances, craft beers, and continental cuisine. Known for their wheat beers.",
    latitude: 12.9688,
    longitude: 77.6401,
    rating: 4.3,
    category: "Brewery",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Ground floor accessible, live music area upstairs",
    best_time_to_visit: "Evening 7-11 PM for live jazz",
    has_amit_visited: true
  },
  
  // Parks & Recreation
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
  
  // Cultural & Art Spaces
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
  
  // More Restaurants
  {
    name: "Byg Brewski Brewing Company",
    description: "Massive brewery with multiple bars, restaurants, and event spaces. Known for their craft beers and live entertainment.",
    latitude: 12.9701,
    longitude: 77.6099,
    rating: 4.3,
    category: "Brewery",
    weather_suitability: ["sunny", "cool"],
    accessibility_info: "Fully accessible, ample parking",
    best_time_to_visit: "Weekend afternoons",
    has_amit_visited: true
  },
  {
    name: "The Fatty Bao",
    description: "Asian gastropub serving innovative dim sum, ramen, and cocktails with a modern twist. Trendy ambiance.",
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
    name: "Gilly's Redefined",
    description: "Upscale dining with a focus on grills, steaks, and seafood. Elegant interiors and extensive wine list.",
    latitude: 12.9694,
    longitude: 77.6416,
    rating: 4.4,
    category: "Restaurant",
    weather_suitability: ["cool", "cloudy"],
    accessibility_info: "Ground floor, valet parking",
    best_time_to_visit: "Dinner 7:30-10:30 PM",
    has_amit_visited: true
  },
  
  // Continue with more places...
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
  }
]

// Note: This is a subset of the 186 places. The full list would be too large for a single response.
// Additional places can be added following the same structure.