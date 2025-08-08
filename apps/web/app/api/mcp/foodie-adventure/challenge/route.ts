import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Foodie Adventure Challenge API is ready. Use POST to generate challenges.',
    endpoints: {
      POST: {
        description: 'Generate a food challenge',
        parameters: {
          difficulty: 'easy | medium | hard | legendary',
          time_limit: 'string (optional)',
          group_size: 'number (optional)',
          dietary_preferences: 'array (optional)'
        }
      }
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const params = await request.json();
    
    // Generate challenge based on difficulty
    const challenges = {
      easy: {
        title: "Indiranagar Starter Quest",
        difficulty: "easy",
        points: 100,
        time_limit: params.time_limit || "2 hours",
        objectives: [
          { task: "Try a dosa at any local restaurant", points: 30, place: "Brahmin's Coffee Bar" },
          { task: "Order a filter coffee", points: 20, place: "Third Wave Coffee" },
          { task: "Take a photo with your meal", points: 20, place: "Any restaurant" },
          { task: "Try one street food item", points: 30, place: "100 Feet Road" }
        ],
        rewards: ["Foodie Explorer Badge", "10% off next adventure"],
        special_rules: ["No food delivery apps allowed", "Must walk between locations"],
        group_size: params.group_size || 2,
        dietary_preferences: params.dietary_preferences || []
      },
      medium: {
        title: "Bangalore Food Trail",
        difficulty: "medium",
        points: 200,
        time_limit: params.time_limit || "3 hours",
        objectives: [
          { task: "Eat at 3 different cuisines", points: 60, place: "Indiranagar" },
          { task: "Try the spiciest dish on menu", points: 40, place: "Andhra Restaurant" },
          { task: "Order in Kannada", points: 30, place: "Local eatery" },
          { task: "Find a hidden gem restaurant", points: 40, place: "Side streets" },
          { task: "Try a dish you've never had", points: 30, place: "Your choice" }
        ],
        rewards: ["Spice Warrior Badge", "Free dessert voucher"],
        special_rules: ["Must try vegetarian and non-veg", "Share on social media"],
        group_size: params.group_size || 2,
        dietary_preferences: params.dietary_preferences || []
      },
      hard: {
        title: "Ultimate Foodie Challenge",
        difficulty: "hard",
        points: 350,
        time_limit: params.time_limit || "4 hours",
        objectives: [
          { task: "Complete a thali challenge", points: 80, place: "Koshy's" },
          { task: "Try 5 different chutneys", points: 60, place: "MTR" },
          { task: "Eat with hands only", points: 40, place: "Traditional restaurant" },
          { task: "Finish a family-size biryani", points: 100, place: "Meghana Foods" },
          { task: "Try 3 regional desserts", points: 70, place: "Various" }
        ],
        rewards: ["Master Foodie Badge", "₹500 restaurant voucher"],
        special_rules: ["No sharing allowed", "Time penalties for leftovers"],
        group_size: params.group_size || 2,
        dietary_preferences: params.dietary_preferences || []
      },
      legendary: {
        title: "Indiranagar Food Marathon",
        difficulty: "legendary",
        points: 500,
        time_limit: params.time_limit || "full day",
        objectives: [
          { task: "Visit 10 restaurants", points: 150, place: "All of Indiranagar" },
          { task: "Try signature dish at each", points: 100, place: "Each restaurant" },
          { task: "No repeating cuisines", points: 80, place: "Diverse selection" },
          { task: "Finish everything ordered", points: 100, place: "No waste" },
          { task: "Document entire journey", points: 70, place: "Photo/video proof" }
        ],
        rewards: ["Legendary Foodie Title", "1 Month Free Adventures", "Hall of Fame Entry"],
        special_rules: ["Must complete in order", "Live updates required", "No outside help"],
        group_size: params.group_size || 2,
        dietary_preferences: params.dietary_preferences || []
      }
    };

    const difficulty = params.difficulty || 'medium';
    const challenge = challenges[difficulty as keyof typeof challenges] || challenges.medium;

    // Add timestamp and unique ID
    const response = {
      ...challenge,
      id: `challenge_${Date.now()}`,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error generating challenge:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate challenge' 
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