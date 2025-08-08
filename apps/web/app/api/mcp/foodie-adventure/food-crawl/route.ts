import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Foodie Adventure Food Crawl API is ready. Use POST to create food crawls.',
    endpoints: {
      POST: {
        description: 'Create a themed food crawl',
        parameters: {
          theme: 'string',
          budget: 'number (optional)',
          budget_per_person: 'number (optional)',
          duration: 'string (optional)',
          group_size: 'number (optional)',
          start_location: 'string (optional)'
        }
      }
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const params = await request.json();
    
    // Define various food crawl themes
    const crawls = {
      'Classic Bangalore': {
        title: "Classic Bangalore Food Crawl",
        theme: "Classic Bangalore",
        stops: [
          { name: "Brahmin's Coffee Bar", type: "Breakfast", speciality: "Idli Vada", price: 100, duration: "30 min", address: "Hanumantharaya Lane" },
          { name: "CTR", type: "Snack", speciality: "Benne Masala Dosa", price: 150, duration: "45 min", address: "7th Cross, Malleshwaram" },
          { name: "Koshy's", type: "Lunch", speciality: "Mutton Cutlet", price: 400, duration: "1 hour", address: "St. Marks Road" },
          { name: "Corner House", type: "Dessert", speciality: "Death by Chocolate", price: 250, duration: "30 min", address: "Indiranagar" }
        ],
        total_cost: 900,
        total_time: "2.5 hours",
        route_map: "Start at Brahmin's → Walk to CTR (10 min) → Auto to Koshy's (15 min) → Walk to Corner House (5 min)",
        local_tips: ["Go early for Brahmin's", "CTR gets crowded after 11 AM", "Book ahead at Koshy's on weekends"]
      },
      'Pub Crawl': {
        title: "Indiranagar Pub Crawl",
        theme: "Pub Crawl",
        stops: [
          { name: "Toit", type: "Brewery", speciality: "Craft Beer & Pizza", price: 600, duration: "1 hour", address: "100 Feet Road" },
          { name: "The Humming Tree", type: "Live Music Bar", speciality: "Cocktails", price: 500, duration: "1 hour", address: "12th Main" },
          { name: "Monkey Bar", type: "Gastropub", speciality: "Small Plates", price: 700, duration: "1.5 hours", address: "Wood Street" },
          { name: "The Black Rabbit", type: "Sports Bar", speciality: "Bar Bites", price: 400, duration: "45 min", address: "770, 12th Main" }
        ],
        total_cost: 2200,
        total_time: "4 hours",
        route_map: "Start at Toit → Walk to Humming Tree (8 min) → Walk to Monkey Bar (10 min) → Walk to Black Rabbit (5 min)",
        local_tips: ["Start early to avoid crowds", "Book tables on weekends", "Carry ID proof"]
      },
      'Dessert Trail': {
        title: "Sweet Tooth's Paradise",
        theme: "Dessert Trail",
        stops: [
          { name: "Glen's Bakehouse", type: "Bakery", speciality: "Red Velvet Cake", price: 180, duration: "30 min", address: "100 Feet Road" },
          { name: "Lavonne", type: "Patisserie", speciality: "Croissants", price: 250, duration: "45 min", address: "St. Marks Road" },
          { name: "Corner House", type: "Ice Cream", speciality: "Hot Chocolate Fudge", price: 200, duration: "30 min", address: "Indiranagar" },
          { name: "Smoor", type: "Chocolatier", speciality: "Chocolate Fondant", price: 350, duration: "45 min", address: "12th Main" }
        ],
        total_cost: 980,
        total_time: "2.5 hours",
        route_map: "Start at Glen's → Auto to Lavonne (15 min) → Walk to Corner House (10 min) → Walk to Smoor (8 min)",
        local_tips: ["Best enjoyed with friends", "Skip lunch before starting", "Carry water"]
      },
      'Street Food Journey': {
        title: "Street Food Safari",
        theme: "Street Food Journey",
        stops: [
          { name: "Shivaji Nagar", type: "Chaat", speciality: "Pani Puri", price: 50, duration: "20 min", address: "Shivaji Nagar" },
          { name: "VV Puram Food Street", type: "Various", speciality: "Congress Bun", price: 80, duration: "45 min", address: "VV Puram" },
          { name: "Thindi Beedi", type: "Snacks", speciality: "Akki Roti", price: 60, duration: "30 min", address: "VV Puram" },
          { name: "Russell Market", type: "Rolls", speciality: "Kathi Roll", price: 120, duration: "30 min", address: "Russell Market" }
        ],
        total_cost: 310,
        total_time: "2 hours",
        route_map: "Start at Shivaji Nagar → Auto to VV Puram (20 min) → Walk around food street → Auto to Russell Market (15 min)",
        local_tips: ["Carry cash", "Go with empty stomach", "Best time is evening"]
      },
      'Cafe Hopping': {
        title: "Caffeine Adventure",
        theme: "Cafe Hopping",
        stops: [
          { name: "Third Wave Coffee", type: "Specialty Coffee", speciality: "Pour Over", price: 250, duration: "45 min", address: "Indiranagar" },
          { name: "Blue Tokai", type: "Coffee Roastery", speciality: "Cold Brew", price: 200, duration: "30 min", address: "100 Feet Road" },
          { name: "The Flying Squirrel", type: "Artisan Coffee", speciality: "Nitro Coffee", price: 280, duration: "45 min", address: "12th Main" },
          { name: "Dyu Art Cafe", type: "Art Cafe", speciality: "Matcha Latte", price: 220, duration: "1 hour", address: "80 Feet Road" }
        ],
        total_cost: 950,
        total_time: "3 hours",
        route_map: "Start at Third Wave → Walk to Blue Tokai (10 min) → Walk to Flying Squirrel (12 min) → Auto to Dyu (10 min)",
        local_tips: ["Morning is best for coffee", "Try different brewing methods", "Ask for tasting notes"]
      },
      'Fine Dining Experience': {
        title: "Luxury Food Journey",
        theme: "Fine Dining Experience",
        stops: [
          { name: "Toast & Tonic", type: "European", speciality: "Gin & Small Plates", price: 800, duration: "1 hour", address: "Wood Street" },
          { name: "The Fatty Bao", type: "Asian", speciality: "Bao & Ramen", price: 900, duration: "1.5 hours", address: "100 Feet Road" },
          { name: "Caperberry", type: "Continental", speciality: "Tasting Menu", price: 1500, duration: "2 hours", address: "100 Feet Road" },
          { name: "Olive Beach", type: "Mediterranean", speciality: "Wood-fired Pizza", price: 1200, duration: "1.5 hours", address: "Wood Street" }
        ],
        total_cost: 4400,
        total_time: "6 hours",
        route_map: "Start at Toast & Tonic → Walk to Fatty Bao (15 min) → Walk to Caperberry (8 min) → Walk to Olive Beach (10 min)",
        local_tips: ["Make reservations", "Dress code applies", "Perfect for special occasions"]
      },
      'Budget Foodie': {
        title: "Budget Bites Tour",
        theme: "Budget Foodie",
        stops: [
          { name: "Asha Tiffins", type: "South Indian", speciality: "Mini Meals", price: 80, duration: "30 min", address: "100 Feet Road" },
          { name: "Rolls On Wheels", type: "Rolls", speciality: "Chicken Roll", price: 100, duration: "20 min", address: "12th Main" },
          { name: "Veena Stores", type: "Breakfast", speciality: "Khara Bath", price: 40, duration: "25 min", address: "Malleshwaram" },
          { name: "Sri Sagar CTR", type: "Tiffin", speciality: "Benne Dosa", price: 60, duration: "30 min", address: "7th Cross" }
        ],
        total_cost: 280,
        total_time: "1.75 hours",
        route_map: "Start at Asha Tiffins → Walk to Rolls On Wheels (10 min) → Auto to Veena Stores (20 min) → Walk to CTR (5 min)",
        local_tips: ["Perfect for students", "All places accept cash only", "Go during off-peak hours"]
      },
      'Vegetarian Delight': {
        title: "Pure Veg Paradise",
        theme: "Vegetarian Delight",
        stops: [
          { name: "MTR", type: "Traditional", speciality: "Rava Idli", price: 120, duration: "45 min", address: "Lalbagh Road" },
          { name: "Sattvam", type: "North Indian", speciality: "Rajasthani Thali", price: 350, duration: "1 hour", address: "St. Marks Road" },
          { name: "Carrots", type: "Healthy Food", speciality: "Buddha Bowl", price: 400, duration: "45 min", address: "100 Feet Road" },
          { name: "Burma Burma", type: "Burmese Veg", speciality: "Tea Leaf Salad", price: 600, duration: "1 hour", address: "12th Main" }
        ],
        total_cost: 1470,
        total_time: "3.5 hours",
        route_map: "Start at MTR → Auto to Sattvam (20 min) → Auto to Carrots (15 min) → Walk to Burma Burma (10 min)",
        local_tips: ["MTR is crowded on weekends", "Try the Oh No Khow Suey at Burma Burma", "Carrots has vegan options"]
      },
      'Random Adventure': {
        title: "Mystery Food Quest",
        theme: "Random Adventure",
        stops: [
          { name: "Random Pick 1", type: "Surprise", speciality: "Chef's Special", price: 300, duration: "45 min", address: "100 Feet Road" },
          { name: "Random Pick 2", type: "Surprise", speciality: "House Favorite", price: 400, duration: "1 hour", address: "12th Main" },
          { name: "Random Pick 3", type: "Surprise", speciality: "Local Delicacy", price: 250, duration: "45 min", address: "CMH Road" },
          { name: "Random Pick 4", type: "Surprise", speciality: "Hidden Gem", price: 350, duration: "45 min", address: "80 Feet Road" }
        ],
        total_cost: 1300,
        total_time: "3.25 hours",
        route_map: "Mystery route - Let the adventure guide you!",
        local_tips: ["Be open to trying new things", "Ask locals for recommendations", "Document your journey"]
      }
    };

    // Get the requested theme or default to Classic Bangalore
    const theme = params.theme || 'Classic Bangalore';
    const crawlKey = Object.keys(crawls).find(key => 
      key.toLowerCase() === theme.toLowerCase() || 
      theme.toLowerCase().includes(key.toLowerCase())
    ) || 'Classic Bangalore';
    
    const selectedCrawl = crawls[crawlKey as keyof typeof crawls];
    
    // Adjust for budget if provided
    const budgetPerPerson = params.budget_per_person || params.budget || selectedCrawl.total_cost;
    const groupSize = params.group_size || params.groupSize || 2;
    const duration = params.duration || params.duration_hours || selectedCrawl.total_time;
    
    // Create response with additional metadata
    const response = {
      ...selectedCrawl,
      id: `crawl_${Date.now()}`,
      created_at: new Date().toISOString(),
      budget_per_person: budgetPerPerson,
      group_size: groupSize,
      total_budget: budgetPerPerson * groupSize,
      duration: duration,
      start_location: params.start_location || selectedCrawl.stops[0].address,
      weather_suitable: true,
      booking_required: selectedCrawl.total_cost > 2000,
      accessibility: {
        wheelchair_friendly: selectedCrawl.theme !== 'Street Food Journey',
        parking_available: true,
        public_transport: true
      }
    };

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error creating food crawl:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create food crawl' 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}